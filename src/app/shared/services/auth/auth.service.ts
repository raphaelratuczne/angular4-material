import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';

import { environment } from 'environments/environment';
import { LoadingEventsService } from '../loading-events/loading-events.service';
import { Auth, Company, AuthUser, Permission } from './auth.model';
import { MenuMock } from '../../mockdata/menu';

@Injectable()
export class AuthService {

  // url so servico de login
  private apiUrlAuthorize: string = environment.baseApiUrl.replace('api/','')  + 'oauth/authorize/';
  // url so servico de token
  private apiUrlToken: string = environment.baseApiUrl.replace('api/','')  + 'oauth/token'; // <-- nao colocar barra no final
  // url pra redefinir senha user/resetpass/{cpf}
  private apiUrlResetPass: string = environment.baseApiUrl + 'user/resetpass/';
  // url para validar o token gerado para o primeiro acesso do usuario user/verify/{cpf}/{token}
  private apiUrlVerify: string = environment.baseApiUrl + 'user/verify/';
  // url para salvar nova senha user/newpass/{cpf}/
  private apiUrlNewPass: string = environment.baseApiUrl + 'user/newpass/';
  // url para retornar as empresas autorizadas para o usuario
  private apiUrlCompanies: string = environment.baseApiUrl + 'authuser/companies';
  // url para retornar os dados do usuario
  private apiUrlAuthUser: string = environment.baseApiUrl + 'company/{companyId}/authuser/';
  // id do cliente
  private clientId: string = 'mobilis';
  // senha do cliente
  private clientSecret: string = 'Mobilis#2017';
  // se esta autenticado
  private authenticated: boolean = false;
  // objeto auth
  private static auth: Auth = null;
  // se foi autenticado
  static wasAuthenticated = new EventEmitter<boolean>();
  // hash para encriptar os dados
  private hash: string = null;
  // nome do campo onde os dados serao armazenados
  private labelAuth: string = null;
  // nome do campo para salvar as empresas
  private labelCompanies: string = null;
  // nome do campo para salvar a empresa selecionada
  private labelSelectedCompany: string = null;
  // nome do campo para salvar as permissoes
  private labelAuthUser: string = null;
  // se pode usar storage
  private canSave: boolean = true;
  // url para redirecionar
  public redirectUrl: string;
  // empresas relacionadas ao usuario
  private listCompanies: Company[] = null;
  // empresa selecionada
  private selectedCompany: Company = null;
  // evento de selacao de empresa
  static selectedCompanyEvent = new EventEmitter<Company>();
  // permissoes do usuario
  private authUser: AuthUser = null;
  // evento ao carregar permissoes de usuario
  static authUserLoaded = new EventEmitter<AuthUser>();

  constructor(private http:Http, private router:Router) {
    try {
      this.onContruct();
    } catch(e) {
      if (typeof(Storage) !== 'undefined') {
        sessionStorage.clear();
        localStorage.clear();
        this.onContruct();
      }
    }
  }

  /**
   * definicoes iniciais
   */
  private onContruct(): void {
    // gera um hash (quase) unico
    this.hash = CryptoJS.MD5( ( // converte para MD5
        window.navigator.userAgent + // junta algumas informacoes
        window.navigator.plugins.length +
        window.navigator.mimeTypes.length
      ).replace(/\D+/g, '') // deixa apenas numeros
    ).toString();

    // nome dos campos
    let wnu = window.navigator.userAgent.replace(/\D+/g, ''),
        wa = CryptoJS.enc.Utf8.parse( wnu ),
        waC = CryptoJS.enc.Utf8.parse( '210' + wnu + '012' ), // salga alguns valores
        waSC = CryptoJS.enc.Utf8.parse( '543' + wnu + '345' ),
        waAu = CryptoJS.enc.Utf8.parse( '876' + wnu + '678' );
    this.labelAuth = CryptoJS.enc.Base64.stringify(wa);
    this.labelCompanies = CryptoJS.enc.Base64.stringify( waC );
    this.labelSelectedCompany = CryptoJS.enc.Base64.stringify( waSC );
    this.labelAuthUser = CryptoJS.enc.Base64.stringify( waAu );

    // verifica se pode salvar os dados de login
    this.canSave = typeof(Storage) !== 'undefined';

    // verifica se ja tem algum dado salvo
    if ( this.canSave && (localStorage[this.labelAuth] || sessionStorage[this.labelAuth]) ) {
      // recupera os dados
      const authEncData =           localStorage[this.labelAuth] || sessionStorage[this.labelAuth] || null,
          listCompaniesEncData =    localStorage[this.labelCompanies] || sessionStorage[this.labelCompanies] || null,
          selectedCompanyEncData =  localStorage[this.labelSelectedCompany] || sessionStorage[this.labelSelectedCompany] || null,
          authUserEncData =         localStorage[this.labelAuthUser] || sessionStorage[this.labelAuthUser] || null;
      // decripta
      const authBytes =           authEncData ? CryptoJS.AES.decrypt(authEncData, this.hash) : null,
          listCompaniesBytes =    listCompaniesEncData ? CryptoJS.AES.decrypt(listCompaniesEncData, this.hash) : null,
          selectedCompanyBytes =  selectedCompanyEncData ? CryptoJS.AES.decrypt(selectedCompanyEncData, this.hash) : null,
          authUserBytes =         authUserEncData ? CryptoJS.AES.decrypt(authUserEncData, this.hash) : null;
      // converte para objeto
      AuthService.auth =      authBytes ? JSON.parse(authBytes.toString(CryptoJS.enc.Utf8)) : null;
      this.listCompanies =    listCompaniesBytes ? JSON.parse(listCompaniesBytes.toString(CryptoJS.enc.Utf8)) : null;
      this.selectedCompany =  selectedCompanyBytes ? JSON.parse(selectedCompanyBytes.toString(CryptoJS.enc.Utf8)) : null;
      this.authUser =         authUserBytes ? JSON.parse(authUserBytes.toString(CryptoJS.enc.Utf8)) : null;
      // console.log('dados recuperados', dec);
      this.authenticated = true;
    }
  }

  /**
   * faz o login
   * @param  {string}          cpf
   * @param  {string}          password
   * @param  {boolean}         rememberMe
   * @return {Observable<boolean>}
   */
  public login(cpf:string, password:string, rememberMe:boolean): Observable<boolean> {

    // cabecalho
    let options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': 'Basic ' + btoa(this.clientId+':'+this.clientSecret)
      })
    });

    // dados
    let params = new URLSearchParams();
    params.append('username',cpf);
    params.append('password',password);   
    params.append('grant_type','password');

    // emite o evento para exibir a barra de carregamento
    // LoadingEventsService.emitLoading.emit('auth');
         
    return this.http.post(this.apiUrlToken, params, options)
      .map(res => {
        // guarda o token recebido
        AuthService.auth = new Auth( res.json() );
        // guarda a hora em que o token vai expirar
        let hToken = new Date().getTime() + (AuthService.auth.expires_in * 1000);
        AuthService.auth.expires_at = hToken;
        // console.log(AuthService.auth);

        // emite o evento para avisar que terminou de carregar
        // LoadingEventsService.emitLoaded.emit('auth');

        // se pode salvar
        if ( this.canSave ) {
          // encripta dados
          let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(AuthService.auth), this.hash);
          // se deve salvar
          if ( rememberMe ) {
            localStorage.clear();
            localStorage.setItem(this.labelAuth, ciphertext.toString());
          } else {
            sessionStorage.clear();
            sessionStorage.setItem(this.labelAuth, ciphertext.toString());
          }
        }
        // seta como autenticado
        this.authenticated = true;
        // emite evento de autenticação
        AuthService.wasAuthenticated.emit(this.authenticated);

        return res.status == 200;

      })
      .catch( error => {
        console.error('error login ->',error);
        const body = error.json();
        // filtra mensagem
        const errDesc = (body.error_description == 'Usu&aacute;rio inexistente ou senha inv&aacute;lida' || body.error_description == 'Bad credentials') ? 'CPF inexistente ou senha inválida.' : body.error_description;
        const errMsg = errDesc || body.error;
        return Observable.throw(errMsg);
      } );

  }

  // observable para aguardar a requisicao do token
  // sao usadas variaveis estaticas para serem unicas em toda a aplicacao
  static stationObservable: Observable<boolean>;
  // observable para aguardar pela resposta do primeiro pedido por token
  static stationWaitObservable: Observable<boolean>;
  // subscribe do observable que aguarda a primeira requisicao do token
  static subscribe: Array<any> = [];

  /**
   * revalida o token
   * @return {Observable<boolean>}
   */
  public refreshToken(): Observable<boolean> {
    // verifica se ja ha uma chamada por token
    if ( AuthService.stationObservable ) {
      // verifica se ja ha uma fila de espera pelo token
      if ( AuthService.stationWaitObservable ) {
        // retorna a fila
        return AuthService.stationWaitObservable;
      } else {
        // se nao ha uma fila, cria uma
        AuthService.stationWaitObservable = Observable.create( observer => {
          // guarda o subscribe da fila
          // guarda em um array pois cada retorno de stationWaitObservable cria
          // um subscribe diferente
          AuthService.subscribe.push(observer);
        } );
        // retorna a fila
        return AuthService.stationWaitObservable;
      }
    }

    // refresh token
    let refreshToken = AuthService.auth.refresh_token;

    // dados
    let body = 'grant_type=refresh_token&refresh_token=' + refreshToken;

    // cabecalho
    let options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': 'Basic ' + btoa(this.clientId+':'+this.clientSecret)
      })
    });

    // emite o evento para exibir a barra de carregamento
    LoadingEventsService.emitLoading.emit('auth');

    AuthService.stationObservable = this.http.post(this.apiUrlToken, body, options)
      .map(res => {
        // console.log('resultado recarregar token ->', res);

        // guarda o token recebido
        AuthService.auth = new Auth( res.json() );
        // guarda a hora em que o token vai expirar
        let hToken = new Date().getTime() + (AuthService.auth.expires_in * 1000);
        AuthService.auth.expires_at = hToken;

        // emite o evento para avisar que terminou de carregar
        LoadingEventsService.emitLoaded.emit('auth');

        // console.log('novo token ->', this.auth);
        // se pode salvar
        if ( this.canSave ) {
          // encripta dados
          let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(AuthService.auth), this.hash);
          // se deve salvar
          if ( localStorage.getItem(this.labelAuth) )
            localStorage.setItem(this.labelAuth, ciphertext.toString());

          else if ( sessionStorage.getItem(this.labelAuth) )
            sessionStorage.setItem(this.labelAuth, ciphertext.toString());

        }
        // seta como autenticado
        this.authenticated = true;

        // verifica se tem uma fila de espera
        if ( AuthService.stationWaitObservable ) {
          for (let i in AuthService.subscribe) {
            // avanca a fila
            AuthService.subscribe[i].next(true);
            // finaliza
            AuthService.subscribe[i].complete();
          }
        }

        return res.status == 200;
      })
      .finally( () => {
        // limpa a chamada
        AuthService.stationObservable = null;
        AuthService.stationWaitObservable = null;
        AuthService.subscribe = [];
      } )
      .catch( error => this.handleError(error) );

    return AuthService.stationObservable;
  }

  /**
   * faz o logoff da aplicacao
   * @return {Observable<boolean>}
   */
  public logoff(): Observable<boolean> {
    // seta autenticado como false
    this.authenticated = false;
    // limpa os dados de login
    AuthService.auth = null;
    this.listCompanies = null;
    this.selectedCompany = null;
    this.authUser = null;
    // limpa o cache
    if ( this.canSave ) {
      sessionStorage.clear();
      localStorage.clear();
    }
    // emite evento de autenticação
    AuthService.wasAuthenticated.emit(this.authenticated);

    return Observable.of(true);
  }

  /**
   * verifica se o token é valido
   * @param  {string}              cpf
   * @param  {string}              token
   * @return {Observable<boolean>}
   */
  public verifyToken(cpf:string, token:string): Observable<boolean> {
    // requisita um token
    return this.getToken()
      .flatMap( token => {

        // options
        let options = new RequestOptions({
          headers: new Headers({
            'Authorization': 'Bearer ' + token
          })
        });

        let url = `${this.apiUrlVerify}${cpf}/${token}`;

        // emite o evento para exibir a barra de carregamento
        LoadingEventsService.emitLoading.emit('auth');

        return this.http.get(url, options)
          .map( res => {
            // emite o evento para avisar que terminou de carregar
            LoadingEventsService.emitLoaded.emit('auth');

            return res.status == 200;
          } )
          .catch( this.handleError );
      } );

  }

  /**
   * retorna se esta autenticado
   * @return {boolean}
   */
  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  /**
   * retorna o token, se tiver expirado, requisita um novo
   * @return {Observable<string>} token
   */
  public getToken(): Observable<string|null> {
    // pega a hora atual
    let h = new Date().getTime();
    // verifica se o token ainda vale (se falta mais de 10s para expirar)
    if ( AuthService.auth && AuthService.auth.expires_at > (h - 10000) ) {
      // se ainda nao vai expirar, retorna o token
      return Observable.of(AuthService.auth.access_token);

    } else if ( AuthService.auth && AuthService.auth.expires_at <= (h - 10000) ) {
      // se vai expirar, requisita um novo token
      return this.refreshToken()
        .map( ok => AuthService.auth.access_token );
    }

    return Observable.of(null);
  }

  /**
   * redefine a senha de usuario
   * @param  {string}              cpf
   * @return {Observable<boolean>}
   */
  public resetPass(cpf:string): Observable<boolean> {

    // url
    const url = this.apiUrlResetPass + cpf;

    // emite o evento para exibir a barra de carregamento
    // LoadingEventsService.emitLoading.emit('auth');

    return this.http.get(url)
      .map( res => {
        console.log(res);
        // emite o evento para avisar que terminou de carregar
        // LoadingEventsService.emitLoaded.emit('auth');

        return res.status == 200;
      })
      .catch( this.handleError );

  }


  /**
   * seta nova senha de usuario
   * @param  {string}              cpf
   * @return {Observable<boolean>}
   */
  public newPass(pass:string, token:string): Observable<boolean> {

    // options
    const options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    // body
    const body = {
      token: token,
      password: pass
    };

    // emite o evento para exibir a barra de carregamento
    // LoadingEventsService.emitLoading.emit('auth');

    return this.http.post(this.apiUrlNewPass, body, options)
      .map( res => {
        console.log(res);
        // emite o evento para avisar que terminou de carregar
        // LoadingEventsService.emitLoaded.emit('auth');

        return res.status == 200;
      })
      .catch( error => {
        const err = error.json();
        if ( err.status == 401 )
          return Observable.throw('Token inválido');
        else
          return this.handleError(error);
      } );

  }

  /**
   * solicita lista de empresas relacionadas ao usuario
   * @return {Observable<Company[]>}
   */
  public getCompanies(): Observable<Company[]> {
    if ( this.listCompanies !== null ) {
      return Observable.of(this.listCompanies);
    }

    // requisita um token
    return this.getToken()
      .flatMap( token => {

        // options
        let options = new RequestOptions({
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        });

        // emite o evento para exibir a barra de carregamento
        // LoadingEventsService.emitLoading.emit('auth');

        return this.http.get(this.apiUrlCompanies, options)
          .map( res => {
            // emite o evento para avisar que terminou de carregar
            // LoadingEventsService.emitLoaded.emit('auth');

            this.listCompanies = res.json();
            // ordena os resultados
            this.listCompanies.sort( (a,b) => a.id > b.id ? 1 : ((a.id < b.id) ? -1 : 0) );
            // console.log(this.listCompanies);
            for (let i in this.listCompanies)
              this.listCompanies[i] = new Company(this.listCompanies[i]);

            // se pode salvar
            if ( this.canSave ) {
              // encripta dados
              let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.listCompanies), this.hash);
              // se deve salvar
              if ( localStorage.getItem(this.labelAuth) )
                localStorage.setItem(this.labelCompanies, ciphertext.toString());

              else if ( sessionStorage.getItem(this.labelAuth) )
                sessionStorage.setItem(this.labelCompanies, ciphertext.toString());


            }
            // console.log(this.listCompanies);
            return this.listCompanies;
          } )
          .catch( this.handleError );

      } );
  }

  /**
   * seleciona uma das empresas relacionadas do usuario
   * @param {number}    key key da empresa na lista de empresas
   * @return {Company}      retorna a empresa selecionada
   */
  public setSelectedCompany(key?: number): Company {
    // debugger;
    // se ja tem uma empresa selecionada
    if ( this.selectedCompany != null ) {
      // limpa permicoes carregadas ao alterar a empresa
      this.clearAuthUser();
    }

    if ( key ) {
      for (let company of this.listCompanies) {
        if ( company.id == key ) {
          this.selectedCompany = company;
          break;
        }
      }
    // se nao passou um id, seleciona a empresa 0
    } else if ( this.listCompanies != null && this.listCompanies.length > 0 ) {
      // for (let company of this.listCompanies) {
      //   if ( company.id == 0 ) {
      //     this.selectedCompany = company;
      //     break;
      //   }
      // }
      this.selectedCompany = this.listCompanies[0];
    }

    // se pode salvar
    if ( this.canSave && this.selectedCompany ) {
      // encripta dados
      let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.selectedCompany), this.hash);
      // se deve salvar
      if ( localStorage.getItem(this.labelAuth) )
        localStorage.setItem(this.labelSelectedCompany, ciphertext.toString());

      else if ( sessionStorage.getItem(this.labelAuth) )
        sessionStorage.setItem(this.labelSelectedCompany, ciphertext.toString());

    }

    // emite evento ao selecinar empresa
    if ( this.selectedCompany )
      AuthService.selectedCompanyEvent.emit(this.selectedCompany);

    return this.selectedCompany;
  }

  /**
   * retorna a empresa selecionada
   * @return {Company}
   */
  public getSelectedCompany(): Company {
    if ( this.selectedCompany == null )
        return this.setSelectedCompany();

    return this.selectedCompany;
  }

  /**
   * retorna as permissoes do usuario
   * @return {Observable<AuthUser>}
   */
  public getAuthUser(): Observable<AuthUser> {
    if ( this.authUser ) {
      // console.log(this.authUser);
      return Observable.of(this.authUser);
    }

    let companyId;
    // se nao selecionou uma empresa, seleciona a primeira da lista
    if ( this.selectedCompany == null ) {
      companyId = this.setSelectedCompany().id;
    } else {
      companyId = this.selectedCompany.id;
    }
    // console.log('empresa selecionada para solicitar permissoes ->', companyId);

    // requisita um token
    return this.getToken()
      .flatMap( token => {

        // options
        const options = new RequestOptions({
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        });

        // substirui o id da empresa na url
        const url = this.apiUrlAuthUser.replace('{companyId}', String(companyId));
        // console.log(url);

        return this.http.get(url, options)
          .map( res => {
            this.authUser = new AuthUser( res.json() );
            // console.log('auth.service-getAuthUser ->', this.authUser);

            // se pode salvar
            if ( this.canSave ) {
              // encripta dados
              let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.authUser), this.hash);
              // se deve salvar
              if ( localStorage.getItem(this.labelAuth) )
                localStorage.setItem(this.labelAuthUser, ciphertext.toString());

              else if ( sessionStorage.getItem(this.labelAuth) )
                sessionStorage.setItem(this.labelAuthUser, ciphertext.toString());

            }

            // emite evento ao carregar dados
            AuthService.authUserLoaded.emit(this.authUser);
            // console.log(this.authUser);

            return this.authUser;
          } )
          .catch( this.handleError );

      } );
  }

  /**
   * retorna as permissoes do usuario para uma pagina
   * @param  {number}                 idPage id da pagina
   * @return {Observable<Permission>}
   */
  public getAuthUserPage(idPage: number): Observable<Permission> {
    if ( this.authUser ) {
      return Observable.of( this.authUser.userType.permissions.find( p => p.feature.id == idPage ) );
    } else {

      // pega as permissoes do usuario
      return this.getAuthUser()
        .map( authUser => {
          return authUser.userType.permissions.find( p => p.feature.id == idPage );
        } );
    }
  }

  /**
   * retorna as permissoes do usuario para a url passada
   * @param  {string}     url
   * @return {Observable<Permission|null>}
   */
  public getAuthUserByUrl(url:string): Observable<Permission|null> {

    let id = null;
    // faz uma busca no menu para pega o id da pagina
    for (let i in MenuMock.root) {
      if (typeof(MenuMock.root[i]['sub']) != 'undefined') {
        for (let j in MenuMock.root[i]['sub']) {
          if (MenuMock.root[i]['sub'][j]['link'] == url) {
            id = MenuMock.root[i]['sub'][j]['id'] || null;
            break;
          }
        }
        if (id != null)
          break;
      }
    }

    // se encontrou um id
    if (id != null) {
      return this.getAuthUserPage(id);
    }

    return Observable.of(null);
  }

  /**
   * limpa as permissoes do usuario
   */
  public clearAuthUser(): void {
    this.authUser = null;

    if ( localStorage[this.labelAuthUser] )
      localStorage.removeItem(this.labelAuthUser);

    if ( sessionStorage[this.labelAuthUser] )
      sessionStorage.removeItem(this.labelAuthUser);
  }

  /**
   * funcao de erro
   * @param  {Response | any} error erro ocorrido
   */
  private handleError (error: Response | any) {
    console.error('auth,service error ->', error);
    // se for erro de token, redireciona para a tela de login
    if ( error.status == 400 || error.status == 401 ) {
      if ( this.router.url.indexOf('login') == -1 ) {
        this.redirectUrl = this.router.url;
        // console.log('salvou url auth.service ->', this.redirectUrl);
      }

      this.logoff()
        .subscribe( v => this.router.navigate(['/login']) );
    }

    // emite o evento para avisar que terminou de carregar
    LoadingEventsService.emitLoaded.emit('auth');
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body['error'] || JSON.stringify(body);
      const msg = body['message'] || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err} ${msg}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    // console.error('deu erro ->', errMsg);
    return Observable.throw(errMsg);
  }
}

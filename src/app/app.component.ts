import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { texts,
         MenuMock,
        //  SearchMock,
         LoadingEventsService,
         AuthService,
         AuthUser } from './shared';

import * as packageObject from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // versao
  public appVersion;
  // textos
  public txt = texts.topNav;
  // barra de loading geral
  public generalLoading: boolean = false;
  // fila de carregamento
  public loadingRow: Array<string> = [];
  // Mock Menu
  readonly mainMenu = MenuMock.root;
  // menu filtrado pelas permissoes
  public filtredMenu = MenuMock.root;
  // Mock search item
  // public searchItems = SearchMock.items;

  public showTopnavSearch: boolean = false;
  public searchItem: any;
  public activeSubMenuName: string;
  public date: Date;

  public state = {
    topnavTitle: this.txt.title,
    messagePanelOpen: false,
    sidenavOpen: false,
    sidenavMode: 'over',
    sidenavCollapse: false,
    pageFooter: true,
  }

  // se esta autenticado
  public isAuthenticated: boolean = false;
  // se esta na tela de login
  public inLoginScreen: boolean = true;
  // lista de empresas
  public companiesList = [];
  // nome da empresa selecionada
  public companyName = '';
  // id da empresa selecionada
  private companyId: number = null;
  // id da empresa selecinada anterirormente
  private lastCompanyId: number = null;
  // permissoes do usuario
  private authUser: AuthUser = null;

  constructor(private router:Router,
              private authService: AuthService) {

    this.date = new Date();
    setInterval(() => {
      this.date = new Date();
    }, 1000);
    // versão do app
    this.appVersion = packageObject.version;
  }

  ngOnInit() {
    this.onResize();
    // escuta eventos de inicio de carregamento
    LoadingEventsService.emitLoading.subscribe(n => this.addLoadingEvent(n));
    // escuta eventos de fim de carregamento
    LoadingEventsService.emitLoaded.subscribe(n => this.removeLoadingEvent(n));
    // escuta evento de login
    AuthService.wasAuthenticated.subscribe(v => {
      this.isAuthenticated = v;
      if ( this.isAuthenticated ) {
        this.onResize();
      } else {
        // reseta configuracoes no logoff
        this.state.messagePanelOpen = false;
        this.state.sidenavOpen = false;
        this.state.sidenavMode = 'over';
        this.state.sidenavCollapse = false;
        this.state.pageFooter = true;
        this.companiesList = [];
        this.companyId = null;
        this.lastCompanyId = null;
      }
    });



    // escuta evento ao selecionar empresa
    AuthService.selectedCompanyEvent.subscribe( company => {
      // console.log('app.component selectedCompanyEvent', company);
      this.companyName = company.name;
      this.companyId = company.id;

      // carrega lista de empresas para popular menu direito
      this.authService.getCompanies()
        .subscribe( companies => {
          this.setCompaniesList(companies);
        } );
    } );

    // escuta evento ao carregar permissoes do usuario
    AuthService.authUserLoaded.subscribe( au => {
      this.authUser = au;
      // console.log('app.component-authUserLoaded ->', this.authUser);
    } );

    // verifica se esta autenticado
    this.isAuthenticated = this.authService.isAuthenticated();
    // se ja esta autenticado
    if ( this.isAuthenticated ) {
      // carrega lista de empresas para popular menu direito
      this.authService.getCompanies()
        .subscribe( companies => {
          // console.log('companies',companies);
          this.setCompaniesList(companies);
        } );

      // nome da empresa selecionada
      this.companyName = this.authService.getSelectedCompany().name;
      // id da empresa selecionada
      this.companyId = this.authService.getSelectedCompany().id;
      // console.log('companyId',this.companyId);

      // pega as permissoes de usuarios
      this.authService.getAuthUser()
        .subscribe( au => {
          this.authUser = au;
          // console.log('app.component-getAuthUser', this.authUser);
        } );
    }

    // verifica se esta na tela de login (para esconder o menu)
    this.inLoginScreen = this.router.url.indexOf('login') > -1 ? true : false;
    // escuta ao mudar de telas
    this.router.events.subscribe( event => {
      if ( event instanceof NavigationStart ) {
        this.inLoginScreen = (event.url.indexOf('login') > -1 || event.url == '/') ? true : false;
      }

      if ( event instanceof NavigationEnd ) {
        this.onResize();
        if ( event.url.indexOf('dashboard') > -1 ) {
        }
      }
    } );

    // se, ao carregar, nao for a tela de login, requisita um novo token
    if ( !this.inLoginScreen )
      this.authService.getToken()
        .subscribe( token => token );
  }

  /**
   * escuta evento de resize para exibir/esconder o menu
   */
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if ( !this.inLoginScreen ) {
      let bodyWidth: number = document.body.clientWidth;
      if (bodyWidth > 960) {
        if (this.state.sidenavMode !== 'side') {
          this.state.sidenavOpen = true;
        }
        this.state.sidenavMode = 'side';
      } else if (bodyWidth <= 960 && bodyWidth > 600) {
        this.state.sidenavMode = 'push';
        this.state.sidenavOpen = false;
      } else if (bodyWidth <= 600) {
        this.state.sidenavMode = 'over';
        this.state.sidenavOpen = false;
      }
    }
  }

  /**
   * adiciona alerta de servico na fila
   * @param {string} nome nome do evento
   */
  private addLoadingEvent(nome: string): void {
    this.loadingRow.push(nome);
    this.verifyLoadingRow();
  }

  /**
   * remove alerta de servico na fila
   * @param {string} nome nome do evento
   */
  private removeLoadingEvent(nome: string): void {
    if ( this.loadingRow.indexOf(nome) > -1 ) {
      this.loadingRow.splice(this.loadingRow.indexOf(nome), 1);
    }
    this.verifyLoadingRow();
  }

  /**
   * verifica se a fila de servicos contem algum item para exibir/esconder barra de loading
   */
  private verifyLoadingRow(): void {
    // console.log(this.loadingRow, this.loadingRow.length);
    this.generalLoading = this.loadingRow.length > 0 ? true : false;
  }

  /**
   * filtra os itens do menu de acordo com as permissoes do usuario
   */
  public filterMenu() {
    // verifica se precisa filtrar o menu (se alterou a empresa ou nao ha lista do menu)
    if (this.lastCompanyId != this.companyId) {

      // se ainda nem loggou
      if (  this.authUser === null || this.companyId === null ) {
        this.filtredMenu = this.mainMenu;

      } else {
        // filtra subitens
        this.filtredMenu = this.mainMenu.map( itemMenu => {
          // se nao tem um submenu, retora o elemento
          if ( typeof(itemMenu['sub']) == 'undefined' ) {
            return itemMenu;

          } else {
            // clona o subitem
            let newItemMenu = Object.assign({}, itemMenu);

            // filtra os subitens pelas permissoes
            newItemMenu['sub'] = newItemMenu['sub'].filter( subItem => {
              // se nao tem um id (nao possui restricao), retorna o elemento
              if ( typeof(subItem['id']) == 'undefined' ) {
                return true;

              } else {
                // pega a permissao para o item
                const permission = this.authUser.userType.permissions.find( per => per.feature.id == subItem['id'] );

                if ( permission ) {
                  // se for um usuario admin (companyId=0)
                  if ( this.companyId == 0 ) {
                    // retorna somente opcoes de adm
                    return permission.authRead && permission.feature.enabledInAdminArea;

                  } else {
                    // se nao é usuaro admin
                    // retorna se possui permisao para leitura e se nao é restrito a admin
                    return permission.authRead && permission.feature.enabledInSchoolArea;
                  }
                } else {
                  // se nao ha uma permissao configurada, libera o item
                  return true;
                }
              }
            } );
            return newItemMenu;
          }
        } )
        // filtra menus vazios
        .filter( itemMenu => {
          // se nao tem um submenu, retora o elemento
          if ( typeof(itemMenu['sub']) == 'undefined' )
            return true;
          else
            return itemMenu['sub'].length > 0;
        } );

        this.lastCompanyId = this.companyId;
      }
    }

    return this.filtredMenu;
  }

  /**
   * filtra itens da busca pelos itens do menu
   * @return {[type]} [description]
   */
  public filterSearch() {
    let itens = [];
    const menu = this.filterMenu();
    for (let item in menu) {

      if ( typeof(menu[item]['sub']) == 'undefined' ) {

        itens.push({
          name: menu[item]['name'],
          title: menu[item]['title'],
          link: menu[item]['link']
        });

      } else {

        for (let sub in menu[item]['sub']) {
          itens.push({
            name: menu[item]['sub'][sub]['name'],
            title: menu[item]['sub'][sub]['title'],
            link: menu[item]['sub'][sub]['link']
          });
        }

      }
    }
    return itens;
  }

  /**
   * seta a lista de empresas para a barra lateral
   * @param {Company[]} companies lista de empresas
   */
  setCompaniesList(companies): void {
    if (companies) {
      // agrupa a lista de empresas por cidade
      let companiesListObj = {};
      for (let company of companies) {
        // se nao for a empresa principal
        if ( company.id != 0 ) {
          const city = company.address.city.name;

          if ( typeof(companiesListObj[city]) == 'undefined' ) {
            companiesListObj[city] = [];
          }

          companiesListObj[city].push( company );
        }
      }
      this.companiesList = [];
      // converte para array
      for (let city in companiesListObj) {
        this.companiesList.push({city: city, companies: companiesListObj[city]});
      }
    }
  }

  public selectCompany(id): void {
    console.log('empresa selecionada ->', id);
    if ( id != this.companyId ) {
      // seta o id da empresa anterior
      this.lastCompanyId = this.companyId;
      // limpa dados
      this.companyId = this.authUser = null;
      // seta a empresa
      // this.authService.setSelectedCompany(id);
      // this.companyId = this.authService.getSelectedCompany().id;
      this.companyId = this.authService.setSelectedCompany(id).id;
      // console.log('selecionou outra empresa empresa ->',this.companyId);
      // recarrega as persissoes do usuario
      this.authService.getAuthUser()
        .subscribe( au => {
          this.authUser = au;
          // console.log('novo usuario carregado ->',this.mainMenu, this.filterMenu());
        } );
      // vai para o dashboard
      this.router.navigate(['dashboard']);
      // fecha o meu lateral
      this.state.messagePanelOpen = false;
    }
  }

  /**
   * faz logout do sistema
   */
  public logout():void {
    this.authService.logoff()
      .subscribe( l => this.router.navigate(['login']) );
  }

  /**
   * exibe/esconde menu lateral esq
   */
  public toggleSidenav(): void {
    this.state.sidenavOpen = !this.state.sidenavOpen;
    this.resizeSidenav();
  }

  /**
   * dispara evento de resize
   */
  private resizeSidenav(): void {
    if (this.state.sidenavMode === 'side') {
      let resizeEvent = document.createEvent('HTMLEvents');
      resizeEvent.initEvent('resize', true, true);
      document.dispatchEvent(resizeEvent);
    }
  }

  /**
   * exibe/esconde campo de busca
   */
  public toggleTopnavSearch(): void {
    if (this.state.sidenavMode === 'over') {
      this.showTopnavSearch = false;
    } else {
      this.showTopnavSearch = !this.showTopnavSearch;
    }
  }

  /**
   * vai para a tela do item selecionado
   */
  public selectedSearchItem(event): void {
    // if (this.searchItems) {
    //   for (let item of this.searchItems) {
    //     if (item.link === this.searchItem) {
    //       this.router.navigate([this.searchItem]);
    //       break;
    //     }
    //   }
    // }
    // const item = this.filterSearch().find( i => i.link === this.searchItem );
    this.router.navigate([this.searchItem]);
  }

  // toggleFullscreen() {
  //   // $(document).toggleFullScreen();
  // }

  /**
   * esnconde o menu esq
   */
  public closeSidenav(): void {
    this.state.sidenavOpen = false;
    this.resizeSidenav();
  }

  /**
   * exibe menu esq
   */
  public openSidenav(): void {
    this.closeMessagePanel();
    this.state.sidenavOpen = true;
    this.resizeSidenav();
  }

  /**
   * exibe/esconde o menu esq
   */
  public toggleSidenavCollapse(): void {
    if (this.state.sidenavCollapse) {
      this.resizeSidenav();
    }
  }

  /**
   * expande/contrai itens do menu esq
   * @param {string}  menuName
   * @param {boolean} isSub
   * @param {boolean} isParent
   */
  public toggleSidenavMenu(menuName: string, isSub: boolean, isParent: boolean): void {
    if (isParent) {
      this.activeSubMenuName = this.activeSubMenuName === menuName ? null : menuName;
      return;
    }

    if (isSub) {
      if (this.state.sidenavMode === 'push' ||
        this.state.sidenavMode === 'over') {
        this.toggleSidenav();
      }
      return;
    }

    this.activeSubMenuName = null;
    if (this.state.sidenavMode === 'push' ||
      this.state.sidenavMode === 'over') {
      this.toggleSidenav();
    }
  }

  /**
   * exibe/esconde janela de mensagens
   */
  public toggleMessagePanel(): void {
    this.state.messagePanelOpen = !this.state.messagePanelOpen;
  }

  /**
   * exibe janela de mensagens
   */
  public openMessagePanel(): void {
    if (this.state.sidenavMode === 'push' ||
      this.state.sidenavMode === 'over') {
      this.closeSidenav();
    }
    this.state.messagePanelOpen = true;
  }

  /**
   * esconde janela de mensagens
   */
  public closeMessagePanel(): void {
    this.state.messagePanelOpen = false;
  }
}

import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class ChildGuard implements CanActivateChild {

  constructor(
    private authService: AuthService
    // private router: Router
    ) { }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean> | boolean {

    // se estiver autenticado
    if ( this.authService.isAuthenticated() ) {
      // pega a url
      let url = state.url;
      // pega as permissoes do usuario
      return this.authService.getAuthUserByUrl(url)
        .map( permission => {
          // se encontrar as permissoes
          // retorna a permissao configurada para ler ou true
          return permission != null ? permission.authRead : true;
        } );

      // return true;
    } else {
      // this.router.navigate(['/login']);
      return false;
    }
  }

}

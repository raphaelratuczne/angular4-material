import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean> | boolean {

    // console.log('canActivate', state, route);

    let url = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url:string): boolean {

    if ( this.authService.isAuthenticated() )
      return true;

    // salva url para redirecionar apos o login
    this.authService.redirectUrl = url;
    // console.log('salvou url auth.guard ->', this.authService.redirectUrl);
    // redireciona para a tela de login
    this.router.navigate(['/login']);

    return false;
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    // TODO verificar problema de rota completa
    // console.log('canLoad', route);
    // if ( this.authService.isAuthenticated() )
      return true;

    // this.router.navigate(['/login']);

    // return false;
  }

}

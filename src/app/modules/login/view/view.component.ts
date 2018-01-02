import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

// import { texts } from 'app/shared';
import { CommonFormComponent, Company } from 'app/shared';
// import { Company } from '../../moduleR/driving-school';

@Component({
  selector: 'login-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent extends CommonFormComponent implements OnInit {

  // lista de empresas
  public companiesList = [];

  constructor(private router: Router, private injector:Injector) {
    //                modulo  pagina
    super(injector, ['login','view']);
  }

  ngOnInit() {
    // pega a lista de empresas
    this.authService.getCompanies()
      .subscribe( list => {
        // console.log('view-getCompanies ->', list)
        // agrupa a lista de empresas por cidade
        let companiesListObj = {};
        for (let company of list) {
          company = new Company(company);
          // se nao for a empresa principal
          if ( company.id != 0 ) {
            const city = company.address.city.name;

            if ( typeof(companiesListObj[city]) == 'undefined' ) {
              companiesListObj[city] = [];
            }

            companiesListObj[city].push( company );
          }
        }
        // converte para array
        for (let city in companiesListObj) {
          this.companiesList.push({city: city, companies: companiesListObj[city]});
        }
        // console.log( this.companiesList );
      } );
  }

  // implementa classes herdadas
  buildForm() {}
  onChangeValues() {}
  send() {}
  cancel() {}

  public selectCompany(id): void {
    // console.log('selectCompany',id);
    // seta a empresa 0
    this.authService.setSelectedCompany(id);
    // carrega as permissoes do usuario
    this.authService.getAuthUser()
      .subscribe( res => {
        // console.log('view-getAuthUser ->',res);
        // vai para o dashboard
        this.router.navigate(['dashboard']);
      } );
  }

}

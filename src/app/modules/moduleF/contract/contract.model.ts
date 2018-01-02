import { CommonModel } from 'app/shared';
import { User } from '../../moduleCf/user';
import { DrivingSchool } from '../../moduleR/driving-school';

export class Contract extends CommonModel {

  id: number = null;
  active: boolean = null;
  drivingSchool: { id:number }|DrivingSchool = { id:null };
  startDate: string|number|Date = null;
  endDate: string|number|Date = null;
  lessonPrice: number|string = null;
  advanceDaysToAlert: number = null;
  usersToAlert: Array<{ id:number, name?:string }>  = []; // o name só serve para o front

  constructor(obj:Object = null) {
    super();
    this.merge(obj);

    if ( typeof(this.drivingSchool['company']) != 'undefined' )
      this.drivingSchool = new DrivingSchool(this.drivingSchool);

    for (let u in this.usersToAlert) {
      // se tem o campo cpf, assume q veio do back e
      // junta nome e sobrenome para exibir no front
      if ( typeof(this.usersToAlert[u]['cpf']) != 'undefined' ) {
        this.usersToAlert[u] = {
          id:this.usersToAlert[u].id,
          name: `${this.usersToAlert[u]['firstName']} ${this.usersToAlert[u]['lastName']}`
        };
      // se nao tem o campo cpf, assume q veio do front e
      // cria o obj sem campo name para enviar para o back
      } else {
        this.usersToAlert[u] = {
          id:this.usersToAlert[u].id,
        };
      }
    }
  }
}

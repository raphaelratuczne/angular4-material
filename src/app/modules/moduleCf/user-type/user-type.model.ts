import { CommonModel } from 'app/shared';

export class UserType extends CommonModel {

  id: number = null;
  description: string = null;
  permissions: Permission[] = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    for (let i in this.permissions)
      this.permissions[i] = new Permission(this.permissions[i]);
  }
}

export class Permission extends CommonModel {

  id: number = null;
  authCreate: boolean = null;
  authDelete: boolean = null;
  authRead: boolean = null;
  authUpdate: boolean = null;
  feature: Feature = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
    this.feature = new Feature(this.feature);
  }
}

export class Feature extends CommonModel {

  id: number = null;
  enabledInAdminArea: boolean = null;
  enabledInSchoolArea: boolean = null;
  description: string = null;
  role: string = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

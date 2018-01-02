import { CommonModel } from 'app/shared';

export class SoftwareVersion extends CommonModel {

  id: number = null;
  version: string = null;
  description: string = null;
  releaseDate: number | Date = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

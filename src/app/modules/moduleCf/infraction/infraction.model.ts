import { CommonModel } from 'app/shared';

export class Infraction extends CommonModel {

  code: number = null;
  category: number = null;
  points: number = null;
  article: string = null;
  paragraph: string = null;
  law: string = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
}

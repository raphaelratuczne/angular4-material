import { CommonModel } from 'app/shared';

export class SimulationEvent extends CommonModel {

  id: number = null;
  category: number = null;
  description: string = null;

  // lista de categorias
  categoriesList?: Object;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
};

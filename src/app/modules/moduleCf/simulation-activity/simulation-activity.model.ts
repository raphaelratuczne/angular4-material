import { CommonModel } from 'app/shared';

export class SimulationActivity extends CommonModel {

  id: number = null;
  description: string = null;

  constructor(obj:Object = null) {
    super();
    this.merge(obj);
  }
};

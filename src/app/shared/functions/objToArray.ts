/**
 * converte um objeto para uma lista
 * @param  {Object} object {[key:string|number]:value...}
 * @return {Object[]}      {id:[key:number], value:value}[]
 */
export const objectToArray = (object:Object):Array<{id:number, value:any}> => Object.keys(object).map( key => { return {id:+key, value:object[key]}; } );

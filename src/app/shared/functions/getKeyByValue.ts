import { removeAccents } from './remove-accents';

/**
 * busca a chave pelo valor passado
 * @param  {Object} object objeto onde sera feita a busca
 * @return {string}        texto a ser procurado
 */
export const getKeyByValue = (object:Object, value:string):number => +(Object.keys(object).find( key => removeAccents( String(object[key]) ).toLowerCase().indexOf(removeAccents(value).toLowerCase()) > -1 ));

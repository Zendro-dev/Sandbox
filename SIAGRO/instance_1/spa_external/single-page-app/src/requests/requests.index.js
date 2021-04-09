/**
 * requests.index.js module provides function loadApi() which
 * imports dynamically the api modules required.
 */

const modelNamesIndex = [
  "caracteristica_cuantitativa",
  "metodo",
  "referencia",
  "registro",
  "taxon",
  "role",
  "role_to_user",
  "user",
];

/**
 * loadApi  imports (dynamically) the api requests from modules required in @target parameter and
 * returns and object with each of the modules required.
 * 
 * @param {array | string} target target model's name string to import or string array of
 * target models names to import.
 * @returns {object}  object with api index modules imported of the required models.
 */
export async function loadApi(target) {
  //check
  if(!target || (typeof target !== 'string' && !Array.isArray(target))) throw new Error(`expected string or array in arg: ${target}`);

  let api = {};
  let _target = [];

  //set target array
  if(typeof target === 'string') _target.push(target);
  else {
    for(let i=0; i<target.length; i++) {
      if(!_target.includes(target[i])) _target.push(target[i]);
    }
  }
  //loads api module of models names in target array
  for(let i=0; i<_target.length; i++) {
    let modelName = _target[i];
    //check
    if(!modelNamesIndex.includes(modelName)) throw new Error(`target model name provided '${modelName}' does not exists`);

    let module = null;
    switch(modelName) {
      case 'caracteristica_cuantitativa': 
        module =  await import(/* webpackChunkName: "Request-CaracteristicaCuantitativa" */ './caracteristica_cuantitativa');
        api['caracteristica_cuantitativa'] = module.default;
        break;
      case 'metodo': 
        module =  await import(/* webpackChunkName: "Request-Metodo" */ './metodo');
        api['metodo'] = module.default;
        break;
      case 'referencia': 
        module =  await import(/* webpackChunkName: "Request-Referencia" */ './referencia');
        api['referencia'] = module.default;
        break;
      case 'registro': 
        module =  await import(/* webpackChunkName: "Request-Registro" */ './registro');
        api['registro'] = module.default;
        break;
      case 'taxon': 
        module =  await import(/* webpackChunkName: "Request-Taxon" */ './taxon');
        api['taxon'] = module.default;
        break;
      case 'role':
        module = await import(/* webpackChunkName: "Request-Role" */ './role');
        api['role'] = module.default;
        break;
      case 'role_to_user':
        module = await import(/* webpackChunkName: "Request-RoleToUser" */ './role_to_user');
        api['role_to_user'] = module.default;
        break;
      case 'user':
        module = await import(/* webpackChunkName: "Request-User" */ './user');
        api['user'] = module.default;
        break;

      default:
        break;
    }
  }
  return api;
}
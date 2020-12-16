/**
 * requests.index.js module provides function loadApi() which
 * imports dynamically the api modules required.
 */

const modelNamesIndex = [
  "breedingMethod",
  "contact",
  "environmentParameter",
  "event",
  "eventParameter",
  "germplasm",
  "image",
  "location",
  "method",
  "observation",
  "observationTreatment",
  "observationUnit",
  "observationUnitPosition",
  "observationVariable",
  "ontologyReference",
  "program",
  "scale",
  "season",
  "study",
  "trait",
  "trial",
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
      case 'breedingMethod': 
        module =  await import(/* webpackChunkName: "Request-BreedingMethod" */ './breedingMethod');
        api['breedingMethod'] = module.default;
        break;
      case 'contact': 
        module =  await import(/* webpackChunkName: "Request-Contact" */ './contact');
        api['contact'] = module.default;
        break;
      case 'environmentParameter': 
        module =  await import(/* webpackChunkName: "Request-EnvironmentParameter" */ './environmentParameter');
        api['environmentParameter'] = module.default;
        break;
      case 'event': 
        module =  await import(/* webpackChunkName: "Request-Event" */ './event');
        api['event'] = module.default;
        break;
      case 'eventParameter': 
        module =  await import(/* webpackChunkName: "Request-EventParameter" */ './eventParameter');
        api['eventParameter'] = module.default;
        break;
      case 'germplasm': 
        module =  await import(/* webpackChunkName: "Request-Germplasm" */ './germplasm');
        api['germplasm'] = module.default;
        break;
      case 'image': 
        module =  await import(/* webpackChunkName: "Request-Image" */ './image');
        api['image'] = module.default;
        break;
      case 'location': 
        module =  await import(/* webpackChunkName: "Request-Location" */ './location');
        api['location'] = module.default;
        break;
      case 'method': 
        module =  await import(/* webpackChunkName: "Request-Method" */ './method');
        api['method'] = module.default;
        break;
      case 'observation': 
        module =  await import(/* webpackChunkName: "Request-Observation" */ './observation');
        api['observation'] = module.default;
        break;
      case 'observationTreatment': 
        module =  await import(/* webpackChunkName: "Request-ObservationTreatment" */ './observationTreatment');
        api['observationTreatment'] = module.default;
        break;
      case 'observationUnit': 
        module =  await import(/* webpackChunkName: "Request-ObservationUnit" */ './observationUnit');
        api['observationUnit'] = module.default;
        break;
      case 'observationUnitPosition': 
        module =  await import(/* webpackChunkName: "Request-ObservationUnitPosition" */ './observationUnitPosition');
        api['observationUnitPosition'] = module.default;
        break;
      case 'observationVariable': 
        module =  await import(/* webpackChunkName: "Request-ObservationVariable" */ './observationVariable');
        api['observationVariable'] = module.default;
        break;
      case 'ontologyReference': 
        module =  await import(/* webpackChunkName: "Request-OntologyReference" */ './ontologyReference');
        api['ontologyReference'] = module.default;
        break;
      case 'program': 
        module =  await import(/* webpackChunkName: "Request-Program" */ './program');
        api['program'] = module.default;
        break;
      case 'scale': 
        module =  await import(/* webpackChunkName: "Request-Scale" */ './scale');
        api['scale'] = module.default;
        break;
      case 'season': 
        module =  await import(/* webpackChunkName: "Request-Season" */ './season');
        api['season'] = module.default;
        break;
      case 'study': 
        module =  await import(/* webpackChunkName: "Request-Study" */ './study');
        api['study'] = module.default;
        break;
      case 'trait': 
        module =  await import(/* webpackChunkName: "Request-Trait" */ './trait');
        api['trait'] = module.default;
        break;
      case 'trial': 
        module =  await import(/* webpackChunkName: "Request-Trial" */ './trial');
        api['trial'] = module.default;
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
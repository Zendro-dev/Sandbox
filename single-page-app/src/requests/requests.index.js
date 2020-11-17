import breedingMethodQueries from './breedingMethod'
import contactQueries from './contact'
import environmentParameterQueries from './environmentParameter'
import eventQueries from './event'
import eventParameterQueries from './eventParameter'
import germplasmQueries from './germplasm'
import imageQueries from './image'
import locationQueries from './location'
import methodQueries from './method'
import observationQueries from './observation'
import observationTreatmentQueries from './observationTreatment'
import observationUnitQueries from './observationUnit'
import observationUnitPositionQueries from './observationUnitPosition'
import observationVariableQueries from './observationVariable'
import ontologyReferenceQueries from './ontologyReference'
import programQueries from './program'
import scaleQueries from './scale'
import seasonQueries from './season'
import studyQueries from './study'
import traitQueries from './trait'
import trialQueries from './trial'
import roleQueries from './role'
import role_to_userQueries from './role_to_user'
import userQueries from './user'

export default {
  breedingMethod: breedingMethodQueries,
  contact: contactQueries,
  environmentParameter: environmentParameterQueries,
  event: eventQueries,
  eventParameter: eventParameterQueries,
  germplasm: germplasmQueries,
  image: imageQueries,
  location: locationQueries,
  method: methodQueries,
  observation: observationQueries,
  observationTreatment: observationTreatmentQueries,
  observationUnit: observationUnitQueries,
  observationUnitPosition: observationUnitPositionQueries,
  observationVariable: observationVariableQueries,
  ontologyReference: ontologyReferenceQueries,
  program: programQueries,
  scale: scaleQueries,
  season: seasonQueries,
  study: studyQueries,
  trait: traitQueries,
  trial: trialQueries,
  role: roleQueries,
  role_to_user: role_to_userQueries,
  user: userQueries,
}

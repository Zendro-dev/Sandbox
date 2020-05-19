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
import observationUnit_to_eventQueries from './observationUnit_to_event'
import observationVariableQueries from './observationVariable'
import ontologyReferenceQueries from './ontologyReference'
import programQueries from './program'
import role_to_userQueries from './role_to_user'
import scaleQueries from './scale'
import seasonQueries from './season'
import studyQueries from './study'
import study_to_contactQueries from './study_to_contact'
import study_to_seasonQueries from './study_to_season'
import traitQueries from './trait'
import trialQueries from './trial'
import trial_to_contactQueries from './trial_to_contact'
import roleQueries from './role'
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
  observationUnit_to_event: observationUnit_to_eventQueries,
  observationVariable: observationVariableQueries,
  ontologyReference: ontologyReferenceQueries,
  program: programQueries,
  role_to_user: role_to_userQueries,
  scale: scaleQueries,
  season: seasonQueries,
  study: studyQueries,
  study_to_contact: study_to_contactQueries,
  study_to_season: study_to_seasonQueries,
  trait: traitQueries,
  trial: trialQueries,
  trial_to_contact: trial_to_contactQueries,
  role: roleQueries,
  user: userQueries,
}

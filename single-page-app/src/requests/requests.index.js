import assayQueries from './assay'
import assayResultQueries from './assayResult'
import contactQueries from './contact'
import factorQueries from './factor'
import fileAttachmentQueries from './fileAttachment'
import investigationQueries from './investigation'
import materialQueries from './material'
import ontologyAnnotationQueries from './ontologyAnnotation'
import protocolQueries from './protocol'
import studyQueries from './study'
import roleQueries from './role'
import role_to_userQueries from './role_to_user'
import userQueries from './user'

export default {
  assay: assayQueries,
  assayResult: assayResultQueries,
  contact: contactQueries,
  factor: factorQueries,
  fileAttachment: fileAttachmentQueries,
  investigation: investigationQueries,
  material: materialQueries,
  ontologyAnnotation: ontologyAnnotationQueries,
  protocol: protocolQueries,
  study: studyQueries,
  role: roleQueries,
  role_to_user: role_to_userQueries,
  user: userQueries,
}

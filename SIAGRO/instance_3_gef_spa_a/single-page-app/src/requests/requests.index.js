import accessionQueries from './accession'
import individualQueries from './individual'
import locationQueries from './location'
import measurementQueries from './measurement'
import taxonQueries from './taxon'
import roleQueries from './role'
import role_to_userQueries from './role_to_user'
import userQueries from './user'

export default {
  accession: accessionQueries,
  individual: individualQueries,
  location: locationQueries,
  measurement: measurementQueries,
  taxon: taxonQueries,
  role: roleQueries,
  role_to_user: role_to_userQueries,
  user: userQueries,
}

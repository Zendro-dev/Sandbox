import personQueries from './person'
import roleQueries from './role'
import role_to_userQueries from './role_to_user'
import userQueries from './user'

export default {
  person: personQueries,
  role: roleQueries,
  role_to_user: role_to_userQueries,
  user: userQueries,
}

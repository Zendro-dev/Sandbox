import cuadranteQueries from './cuadrante'
import grupo_enfoqueQueries from './grupo_enfoque'
import locationQueries from './location'
import taxonQueries from './taxon'
import roleQueries from './role'
import role_to_userQueries from './role_to_user'
import userQueries from './user'

export default {
  cuadrante: cuadranteQueries,
  grupo_enfoque: grupo_enfoqueQueries,
  location: locationQueries,
  taxon: taxonQueries,
  role: roleQueries,
  role_to_user: role_to_userQueries,
  user: userQueries,
}

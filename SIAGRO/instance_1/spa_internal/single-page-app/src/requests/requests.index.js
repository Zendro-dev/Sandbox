import cuadranteQueries from './cuadrante'
import grupo_enfoqueQueries from './grupo_enfoque'
import sitioQueries from './sitio'
import taxonQueries from './taxon'
import tipo_plantaQueries from './tipo_planta'
import roleQueries from './role'
import role_to_userQueries from './role_to_user'
import userQueries from './user'

export default {
  cuadrante: cuadranteQueries,
  grupo_enfoque: grupo_enfoqueQueries,
  sitio: sitioQueries,
  taxon: taxonQueries,
  tipo_planta: tipo_plantaQueries,
  role: roleQueries,
  role_to_user: role_to_userQueries,
  user: userQueries,
}

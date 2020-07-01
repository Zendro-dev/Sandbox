import plant_variantQueries from './plant_variant'
import tomato_MeasurementQueries from './tomato_Measurement'
import roleQueries from './role'
import role_to_userQueries from './role_to_user'
import userQueries from './user'

export default {
  plant_variant: plant_variantQueries,
  tomato_Measurement: tomato_MeasurementQueries,
  role: roleQueries,
  role_to_user: role_to_userQueries,
  user: userQueries,
}

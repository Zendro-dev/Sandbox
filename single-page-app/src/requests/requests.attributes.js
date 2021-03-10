/**
 * Models attributes
 * 
 */
const modelsAttributes = {
  'role': {
      "id": "Int",
      "name": "String",
      "description": "String",
  },
  'role_to_user': {
      "id": "Int",
      "userId": "Int",
      "roleId": "Int",
  },
  'user': {
      "id": "Int",
      "email": "String",
      "password": "String",
  },
  'alien': {
      "idField": "String",
      "stringField": "String",
      "intField": "Int",
      "floatField": "Float",
      "datetimeField": "DateTime",
      "booleanField": "Boolean",
      "stringArrayField": "[String]",
      "intArrayField": "[Int]",
      "floatArrayField": "[Float]",
      "datetimeArrayField": "[DateTime]",
      "booleanArrayField": "[Boolean]",
  },
  'capital': {
      "name": "String",
      "capital_id": "String",
      "country_id": "String",
  },
  'continent': {
      "continent_id": "String",
      "name": "String",
  },
  'country': {
      "name": "String",
      "country_id": "String",
      "continent_id": "String",
      "river_ids": "[String]",
  },
  'river': {
      "name": "String",
      "length": "Int",
      "river_id": "String",
      "country_ids": "[String]",
  },
}

export default function getAttributes(filterName) {
  return {...modelsAttributes[filterName]};
}
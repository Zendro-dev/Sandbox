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
  'sPARefactor': {
      "array": "[Boolean]",
      "string": "String",
      "int": "Int",
      "float": "Float",
      "date": "Date",
      "time": "Time",
      "datetime": "DateTime",
  },
}

export default function getAttributes(filterName) {
  return {...modelsAttributes[filterName]};
}
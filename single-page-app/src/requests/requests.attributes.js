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
  'imageAttachment': {
      "id": "Int",
      "fileName": "String",
      "fileSizeKb": "Float",
      "fileType": "String",
      "filePath": "String",
      "smallTnPath": "String",
      "mediumTnPath": "String",
      "licence": "String",
      "description": "String",
      "personId": "Int",
  },
  'person': {
      "id": "Int",
      "name": "String",
  },
}

export default function getAttributes(filterName) {
  return {...modelsAttributes[filterName]};
}
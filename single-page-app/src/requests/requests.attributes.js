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
  'author': {
      "author_id": "String",
      "name": "String",
  },
  'book': {
      "book_id": "String",
      "name": "String",
      "fk_books_authors": "String",
  },
  'sPARefactor': {
      "array": "[String]",
      "string": "String",
      "int": "Int",
      "float": "Float",
      "date": "Date",
      "time": "Time",
      "datetime": "DateTime",
      "boolean": "Boolean",
  },
}

export default function getAttributes(filterName) {
  return {...modelsAttributes[filterName]};
}
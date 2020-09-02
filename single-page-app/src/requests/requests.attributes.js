export default function getAttributes(filterName) {
  switch(filterName) {
    case 'fileAttachment':
      return {
        "id": "Int",
        "fileName": "String",
        "fileSizeKb": "String",
        "fileType": "String",
        "filePath": "String",
        "smallTnPath": "String",
        "mediumTnPath": "String",
        "licence": "String",
        "description": "String",
      };
    case 'role':
      return {
        "id": "Int",
        "name": "String",
        "description": "String",
    };
    case 'role_to_user':
      return {
        "id": "Int",
        "userId": "Int",
        "roleId": "Int",
    };
    case 'user':
      return {
        "id": "Int",
        "email": "String",
        "password": "String",
    };

    default:
      return {};
  }
}
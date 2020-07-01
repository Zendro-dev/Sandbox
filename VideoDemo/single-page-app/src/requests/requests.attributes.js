export default function getAttributes(filterName) {
  switch(filterName) {
    case 'plant_variant':
      return {
        "name": "String",
        "genotype": "String",
        "disease_resistances": "String",
        "plant_variant_ID": "String",
      };
    case 'tomato_Measurement':
      return {
        "tomato_ID": "String",
        "no_fruit": "Int",
        "sugar_content": "Float",
        "plant_variant_ID": "String",
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
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
  'caracteristica_cuantitativa': {
      "id": "Int",
      "nombre": "String",
      "valor": "Float",
      "unidad": "String",
      "nombre_corto": "String",
      "comentarios": "String",
      "metodo_id": "String",
      "registro_id": "String",
  },
  'metodo': {
      "id": "String",
      "descripcion": "String",
      "referencias": "[String]",
      "link_referencias": "[String]",
  },
  'referencia': {
      "referencia_id": "String",
      "referencia": "String",
      "registros_ids": "[String]",
  },
  'registro': {
      "conabio_id": "String",
      "clave_original": "String",
      "tipo_alimento": "String",
      "food_type": "String",
      "descripcion_alimento": "String",
      "food_description": "String",
      "procedencia": "String",
      "taxon_id": "String",
      "referencias_ids": "[String]",
  },
  'taxon': {
      "id": "String",
      "taxon": "String",
      "categoria": "String",
      "estatus": "String",
      "nombreAutoridad": "String",
      "citaNomenclatural": "String",
      "fuente": "String",
      "ambiente": "String",
      "grupoSNIB": "String",
      "categoriaResidencia": "String",
      "nom": "String",
      "cites": "String",
      "iucn": "String",
      "prioritarias": "String",
      "endemismo": "String",
      "categoriaSorter": "String",
      "bibliografia": "[String]",
  },
}

export default function getAttributes(filterName) {
  return {...modelsAttributes[filterName]};
}
export default function getAttributes(filterName) {
  switch(filterName) {
    case 'cuadrante':
      return {
        "cuadrante_id": "String",
        "tipo_planta": "String",
        "produccion_valor": "Int",
        "produccion_etiqueta": "String",
        "autoconsumo_valor": "Int",
        "autoconsumo_etiqueta": "String",
        "compra_valor": "Int",
        "compra_etiqueta": "String",
        "venta_valor": "Int",
        "venta_etiqueta": "String",
        "nombre_comun_grupo_enfoque": "String",
        "grupo_enfoque_id": "String",
        "taxon_id": "String",
      };
    case 'grupo_enfoque':
      return {
        "grupo_id": "String",
        "tipo_grupo": "String",
        "numero_participantes": "Int",
        "fecha": "Date",
        "lista_especies": "String",
        "foto_produccion": "String",
        "foto_autoconsumo": "String",
        "foto_venta": "String",
        "foto_compra": "String",
        "observaciones": "String",
        "justificacion_produccion_cuadrante1": "String",
        "justificacion_produccion_cuadrante2": "String",
        "justificacion_produccion_cuadrante3": "String",
        "justificacion_produccion_cuadrante4": "String",
        "sitio_id": "String",
      };
    case 'sitio':
      return {
        "sitio_id": "String",
        "pais": "String",
        "estado": "String",
        "municipio": "String",
        "localidad": "String",
      };
    case 'taxon':
      return {
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
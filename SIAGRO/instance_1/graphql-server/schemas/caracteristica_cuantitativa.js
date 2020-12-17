module.exports = `
  type caracteristica_cuantitativa{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    nombre: String

    """
    @original-field
    
    """
    valor: Float

    """
    @original-field
    
    """
    unidad: String

    """
    @original-field
    
    """
    nombre_corto: String

    """
    @original-field
    
    """
    comentarios: String

    """
    @original-field
    
    """
    metodo_id: String

    """
    @original-field
    
    """
    registro_id: String

    registro(search: searchRegistroInput): registro
  metodo(search: searchMetodoInput): metodo
    
    }
type Caracteristica_cuantitativaConnection{
  edges: [Caracteristica_cuantitativaEdge]
  pageInfo: pageInfo!
}

type Caracteristica_cuantitativaEdge{
  cursor: String!
  node: caracteristica_cuantitativa!
}

  type VueTableCaracteristica_cuantitativa{
    data : [caracteristica_cuantitativa]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum caracteristica_cuantitativaField {
    id
    nombre
    valor
    unidad
    nombre_corto
    comentarios
    metodo_id
    registro_id
  }
  input searchCaracteristica_cuantitativaInput {
    field: caracteristica_cuantitativaField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchCaracteristica_cuantitativaInput]
  }

  input orderCaracteristica_cuantitativaInput{
    field: caracteristica_cuantitativaField
    order: Order
  }

  input bulkAssociationCaracteristica_cuantitativaWithRegistro_idInput{
    id: ID!
    registro_id: ID!
  }  input bulkAssociationCaracteristica_cuantitativaWithMetodo_idInput{
    id: ID!
    metodo_id: ID!
  }

  type Query {
    caracteristica_cuantitativas(search: searchCaracteristica_cuantitativaInput, order: [ orderCaracteristica_cuantitativaInput ], pagination: paginationInput! ): [caracteristica_cuantitativa]
    readOneCaracteristica_cuantitativa(id: ID!): caracteristica_cuantitativa
    countCaracteristica_cuantitativas(search: searchCaracteristica_cuantitativaInput ): Int
    vueTableCaracteristica_cuantitativa : VueTableCaracteristica_cuantitativa    csvTableTemplateCaracteristica_cuantitativa: [String]
    caracteristica_cuantitativasConnection(search:searchCaracteristica_cuantitativaInput, order: [ orderCaracteristica_cuantitativaInput ], pagination: paginationCursorInput! ): Caracteristica_cuantitativaConnection
  }

  type Mutation {
    addCaracteristica_cuantitativa( nombre: String, valor: Float, unidad: String, nombre_corto: String, comentarios: String , addRegistro:ID, addMetodo:ID   , skipAssociationsExistenceChecks:Boolean = false): caracteristica_cuantitativa!
    updateCaracteristica_cuantitativa(id: ID!, nombre: String, valor: Float, unidad: String, nombre_corto: String, comentarios: String , addRegistro:ID, removeRegistro:ID , addMetodo:ID, removeMetodo:ID    , skipAssociationsExistenceChecks:Boolean = false): caracteristica_cuantitativa!
    deleteCaracteristica_cuantitativa(id: ID!): String!
    bulkAddCaracteristica_cuantitativaCsv: String!
    bulkAssociateCaracteristica_cuantitativaWithRegistro_id(bulkAssociationInput: [bulkAssociationCaracteristica_cuantitativaWithRegistro_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCaracteristica_cuantitativaWithRegistro_id(bulkAssociationInput: [bulkAssociationCaracteristica_cuantitativaWithRegistro_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCaracteristica_cuantitativaWithMetodo_id(bulkAssociationInput: [bulkAssociationCaracteristica_cuantitativaWithMetodo_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCaracteristica_cuantitativaWithMetodo_id(bulkAssociationInput: [bulkAssociationCaracteristica_cuantitativaWithMetodo_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
module.exports = `
  type caracteristica_cualitativa{
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
    valor: String

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

    registro(search: searchEjemplarInput): Ejemplar
  metodo(search: searchMetodoInput): metodo
    
    }
type Caracteristica_cualitativaConnection{
  edges: [Caracteristica_cualitativaEdge]
  pageInfo: pageInfo!
}

type Caracteristica_cualitativaEdge{
  cursor: String!
  node: caracteristica_cualitativa!
}

  type VueTableCaracteristica_cualitativa{
    data : [caracteristica_cualitativa]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum caracteristica_cualitativaField {
    id
    nombre
    valor
    nombre_corto
    comentarios
    metodo_id
    registro_id
  }
  input searchCaracteristica_cualitativaInput {
    field: caracteristica_cualitativaField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchCaracteristica_cualitativaInput]
  }

  input orderCaracteristica_cualitativaInput{
    field: caracteristica_cualitativaField
    order: Order
  }

  input bulkAssociationCaracteristica_cualitativaWithRegistro_idInput{
    id: ID!
    registro_id: ID!
  }  input bulkAssociationCaracteristica_cualitativaWithMetodo_idInput{
    id: ID!
    metodo_id: ID!
  }

  type Query {
    caracteristica_cualitativas(search: searchCaracteristica_cualitativaInput, order: [ orderCaracteristica_cualitativaInput ], pagination: paginationInput! ): [caracteristica_cualitativa]
    readOneCaracteristica_cualitativa(id: ID!): caracteristica_cualitativa
    countCaracteristica_cualitativas(search: searchCaracteristica_cualitativaInput ): Int
    vueTableCaracteristica_cualitativa : VueTableCaracteristica_cualitativa    csvTableTemplateCaracteristica_cualitativa: [String]
    caracteristica_cualitativasConnection(search:searchCaracteristica_cualitativaInput, order: [ orderCaracteristica_cualitativaInput ], pagination: paginationCursorInput! ): Caracteristica_cualitativaConnection
  }

  type Mutation {
    addCaracteristica_cualitativa( nombre: String, valor: String, nombre_corto: String, comentarios: String , addRegistro:ID, addMetodo:ID   , skipAssociationsExistenceChecks:Boolean = false): caracteristica_cualitativa!
    updateCaracteristica_cualitativa(id: ID!, nombre: String, valor: String, nombre_corto: String, comentarios: String , addRegistro:ID, removeRegistro:ID , addMetodo:ID, removeMetodo:ID    , skipAssociationsExistenceChecks:Boolean = false): caracteristica_cualitativa!
    deleteCaracteristica_cualitativa(id: ID!): String!
    bulkAddCaracteristica_cualitativaCsv: String!
    bulkAssociateCaracteristica_cualitativaWithRegistro_id(bulkAssociationInput: [bulkAssociationCaracteristica_cualitativaWithRegistro_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCaracteristica_cualitativaWithRegistro_id(bulkAssociationInput: [bulkAssociationCaracteristica_cualitativaWithRegistro_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCaracteristica_cualitativaWithMetodo_id(bulkAssociationInput: [bulkAssociationCaracteristica_cualitativaWithMetodo_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCaracteristica_cualitativaWithMetodo_id(bulkAssociationInput: [bulkAssociationCaracteristica_cualitativaWithMetodo_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
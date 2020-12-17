module.exports = `
  type registro{
    """
    @original-field
    """
    conabio_id: ID
    """
    @original-field
    
    """
    clave_original: String

    """
    @original-field
    
    """
    tipo_alimento: String

    """
    @original-field
    
    """
    food_type: String

    """
    @original-field
    
    """
    descripcion_alimento: String

    """
    @original-field
    
    """
    food_description: String

    """
    @original-field
    
    """
    procedencia: String

    """
    @original-field
    
    """
    taxon_id: String

    """
    @original-field
    
    """
    referencias_ids: [String]

    informacion_taxonomica(search: searchTaxonInput): Taxon
    
    """
    @search-request
    """
    caracteristicas_cuantitativasFilter(search: searchCaracteristica_cuantitativaInput, order: [ orderCaracteristica_cuantitativaInput ], pagination: paginationInput!): [caracteristica_cuantitativa]


    """
    @search-request
    """
    caracteristicas_cuantitativasConnection(search: searchCaracteristica_cuantitativaInput, order: [ orderCaracteristica_cuantitativaInput ], pagination: paginationCursorInput!): Caracteristica_cuantitativaConnection

    """
    @count-request
    """
    countFilteredCaracteristicas_cuantitativas(search: searchCaracteristica_cuantitativaInput) : Int
  
    """
    @search-request
    """
    referenciasFilter(search: searchReferenciaInput, order: [ orderReferenciaInput ], pagination: paginationInput!): [referencia]


    """
    @search-request
    """
    referenciasConnection(search: searchReferenciaInput, order: [ orderReferenciaInput ], pagination: paginationCursorInput!): ReferenciaConnection

    """
    @count-request
    """
    countFilteredReferencias(search: searchReferenciaInput) : Int
  
    }
type RegistroConnection{
  edges: [RegistroEdge]
  pageInfo: pageInfo!
}

type RegistroEdge{
  cursor: String!
  node: registro!
}

  type VueTableRegistro{
    data : [registro]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum registroField {
    conabio_id
    clave_original
    tipo_alimento
    food_type
    descripcion_alimento
    food_description
    procedencia
    taxon_id
    referencias_ids
  }
  input searchRegistroInput {
    field: registroField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchRegistroInput]
  }

  input orderRegistroInput{
    field: registroField
    order: Order
  }

  input bulkAssociationRegistroWithTaxon_idInput{
    conabio_id: ID!
    taxon_id: ID!
  }

  type Query {
    registros(search: searchRegistroInput, order: [ orderRegistroInput ], pagination: paginationInput! ): [registro]
    readOneRegistro(conabio_id: ID!): registro
    countRegistros(search: searchRegistroInput ): Int
    vueTableRegistro : VueTableRegistro    csvTableTemplateRegistro: [String]
    registrosConnection(search:searchRegistroInput, order: [ orderRegistroInput ], pagination: paginationCursorInput! ): RegistroConnection
  }

  type Mutation {
    addRegistro(conabio_id: ID!, clave_original: String, tipo_alimento: String, food_type: String, descripcion_alimento: String, food_description: String, procedencia: String, referencias_ids: [String] , addInformacion_taxonomica:ID  , addCaracteristicas_cuantitativas:[ID], addReferencias:[ID] , skipAssociationsExistenceChecks:Boolean = false): registro!
    updateRegistro(conabio_id: ID!, clave_original: String, tipo_alimento: String, food_type: String, descripcion_alimento: String, food_description: String, procedencia: String, referencias_ids: [String] , addInformacion_taxonomica:ID, removeInformacion_taxonomica:ID   , addCaracteristicas_cuantitativas:[ID], removeCaracteristicas_cuantitativas:[ID] , addReferencias:[ID], removeReferencias:[ID]  , skipAssociationsExistenceChecks:Boolean = false): registro!
    deleteRegistro(conabio_id: ID!): String!
    bulkAddRegistroCsv: String!
    bulkAssociateRegistroWithTaxon_id(bulkAssociationInput: [bulkAssociationRegistroWithTaxon_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateRegistroWithTaxon_id(bulkAssociationInput: [bulkAssociationRegistroWithTaxon_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
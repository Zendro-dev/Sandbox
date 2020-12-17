module.exports = `
  type referencia{
    """
    @original-field
    """
    referencia_id: ID
    """
    @original-field
    
    """
    referencia: String

    """
    @original-field
    
    """
    registros_ids: [String]

      
    """
    @search-request
    """
    alimentosFilter(search: searchRegistroInput, order: [ orderRegistroInput ], pagination: paginationInput!): [registro]


    """
    @search-request
    """
    alimentosConnection(search: searchRegistroInput, order: [ orderRegistroInput ], pagination: paginationCursorInput!): RegistroConnection

    """
    @count-request
    """
    countFilteredAlimentos(search: searchRegistroInput) : Int
  
    }
type ReferenciaConnection{
  edges: [ReferenciaEdge]
  pageInfo: pageInfo!
}

type ReferenciaEdge{
  cursor: String!
  node: referencia!
}

  type VueTableReferencia{
    data : [referencia]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum referenciaField {
    referencia_id
    referencia
    registros_ids
  }
  input searchReferenciaInput {
    field: referenciaField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchReferenciaInput]
  }

  input orderReferenciaInput{
    field: referenciaField
    order: Order
  }



  type Query {
    referencia(search: searchReferenciaInput, order: [ orderReferenciaInput ], pagination: paginationInput! ): [referencia]
    readOneReferencia(referencia_id: ID!): referencia
    countReferencia(search: searchReferenciaInput ): Int
    vueTableReferencia : VueTableReferencia    csvTableTemplateReferencia: [String]
    referenciaConnection(search:searchReferenciaInput, order: [ orderReferenciaInput ], pagination: paginationCursorInput! ): ReferenciaConnection
  }

  type Mutation {
    addReferencia(referencia_id: ID!, referencia: String, registros_ids: [String]   , addAlimentos:[ID] , skipAssociationsExistenceChecks:Boolean = false): referencia!
    updateReferencia(referencia_id: ID!, referencia: String, registros_ids: [String]   , addAlimentos:[ID], removeAlimentos:[ID]  , skipAssociationsExistenceChecks:Boolean = false): referencia!
    deleteReferencia(referencia_id: ID!): String!
    bulkAddReferenciaCsv: String!
      }
`;
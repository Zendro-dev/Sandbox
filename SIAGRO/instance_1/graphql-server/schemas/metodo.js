module.exports = `
  type metodo{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    descripcion: String

    """
    @original-field
    
    """
    referencias: [String]

    """
    @original-field
    
    """
    link_referencias: [String]

      
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
    caracteristicas_cualitativasFilter(search: searchCaracteristica_cualitativaInput, order: [ orderCaracteristica_cualitativaInput ], pagination: paginationInput!): [caracteristica_cualitativa]


    """
    @search-request
    """
    caracteristicas_cualitativasConnection(search: searchCaracteristica_cualitativaInput, order: [ orderCaracteristica_cualitativaInput ], pagination: paginationCursorInput!): Caracteristica_cualitativaConnection

    """
    @count-request
    """
    countFilteredCaracteristicas_cualitativas(search: searchCaracteristica_cualitativaInput) : Int
  
    }
type MetodoConnection{
  edges: [MetodoEdge]
  pageInfo: pageInfo!
}

type MetodoEdge{
  cursor: String!
  node: metodo!
}

  type VueTableMetodo{
    data : [metodo]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum metodoField {
    id
    descripcion
    referencias
    link_referencias
  }
  input searchMetodoInput {
    field: metodoField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchMetodoInput]
  }

  input orderMetodoInput{
    field: metodoField
    order: Order
  }



  type Query {
    metodos(search: searchMetodoInput, order: [ orderMetodoInput ], pagination: paginationInput! ): [metodo]
    readOneMetodo(id: ID!): metodo
    countMetodos(search: searchMetodoInput ): Int
    vueTableMetodo : VueTableMetodo    csvTableTemplateMetodo: [String]
    metodosConnection(search:searchMetodoInput, order: [ orderMetodoInput ], pagination: paginationCursorInput! ): MetodoConnection
  }

  type Mutation {
    addMetodo(id: ID!, descripcion: String, referencias: [String], link_referencias: [String]   , addCaracteristicas_cuantitativas:[ID], addCaracteristicas_cualitativas:[ID] , skipAssociationsExistenceChecks:Boolean = false): metodo!
    updateMetodo(id: ID!, descripcion: String, referencias: [String], link_referencias: [String]   , addCaracteristicas_cuantitativas:[ID], removeCaracteristicas_cuantitativas:[ID] , addCaracteristicas_cualitativas:[ID], removeCaracteristicas_cualitativas:[ID]  , skipAssociationsExistenceChecks:Boolean = false): metodo!
    deleteMetodo(id: ID!): String!
    bulkAddMetodoCsv: String!
      }
`;
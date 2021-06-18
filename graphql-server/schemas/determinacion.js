module.exports = `
  type determinacion{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    determinador: String

    """
    @original-field
    
    """
    fechadeterminacion: String

    """
    @original-field
    
    """
    calificadordeterminacion: String

    """
    @original-field
    
    """
    tipo: String

    registro_siagro(search: searchRegistro_siagroInput): registro_siagro
    
    }
type DeterminacionConnection{
  edges: [DeterminacionEdge]
  determinacions: [determinacion]
  pageInfo: pageInfo!
}

type DeterminacionEdge{
  cursor: String!
  node: determinacion!
}

  type VueTableDeterminacion{
    data : [determinacion]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum determinacionField {
    id
    determinador
    fechadeterminacion
    calificadordeterminacion
    tipo
  }
  input searchDeterminacionInput {
    field: determinacionField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchDeterminacionInput]
  }

  input orderDeterminacionInput{
    field: determinacionField
    order: Order
  }



  type Query {
    determinacions(search: searchDeterminacionInput, order: [ orderDeterminacionInput ], pagination: paginationInput! ): [determinacion]
    readOneDeterminacion(id: ID!): determinacion
    countDeterminacions(search: searchDeterminacionInput ): Int
    vueTableDeterminacion : VueTableDeterminacion
    csvTableTemplateDeterminacion: [String]
    determinacionsConnection(search:searchDeterminacionInput, order: [ orderDeterminacionInput ], pagination: paginationCursorInput! ): DeterminacionConnection
  }

  type Mutation {
    addDeterminacion(id: ID!, determinador: String, fechadeterminacion: String, calificadordeterminacion: String, tipo: String , addRegistro_siagro:ID   , skipAssociationsExistenceChecks:Boolean = false): determinacion!
    updateDeterminacion(id: ID!, determinador: String, fechadeterminacion: String, calificadordeterminacion: String, tipo: String , addRegistro_siagro:ID, removeRegistro_siagro:ID    , skipAssociationsExistenceChecks:Boolean = false): determinacion!
    deleteDeterminacion(id: ID!): String!
    bulkAddDeterminacionCsv: String!
      }
`;
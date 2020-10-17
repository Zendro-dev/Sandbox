module.exports = `
  type pot{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    pot: String

    """
    @original-field
    
    """
    greenhouse: String

    """
    @original-field
    
    """
    climate_chamber: String

    """
    @original-field
    
    """
    conditions: String

      
    """
    @search-request
    """
    individualsFilter(search: searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationInput!): [individual]


    """
    @search-request
    """
    individualsConnection(search: searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationCursorInput!): IndividualConnection

    """
    @count-request
    """
    countFilteredIndividuals(search: searchIndividualInput) : Int
  
    }
type PotConnection{
  edges: [PotEdge]
  pageInfo: pageInfo!
}

type PotEdge{
  cursor: String!
  node: pot!
}

  type VueTablePot{
    data : [pot]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum potField {
    id
    pot
    greenhouse
    climate_chamber
    conditions
  }
  input searchPotInput {
    field: potField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchPotInput]
  }

  input orderPotInput{
    field: potField
    order: Order
  }



  type Query {
    pots(search: searchPotInput, order: [ orderPotInput ], pagination: paginationInput! ): [pot]
    readOnePot(id: ID!): pot
    countPots(search: searchPotInput ): Int
    vueTablePot : VueTablePot    csvTableTemplatePot: [String]
    potsConnection(search:searchPotInput, order: [ orderPotInput ], pagination: paginationCursorInput! ): PotConnection
  }

  type Mutation {
    addPot( pot: String, greenhouse: String, climate_chamber: String, conditions: String   , addIndividuals:[ID] , skipAssociationsExistenceChecks:Boolean = false): pot!
    updatePot(id: ID!, pot: String, greenhouse: String, climate_chamber: String, conditions: String   , addIndividuals:[ID], removeIndividuals:[ID]  , skipAssociationsExistenceChecks:Boolean = false): pot!
    deletePot(id: ID!): String!
    bulkAddPotCsv: String!
      }
`;
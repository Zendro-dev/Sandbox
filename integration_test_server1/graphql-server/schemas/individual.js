module.exports = `
  type individual{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    name: String

      
    """
    @search-request
    """
    transcript_countsFilter(search: searchTranscript_countInput, order: [ orderTranscript_countInput ], pagination: paginationInput): [transcript_count]


    """
    @search-request
    """
    transcript_countsConnection(search: searchTranscript_countInput, order: [ orderTranscript_countInput ], pagination: paginationCursorInput): Transcript_countConnection

    """
    @count-request
    """
    countFilteredTranscript_counts(search: searchTranscript_countInput) : Int
  
    }
type IndividualConnection{
  edges: [IndividualEdge]
  pageInfo: pageInfo!
}

type IndividualEdge{
  cursor: String!
  node: individual!
}

  type VueTableIndividual{
    data : [individual]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum individualField {
    id
    name
  }
  input searchIndividualInput {
    field: individualField
    value: typeValue
    operator: Operator
    search: [searchIndividualInput]
  }

  input orderIndividualInput{
    field: individualField
    order: Order
  }
  type Query {
    individuals(search: searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationInput ): [individual]
    readOneIndividual(id: ID!): individual
    countIndividuals(search: searchIndividualInput ): Int
    vueTableIndividual : VueTableIndividual    csvTableTemplateIndividual: [String]

    individualsConnection(search:searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationCursorInput ): IndividualConnection
  }
    type Mutation {
    addIndividual( name: String   , addTranscript_counts:[ID] , skipAssociationsExistenceChecks:Boolean = false): individual!
    updateIndividual(id: ID!, name: String   , addTranscript_counts:[ID], removeTranscript_counts:[ID]  , skipAssociationsExistenceChecks:Boolean = false): individual!
  deleteIndividual(id: ID!): String!
  bulkAddIndividualCsv: [individual] }

`;
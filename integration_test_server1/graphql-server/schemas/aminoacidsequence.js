module.exports = `
  type aminoacidsequence{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    accession: String

    """
    @original-field
    
    """
    sequence: String

      
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
type AminoacidsequenceConnection{
  edges: [AminoacidsequenceEdge]
  pageInfo: pageInfo!
}

type AminoacidsequenceEdge{
  cursor: String!
  node: aminoacidsequence!
}

  type VueTableAminoacidsequence{
    data : [aminoacidsequence]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum aminoacidsequenceField {
    id
    accession
    sequence
  }
  input searchAminoacidsequenceInput {
    field: aminoacidsequenceField
    value: typeValue
    operator: Operator
    search: [searchAminoacidsequenceInput]
  }

  input orderAminoacidsequenceInput{
    field: aminoacidsequenceField
    order: Order
  }

  type Query {
    aminoacidsequences(search: searchAminoacidsequenceInput, order: [ orderAminoacidsequenceInput ], pagination: paginationInput ): [aminoacidsequence]
    readOneAminoacidsequence(id: ID!): aminoacidsequence
    countAminoacidsequences(search: searchAminoacidsequenceInput ): Int
    vueTableAminoacidsequence : VueTableAminoacidsequence    csvTableTemplateAminoacidsequence: [String]
    aminoacidsequencesConnection(search:searchAminoacidsequenceInput, order: [ orderAminoacidsequenceInput ], pagination: paginationCursorInput ): AminoacidsequenceConnection
  }

  type Mutation {
    addAminoacidsequence( accession: String, sequence: String   , addTranscript_counts:[ID] , skipAssociationsExistenceChecks:Boolean = false): aminoacidsequence!
    updateAminoacidsequence(id: ID!, accession: String, sequence: String   , addTranscript_counts:[ID], removeTranscript_counts:[ID]  , skipAssociationsExistenceChecks:Boolean = false): aminoacidsequence!
    deleteAminoacidsequence(id: ID!): String!
    bulkAddAminoacidsequenceCsv: String!
    }
`;
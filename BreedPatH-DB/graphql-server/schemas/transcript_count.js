module.exports = `
  type transcript_count{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    gene: String

    """
    @original-field
    
    """
    value: Float

    """
    @original-field
    
    """
    method: String

    """
    @original-field
    
    """
    reference_genome: String

    """
    @original-field
    
    """
    sample_id: Int

    sample(search: searchSampleInput): sample
    
    }
type Transcript_countConnection{
  edges: [Transcript_countEdge]
  pageInfo: pageInfo!
}

type Transcript_countEdge{
  cursor: String!
  node: transcript_count!
}

  type VueTableTranscript_count{
    data : [transcript_count]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum transcript_countField {
    id
    gene
    value
    method
    reference_genome
    sample_id
  }
  input searchTranscript_countInput {
    field: transcript_countField
    value: typeValue
    operator: Operator
    search: [searchTranscript_countInput]
  }

  input orderTranscript_countInput{
    field: transcript_countField
    order: Order
  }
  type Query {
    transcript_counts(search: searchTranscript_countInput, order: [ orderTranscript_countInput ], pagination: paginationInput ): [transcript_count]
    readOneTranscript_count(id: ID!): transcript_count
    countTranscript_counts(search: searchTranscript_countInput ): Int
    vueTableTranscript_count : VueTableTranscript_count    csvTableTemplateTranscript_count: [String]

    transcript_countsConnection(search:searchTranscript_countInput, order: [ orderTranscript_countInput ], pagination: paginationCursorInput ): Transcript_countConnection
  }
    type Mutation {
    addTranscript_count( gene: String, value: Float, method: String, reference_genome: String , addSample:ID   , skipAssociationsExistenceChecks:Boolean = false): transcript_count!
    updateTranscript_count(id: ID!, gene: String, value: Float, method: String, reference_genome: String , addSample:ID, removeSample:ID    , skipAssociationsExistenceChecks:Boolean = false): transcript_count!
  deleteTranscript_count(id: ID!): String!
  bulkAddTranscript_countCsv: String! }

`;
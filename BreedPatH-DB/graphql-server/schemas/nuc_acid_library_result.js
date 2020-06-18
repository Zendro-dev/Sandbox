module.exports = `
  type nuc_acid_library_result{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    lab_code: String

    """
    @original-field
    
    """
    file_name: String

    """
    @original-field
    
    """
    file_uri: String

    """
    @original-field
    
    """
    type: String

    """
    @original-field
    
    """
    insert_size: Float

    """
    @original-field
    
    """
    technical_replicate: Int

    """
    @original-field
    
    """
    trimmed: Boolean

    """
    @original-field
    
    """
    sample_id: Int

    """
    @original-field
    
    """
    sequencing_experiment_id: Int

    sample(search: searchSampleInput): sample
  sequencing_experiment(search: searchSequencing_experimentInput): sequencing_experiment
    
    }
type Nuc_acid_library_resultConnection{
  edges: [Nuc_acid_library_resultEdge]
  pageInfo: pageInfo!
}

type Nuc_acid_library_resultEdge{
  cursor: String!
  node: nuc_acid_library_result!
}

  type VueTableNuc_acid_library_result{
    data : [nuc_acid_library_result]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum nuc_acid_library_resultField {
    id
    lab_code
    file_name
    file_uri
    type
    insert_size
    technical_replicate
    trimmed
    sample_id
    sequencing_experiment_id
  }
  input searchNuc_acid_library_resultInput {
    field: nuc_acid_library_resultField
    value: typeValue
    operator: Operator
    search: [searchNuc_acid_library_resultInput]
  }

  input orderNuc_acid_library_resultInput{
    field: nuc_acid_library_resultField
    order: Order
  }
  type Query {
    nuc_acid_library_results(search: searchNuc_acid_library_resultInput, order: [ orderNuc_acid_library_resultInput ], pagination: paginationInput ): [nuc_acid_library_result]
    readOneNuc_acid_library_result(id: ID!): nuc_acid_library_result
    countNuc_acid_library_results(search: searchNuc_acid_library_resultInput ): Int
    vueTableNuc_acid_library_result : VueTableNuc_acid_library_result    csvTableTemplateNuc_acid_library_result: [String]

    nuc_acid_library_resultsConnection(search:searchNuc_acid_library_resultInput, order: [ orderNuc_acid_library_resultInput ], pagination: paginationCursorInput ): Nuc_acid_library_resultConnection
  }
    type Mutation {
    addNuc_acid_library_result( lab_code: String, file_name: String, file_uri: String, type: String, insert_size: Float, technical_replicate: Int, trimmed: Boolean , addSample:ID, addSequencing_experiment:ID   , skipAssociationsExistenceChecks:Boolean = false): nuc_acid_library_result!
    updateNuc_acid_library_result(id: ID!, lab_code: String, file_name: String, file_uri: String, type: String, insert_size: Float, technical_replicate: Int, trimmed: Boolean , addSample:ID, removeSample:ID , addSequencing_experiment:ID, removeSequencing_experiment:ID    , skipAssociationsExistenceChecks:Boolean = false): nuc_acid_library_result!
  deleteNuc_acid_library_result(id: ID!): String!
  bulkAddNuc_acid_library_resultCsv: String! }

`;
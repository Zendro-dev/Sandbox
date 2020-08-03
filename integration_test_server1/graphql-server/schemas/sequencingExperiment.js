module.exports = `
  type SequencingExperiment{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    start_date: Date

    """
    @original-field
    
    """
    end_date: Date

    """
    @original-field
    
    """
    description: String

      
    }
type SequencingExperimentConnection{
  edges: [SequencingExperimentEdge]
  pageInfo: pageInfo!
}

type SequencingExperimentEdge{
  cursor: String!
  node: SequencingExperiment!
}

  type VueTableSequencingExperiment{
    data : [SequencingExperiment]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum SequencingExperimentField {
    id
    name
    start_date
    end_date
    description
  }
  input searchSequencingExperimentInput {
    field: SequencingExperimentField
    value: typeValue
    operator: Operator
    search: [searchSequencingExperimentInput]
  }

  input orderSequencingExperimentInput{
    field: SequencingExperimentField
    order: Order
  }



  type Query {
    sequencingExperiments(search: searchSequencingExperimentInput, order: [ orderSequencingExperimentInput ], pagination: paginationInput ): [SequencingExperiment]
    readOneSequencingExperiment(id: ID!): SequencingExperiment
    countSequencingExperiments(search: searchSequencingExperimentInput ): Int
    vueTableSequencingExperiment : VueTableSequencingExperiment    csvTableTemplateSequencingExperiment: [String]
    sequencingExperimentsConnection(search:searchSequencingExperimentInput, order: [ orderSequencingExperimentInput ], pagination: paginationCursorInput ): SequencingExperimentConnection
  }

  type Mutation {
    addSequencingExperiment( name: String, start_date: Date, end_date: Date, description: String    , skipAssociationsExistenceChecks:Boolean = false): SequencingExperiment!
    updateSequencingExperiment(id: ID!, name: String, start_date: Date, end_date: Date, description: String    , skipAssociationsExistenceChecks:Boolean = false): SequencingExperiment!
    deleteSequencingExperiment(id: ID!): String!
    bulkAddSequencingExperimentCsv: String!
      }
`;
module.exports = `
  type program{
    """
    @original-field
    """
    programDbId: ID
    """
    @original-field
    
    """
    abbreviation: String

    """
    @original-field
    
    """
    commonCropName: String

    """
    @original-field
    
    """
    documentationURL: String

    """
    @original-field
    
    """
    leadPersonDbId: String

    """
    @original-field
    
    """
    objective: String

    """
    @original-field
    
    """
    programName: String

    leadPerson(search: searchContactInput): contact
    
    """
    @search-request
    """
    trialsFilter(search: searchTrialInput, order: [ orderTrialInput ], pagination: paginationInput!): [trial]


    """
    @search-request
    """
    trialsConnection(search: searchTrialInput, order: [ orderTrialInput ], pagination: paginationCursorInput!): TrialConnection

    """
    @count-request
    """
    countFilteredTrials(search: searchTrialInput) : Int
  
    """
    @search-request
    """
    observationUnitsFilter(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationInput!): [observationUnit]


    """
    @search-request
    """
    observationUnitsConnection(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationCursorInput!): ObservationUnitConnection

    """
    @count-request
    """
    countFilteredObservationUnits(search: searchObservationUnitInput) : Int
  
    }
type ProgramConnection{
  edges: [ProgramEdge]
  pageInfo: pageInfo!
}

type ProgramEdge{
  cursor: String!
  node: program!
}

  type VueTableProgram{
    data : [program]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum programField {
    programDbId
    abbreviation
    commonCropName
    documentationURL
    leadPersonDbId
    objective
    programName
  }
  input searchProgramInput {
    field: programField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchProgramInput]
  }

  input orderProgramInput{
    field: programField
    order: Order
  }

  input bulkAssociationProgramWithLeadPersonDbIdInput{
    programDbId: ID!
    leadPersonDbId: ID!
  }

  type Query {
    programs(search: searchProgramInput, order: [ orderProgramInput ], pagination: paginationInput! ): [program]
    readOneProgram(programDbId: ID!): program
    countPrograms(search: searchProgramInput ): Int
    vueTableProgram : VueTableProgram    csvTableTemplateProgram: [String]
    programsConnection(search:searchProgramInput, order: [ orderProgramInput ], pagination: paginationCursorInput! ): ProgramConnection
  }

  type Mutation {
    addProgram(programDbId: ID!, abbreviation: String, commonCropName: String, documentationURL: String, objective: String, programName: String , addLeadPerson:ID  , addTrials:[ID], addObservationUnits:[ID] , skipAssociationsExistenceChecks:Boolean = false): program!
    updateProgram(programDbId: ID!, abbreviation: String, commonCropName: String, documentationURL: String, objective: String, programName: String , addLeadPerson:ID, removeLeadPerson:ID   , addTrials:[ID], removeTrials:[ID] , addObservationUnits:[ID], removeObservationUnits:[ID]  , skipAssociationsExistenceChecks:Boolean = false): program!
    deleteProgram(programDbId: ID!): String!
    bulkAddProgramCsv: String!
    bulkAssociateProgramWithLeadPersonDbId(bulkAssociationInput: [bulkAssociationProgramWithLeadPersonDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateProgramWithLeadPersonDbId(bulkAssociationInput: [bulkAssociationProgramWithLeadPersonDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
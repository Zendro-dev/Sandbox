module.exports = `
  type trial{
    """
    @original-field
    """
    trialDbId: ID
    """
    @original-field
    
    """
    active: Boolean

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
    endDate: DateTime

    """
    @original-field
    
    """
    startDate: DateTime

    """
    @original-field
    
    """
    trialDescription: String

    """
    @original-field
    
    """
    trialName: String

    """
    @original-field
    
    """
    trialPUI: String

    """
    @original-field
    
    """
    programDbId: String

    """
    @original-field
    
    """
    contactDbIds: [String]

    program(search: searchProgramInput): program
    
    """
    @search-request
    """
    contactsFilter(search: searchContactInput, order: [ orderContactInput ], pagination: paginationInput!): [contact]


    """
    @search-request
    """
    contactsConnection(search: searchContactInput, order: [ orderContactInput ], pagination: paginationCursorInput!): ContactConnection

    """
    @count-request
    """
    countFilteredContacts(search: searchContactInput) : Int
  
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
  
    """
    @search-request
    """
    studiesFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    studiesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudies(search: searchStudyInput) : Int
  
    }
type TrialConnection{
  edges: [TrialEdge]
  pageInfo: pageInfo!
}

type TrialEdge{
  cursor: String!
  node: trial!
}

  type VueTableTrial{
    data : [trial]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum trialField {
    trialDbId
    active
    commonCropName
    documentationURL
    endDate
    startDate
    trialDescription
    trialName
    trialPUI
    programDbId
    contactDbIds
  }
  input searchTrialInput {
    field: trialField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchTrialInput]
  }

  input orderTrialInput{
    field: trialField
    order: Order
  }

  input bulkAssociationTrialWithProgramDbIdInput{
    trialDbId: ID!
    programDbId: ID!
  }

  type Query {
    trials(search: searchTrialInput, order: [ orderTrialInput ], pagination: paginationInput! ): [trial]
    readOneTrial(trialDbId: ID!): trial
    countTrials(search: searchTrialInput ): Int
    vueTableTrial : VueTableTrial    csvTableTemplateTrial: [String]
    trialsConnection(search:searchTrialInput, order: [ orderTrialInput ], pagination: paginationCursorInput! ): TrialConnection
  }

  type Mutation {
    addTrial(trialDbId: ID!, active: Boolean, commonCropName: String, documentationURL: String, endDate: DateTime, startDate: DateTime, trialDescription: String, trialName: String, trialPUI: String , addProgram:ID  , addContacts:[ID], addObservationUnits:[ID], addStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): trial!
    updateTrial(trialDbId: ID!, active: Boolean, commonCropName: String, documentationURL: String, endDate: DateTime, startDate: DateTime, trialDescription: String, trialName: String, trialPUI: String , addProgram:ID, removeProgram:ID   , addContacts:[ID], removeContacts:[ID] , addObservationUnits:[ID], removeObservationUnits:[ID] , addStudies:[ID], removeStudies:[ID]  , skipAssociationsExistenceChecks:Boolean = false): trial!
    deleteTrial(trialDbId: ID!): String!
    bulkAddTrialCsv: String!
    bulkAssociateTrialWithProgramDbId(bulkAssociationInput: [bulkAssociationTrialWithProgramDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateTrialWithProgramDbId(bulkAssociationInput: [bulkAssociationTrialWithProgramDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
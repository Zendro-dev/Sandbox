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
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type TrialConnection{
  edges: [TrialEdge]
  trials: [trial]
  pageInfo: pageInfo!
}

type TrialEdge{
  cursor: String!
  node: trial!
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
  }
  
  input searchTrialInput {
    field: trialField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchTrialInput]
  }

  input orderTrialInput{
    field: trialField
    order: Order
  }



  type Query {
    trials(search: searchTrialInput, order: [ orderTrialInput ], pagination: paginationInput! ): [trial]
    readOneTrial(trialDbId: ID!): trial
    countTrials(search: searchTrialInput ): Int
    csvTableTemplateTrial: [String]
    trialsConnection(search:searchTrialInput, order: [ orderTrialInput ], pagination: paginationCursorInput! ): TrialConnection
    validateTrialForCreation(trialDbId: ID!, active: Boolean, commonCropName: String, documentationURL: String, endDate: DateTime, startDate: DateTime, trialDescription: String, trialName: String, trialPUI: String   , addObservationUnits:[ID], addStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateTrialForUpdating(trialDbId: ID!, active: Boolean, commonCropName: String, documentationURL: String, endDate: DateTime, startDate: DateTime, trialDescription: String, trialName: String, trialPUI: String   , addObservationUnits:[ID], removeObservationUnits:[ID] , addStudies:[ID], removeStudies:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateTrialForDeletion(trialDbId: ID!): Boolean!
    validateTrialAfterReading(trialDbId: ID!): Boolean!
    """
    trialsZendroDefinition would return the static Zendro data model definition
    """
    trialsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addTrial(trialDbId: ID!, active: Boolean, commonCropName: String, documentationURL: String, endDate: DateTime, startDate: DateTime, trialDescription: String, trialName: String, trialPUI: String   , addObservationUnits:[ID], addStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): trial!
    updateTrial(trialDbId: ID!, active: Boolean, commonCropName: String, documentationURL: String, endDate: DateTime, startDate: DateTime, trialDescription: String, trialName: String, trialPUI: String   , addObservationUnits:[ID], removeObservationUnits:[ID] , addStudies:[ID], removeStudies:[ID]  , skipAssociationsExistenceChecks:Boolean = false): trial!
    deleteTrial(trialDbId: ID!): String!
      }
`;
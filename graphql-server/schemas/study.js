module.exports = `
  type study{
    """
    @original-field
    """
    studyDbId: ID
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
    culturalPractices: String

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
    license: String

    """
    @original-field
    
    """
    observationUnitsDescription: String

    """
    @original-field
    
    """
    startDate: DateTime

    """
    @original-field
    
    """
    studyDescription: String

    """
    @original-field
    
    """
    studyName: String

    """
    @original-field
    
    """
    studyType: String

    """
    @original-field
    
    """
    trialDbId: String

    """
    @original-field
    
    """
    locationDbId: String

    location(search: searchLocationInput): location
  trial(search: searchTrialInput): trial
    
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
    observationsFilter(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationInput!): [observation]


    """
    @search-request
    """
    observationsConnection(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationCursorInput!): ObservationConnection

    """
    @count-request
    """
    countFilteredObservations(search: searchObservationInput) : Int
  
    """
    @search-request
    """
    eventsFilter(search: searchEventInput, order: [ orderEventInput ], pagination: paginationInput!): [event]


    """
    @search-request
    """
    eventsConnection(search: searchEventInput, order: [ orderEventInput ], pagination: paginationCursorInput!): EventConnection

    """
    @count-request
    """
    countFilteredEvents(search: searchEventInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type StudyConnection{
  edges: [StudyEdge]
  studies: [study]
  pageInfo: pageInfo!
}

type StudyEdge{
  cursor: String!
  node: study!
}

  enum studyField {
    studyDbId
    active
    commonCropName
    culturalPractices
    documentationURL
    endDate
    license
    observationUnitsDescription
    startDate
    studyDescription
    studyName
    studyType
    trialDbId
    locationDbId
  }
  
  input searchStudyInput {
    field: studyField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchStudyInput]
  }

  input orderStudyInput{
    field: studyField
    order: Order
  }

  input bulkAssociationStudyWithLocationDbIdInput{
    studyDbId: ID!
    locationDbId: ID!
  }  input bulkAssociationStudyWithTrialDbIdInput{
    studyDbId: ID!
    trialDbId: ID!
  }

  type Query {
    studies(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput! ): [study]
    readOneStudy(studyDbId: ID!): study
    countStudies(search: searchStudyInput ): Int
    csvTableTemplateStudy: [String]
    studiesConnection(search:searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput! ): StudyConnection
    validateStudyForCreation(studyDbId: ID!, active: Boolean, commonCropName: String, culturalPractices: String, documentationURL: String, endDate: DateTime, license: String, observationUnitsDescription: String, startDate: DateTime, studyDescription: String, studyName: String, studyType: String , addLocation:ID, addTrial:ID  , addObservationUnits:[ID], addObservations:[ID], addEvents:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateStudyForUpdating(studyDbId: ID!, active: Boolean, commonCropName: String, culturalPractices: String, documentationURL: String, endDate: DateTime, license: String, observationUnitsDescription: String, startDate: DateTime, studyDescription: String, studyName: String, studyType: String , addLocation:ID, removeLocation:ID , addTrial:ID, removeTrial:ID   , addObservationUnits:[ID], removeObservationUnits:[ID] , addObservations:[ID], removeObservations:[ID] , addEvents:[ID], removeEvents:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateStudyForDeletion(studyDbId: ID!): Boolean!
    validateStudyAfterReading(studyDbId: ID!): Boolean!
    """
    studiesZendroDefinition would return the static Zendro data model definition
    """
    studiesZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addStudy(studyDbId: ID!, active: Boolean, commonCropName: String, culturalPractices: String, documentationURL: String, endDate: DateTime, license: String, observationUnitsDescription: String, startDate: DateTime, studyDescription: String, studyName: String, studyType: String , addLocation:ID, addTrial:ID  , addObservationUnits:[ID], addObservations:[ID], addEvents:[ID] , skipAssociationsExistenceChecks:Boolean = false): study!
    updateStudy(studyDbId: ID!, active: Boolean, commonCropName: String, culturalPractices: String, documentationURL: String, endDate: DateTime, license: String, observationUnitsDescription: String, startDate: DateTime, studyDescription: String, studyName: String, studyType: String , addLocation:ID, removeLocation:ID , addTrial:ID, removeTrial:ID   , addObservationUnits:[ID], removeObservationUnits:[ID] , addObservations:[ID], removeObservations:[ID] , addEvents:[ID], removeEvents:[ID]  , skipAssociationsExistenceChecks:Boolean = false): study!
    deleteStudy(studyDbId: ID!): String!
        bulkAssociateStudyWithLocationDbId(bulkAssociationInput: [bulkAssociationStudyWithLocationDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateStudyWithLocationDbId(bulkAssociationInput: [bulkAssociationStudyWithLocationDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkAssociateStudyWithTrialDbId(bulkAssociationInput: [bulkAssociationStudyWithTrialDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateStudyWithTrialDbId(bulkAssociationInput: [bulkAssociationStudyWithTrialDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
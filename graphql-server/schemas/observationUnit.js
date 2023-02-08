module.exports = `
  type observationUnit{
    """
    @original-field
    """
    observationUnitDbId: ID
    """
    @original-field
    
    """
    observationLevel: String

    """
    @original-field
    
    """
    observationUnitName: String

    """
    @original-field
    
    """
    observationUnitPUI: String

    """
    @original-field
    
    """
    plantNumber: String

    """
    @original-field
    
    """
    germplasmDbId: String

    """
    @original-field
    
    """
    locationDbId: String

    """
    @original-field
    
    """
    studyDbId: String

    """
    @original-field
    
    """
    trialDbId: String

    """
    @original-field
    
    """
    eventDbIds: [String]

    observationUnitPosition(search: searchObservationUnitPositionInput): observationUnitPosition
  location(search: searchLocationInput): location
  germplasm(search: searchGermplasmInput): germplasm
  study(search: searchStudyInput): study
  trial(search: searchTrialInput): trial
    
    """
    @search-request
    """
    observationTreatmentsFilter(search: searchObservationTreatmentInput, order: [ orderObservationTreatmentInput ], pagination: paginationInput!): [observationTreatment]


    """
    @search-request
    """
    observationTreatmentsConnection(search: searchObservationTreatmentInput, order: [ orderObservationTreatmentInput ], pagination: paginationCursorInput!): ObservationTreatmentConnection

    """
    @count-request
    """
    countFilteredObservationTreatments(search: searchObservationTreatmentInput) : Int
  
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
type ObservationUnitConnection{
  edges: [ObservationUnitEdge]
  observationUnits: [observationUnit]
  pageInfo: pageInfo!
}

type ObservationUnitEdge{
  cursor: String!
  node: observationUnit!
}

  enum observationUnitField {
    observationUnitDbId
    observationLevel
    observationUnitName
    observationUnitPUI
    plantNumber
    germplasmDbId
    locationDbId
    studyDbId
    trialDbId
    eventDbIds
  }
  
  input searchObservationUnitInput {
    field: observationUnitField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchObservationUnitInput]
  }

  input orderObservationUnitInput{
    field: observationUnitField
    order: Order
  }

  input bulkAssociationObservationUnitWithLocationDbIdInput{
    observationUnitDbId: ID!
    locationDbId: ID!
  }  input bulkAssociationObservationUnitWithGermplasmDbIdInput{
    observationUnitDbId: ID!
    germplasmDbId: ID!
  }  input bulkAssociationObservationUnitWithStudyDbIdInput{
    observationUnitDbId: ID!
    studyDbId: ID!
  }  input bulkAssociationObservationUnitWithTrialDbIdInput{
    observationUnitDbId: ID!
    trialDbId: ID!
  }

  type Query {
    observationUnits(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationInput! ): [observationUnit]
    readOneObservationUnit(observationUnitDbId: ID!): observationUnit
    countObservationUnits(search: searchObservationUnitInput ): Int
    csvTableTemplateObservationUnit: [String]
    observationUnitsConnection(search:searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationCursorInput! ): ObservationUnitConnection
    validateObservationUnitForCreation(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String , addObservationUnitPosition:ID, addLocation:ID, addGermplasm:ID, addStudy:ID, addTrial:ID  , addObservationTreatments:[ID], addObservations:[ID], addEvents:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationUnitForUpdating(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String , addObservationUnitPosition:ID, removeObservationUnitPosition:ID , addLocation:ID, removeLocation:ID , addGermplasm:ID, removeGermplasm:ID , addStudy:ID, removeStudy:ID , addTrial:ID, removeTrial:ID   , addObservationTreatments:[ID], removeObservationTreatments:[ID] , addObservations:[ID], removeObservations:[ID] , addEvents:[ID], removeEvents:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationUnitForDeletion(observationUnitDbId: ID!): Boolean!
    validateObservationUnitAfterReading(observationUnitDbId: ID!): Boolean!
    """
    observationUnitsZendroDefinition would return the static Zendro data model definition
    """
    observationUnitsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addObservationUnit(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String , addObservationUnitPosition:ID, addLocation:ID, addGermplasm:ID, addStudy:ID, addTrial:ID  , addObservationTreatments:[ID], addObservations:[ID], addEvents:[ID] , skipAssociationsExistenceChecks:Boolean = false): observationUnit!
    updateObservationUnit(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String , addObservationUnitPosition:ID, removeObservationUnitPosition:ID , addLocation:ID, removeLocation:ID , addGermplasm:ID, removeGermplasm:ID , addStudy:ID, removeStudy:ID , addTrial:ID, removeTrial:ID   , addObservationTreatments:[ID], removeObservationTreatments:[ID] , addObservations:[ID], removeObservations:[ID] , addEvents:[ID], removeEvents:[ID]  , skipAssociationsExistenceChecks:Boolean = false): observationUnit!
    deleteObservationUnit(observationUnitDbId: ID!): String!
        bulkAssociateObservationUnitWithLocationDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithLocationDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationUnitWithLocationDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithLocationDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithGermplasmDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithGermplasmDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkAssociateObservationUnitWithStudyDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithStudyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationUnitWithStudyDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithStudyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkAssociateObservationUnitWithTrialDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithTrialDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationUnitWithTrialDbId(bulkAssociationInput: [bulkAssociationObservationUnitWithTrialDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
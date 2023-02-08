module.exports = `
  type observation{
    """
    @original-field
    """
    observationDbId: ID
    """
    @original-field
    
    """
    collector: String

    """
    @original-field
    
    """
    germplasmDbId: String

    """
    @original-field
    
    """
    studyDbId: String

    """
    @original-field
    
    """
    observationTimeStamp: DateTime

    """
    @original-field
    
    """
    observationUnitDbId: String

    """
    @original-field
    
    """
    uploadedBy: String

    """
    @original-field
    
    """
    value: String

    germplasm(search: searchGermplasmInput): germplasm
  study(search: searchStudyInput): study
  observationUnit(search: searchObservationUnitInput): observationUnit
    
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type ObservationConnection{
  edges: [ObservationEdge]
  observations: [observation]
  pageInfo: pageInfo!
}

type ObservationEdge{
  cursor: String!
  node: observation!
}

  enum observationField {
    observationDbId
    collector
    germplasmDbId
    studyDbId
    observationTimeStamp
    observationUnitDbId
    uploadedBy
    value
  }
  
  input searchObservationInput {
    field: observationField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchObservationInput]
  }

  input orderObservationInput{
    field: observationField
    order: Order
  }

  input bulkAssociationObservationWithGermplasmDbIdInput{
    observationDbId: ID!
    germplasmDbId: ID!
  }  input bulkAssociationObservationWithStudyDbIdInput{
    observationDbId: ID!
    studyDbId: ID!
  }  input bulkAssociationObservationWithObservationUnitDbIdInput{
    observationDbId: ID!
    observationUnitDbId: ID!
  }

  type Query {
    observations(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationInput! ): [observation]
    readOneObservation(observationDbId: ID!): observation
    countObservations(search: searchObservationInput ): Int
    csvTableTemplateObservation: [String]
    observationsConnection(search:searchObservationInput, order: [ orderObservationInput ], pagination: paginationCursorInput! ): ObservationConnection
    validateObservationForCreation(observationDbId: ID!, collector: String, observationTimeStamp: DateTime, uploadedBy: String, value: String , addGermplasm:ID, addStudy:ID, addObservationUnit:ID   , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationForUpdating(observationDbId: ID!, collector: String, observationTimeStamp: DateTime, uploadedBy: String, value: String , addGermplasm:ID, removeGermplasm:ID , addStudy:ID, removeStudy:ID , addObservationUnit:ID, removeObservationUnit:ID    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationForDeletion(observationDbId: ID!): Boolean!
    validateObservationAfterReading(observationDbId: ID!): Boolean!
    """
    observationsZendroDefinition would return the static Zendro data model definition
    """
    observationsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addObservation(observationDbId: ID!, collector: String, observationTimeStamp: DateTime, uploadedBy: String, value: String , addGermplasm:ID, addStudy:ID, addObservationUnit:ID   , skipAssociationsExistenceChecks:Boolean = false): observation!
    updateObservation(observationDbId: ID!, collector: String, observationTimeStamp: DateTime, uploadedBy: String, value: String , addGermplasm:ID, removeGermplasm:ID , addStudy:ID, removeStudy:ID , addObservationUnit:ID, removeObservationUnit:ID    , skipAssociationsExistenceChecks:Boolean = false): observation!
    deleteObservation(observationDbId: ID!): String!
        bulkAssociateObservationWithGermplasmDbId(bulkAssociationInput: [bulkAssociationObservationWithGermplasmDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationWithGermplasmDbId(bulkAssociationInput: [bulkAssociationObservationWithGermplasmDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkAssociateObservationWithStudyDbId(bulkAssociationInput: [bulkAssociationObservationWithStudyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationWithStudyDbId(bulkAssociationInput: [bulkAssociationObservationWithStudyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkAssociateObservationWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationObservationWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationObservationWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
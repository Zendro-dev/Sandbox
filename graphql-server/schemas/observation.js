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

  input bulkAssociationObservationWithObservationUnitDbIdInput{
    observationDbId: ID!
    observationUnitDbId: ID!
  }

  type Query {
    observations(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationInput! ): [observation]
    readOneObservation(observationDbId: ID!): observation
    countObservations(search: searchObservationInput ): Int
    csvTableTemplateObservation: [String]
    observationsConnection(search:searchObservationInput, order: [ orderObservationInput ], pagination: paginationCursorInput! ): ObservationConnection
    validateObservationForCreation(observationDbId: ID!, collector: String, observationTimeStamp: DateTime, uploadedBy: String, value: String , addObservationUnit:ID   , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationForUpdating(observationDbId: ID!, collector: String, observationTimeStamp: DateTime, uploadedBy: String, value: String , addObservationUnit:ID, removeObservationUnit:ID    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationForDeletion(observationDbId: ID!): Boolean!
    validateObservationAfterReading(observationDbId: ID!): Boolean!
    """
    observationsZendroDefinition would return the static Zendro data model definition
    """
    observationsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addObservation(observationDbId: ID!, collector: String, observationTimeStamp: DateTime, uploadedBy: String, value: String , addObservationUnit:ID   , skipAssociationsExistenceChecks:Boolean = false): observation!
    updateObservation(observationDbId: ID!, collector: String, observationTimeStamp: DateTime, uploadedBy: String, value: String , addObservationUnit:ID, removeObservationUnit:ID    , skipAssociationsExistenceChecks:Boolean = false): observation!
    deleteObservation(observationDbId: ID!): String!
        bulkAssociateObservationWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationObservationWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationObservationWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
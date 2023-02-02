module.exports = `
  type observationUnitPosition{
    """
    @original-field
    """
    observationUnitPositionDbId: ID
    """
    @original-field
    
    """
    blockNumber: String

    """
    @original-field
    
    """
    entryNumber: String

    """
    @original-field
    
    """
    positionCoordinateX: String

    """
    @original-field
    
    """
    positionCoordinateY: String

    """
    @original-field
    
    """
    replicate: String

    """
    @original-field
    
    """
    observationUnitDbId: String

    observationUnit(search: searchObservationUnitInput): observationUnit
    
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type ObservationUnitPositionConnection{
  edges: [ObservationUnitPositionEdge]
  observationUnitPositions: [observationUnitPosition]
  pageInfo: pageInfo!
}

type ObservationUnitPositionEdge{
  cursor: String!
  node: observationUnitPosition!
}

  enum observationUnitPositionField {
    observationUnitPositionDbId
    blockNumber
    entryNumber
    positionCoordinateX
    positionCoordinateY
    replicate
    observationUnitDbId
  }
  
  input searchObservationUnitPositionInput {
    field: observationUnitPositionField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchObservationUnitPositionInput]
  }

  input orderObservationUnitPositionInput{
    field: observationUnitPositionField
    order: Order
  }

  input bulkAssociationObservationUnitPositionWithObservationUnitDbIdInput{
    observationUnitPositionDbId: ID!
    observationUnitDbId: ID!
  }

  type Query {
    observationUnitPositions(search: searchObservationUnitPositionInput, order: [ orderObservationUnitPositionInput ], pagination: paginationInput! ): [observationUnitPosition]
    readOneObservationUnitPosition(observationUnitPositionDbId: ID!): observationUnitPosition
    countObservationUnitPositions(search: searchObservationUnitPositionInput ): Int
    csvTableTemplateObservationUnitPosition: [String]
    observationUnitPositionsConnection(search:searchObservationUnitPositionInput, order: [ orderObservationUnitPositionInput ], pagination: paginationCursorInput! ): ObservationUnitPositionConnection
    validateObservationUnitPositionForCreation(observationUnitPositionDbId: ID!, blockNumber: String, entryNumber: String, positionCoordinateX: String, positionCoordinateY: String, replicate: String , addObservationUnit:ID   , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationUnitPositionForUpdating(observationUnitPositionDbId: ID!, blockNumber: String, entryNumber: String, positionCoordinateX: String, positionCoordinateY: String, replicate: String , addObservationUnit:ID, removeObservationUnit:ID    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationUnitPositionForDeletion(observationUnitPositionDbId: ID!): Boolean!
    validateObservationUnitPositionAfterReading(observationUnitPositionDbId: ID!): Boolean!
    """
    observationUnitPositionsZendroDefinition would return the static Zendro data model definition
    """
    observationUnitPositionsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addObservationUnitPosition(observationUnitPositionDbId: ID!, blockNumber: String, entryNumber: String, positionCoordinateX: String, positionCoordinateY: String, replicate: String , addObservationUnit:ID   , skipAssociationsExistenceChecks:Boolean = false): observationUnitPosition!
    updateObservationUnitPosition(observationUnitPositionDbId: ID!, blockNumber: String, entryNumber: String, positionCoordinateX: String, positionCoordinateY: String, replicate: String , addObservationUnit:ID, removeObservationUnit:ID    , skipAssociationsExistenceChecks:Boolean = false): observationUnitPosition!
    deleteObservationUnitPosition(observationUnitPositionDbId: ID!): String!
        bulkAssociateObservationUnitPositionWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationObservationUnitPositionWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationUnitPositionWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationObservationUnitPositionWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
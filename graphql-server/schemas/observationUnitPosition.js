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
    
    }
type ObservationUnitPositionConnection{
  edges: [ObservationUnitPositionEdge]
  pageInfo: pageInfo!
}

type ObservationUnitPositionEdge{
  cursor: String!
  node: observationUnitPosition!
}

  type VueTableObservationUnitPosition{
    data : [observationUnitPosition]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
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
    operator: Operator
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
    vueTableObservationUnitPosition : VueTableObservationUnitPosition    csvTableTemplateObservationUnitPosition: [String]
    observationUnitPositionsConnection(search:searchObservationUnitPositionInput, order: [ orderObservationUnitPositionInput ], pagination: paginationCursorInput! ): ObservationUnitPositionConnection
  }

  type Mutation {
    addObservationUnitPosition(observationUnitPositionDbId: ID!, blockNumber: String, entryNumber: String, positionCoordinateX: String, positionCoordinateY: String, replicate: String , addObservationUnit:ID   , skipAssociationsExistenceChecks:Boolean = false): observationUnitPosition!
    updateObservationUnitPosition(observationUnitPositionDbId: ID!, blockNumber: String, entryNumber: String, positionCoordinateX: String, positionCoordinateY: String, replicate: String , addObservationUnit:ID, removeObservationUnit:ID    , skipAssociationsExistenceChecks:Boolean = false): observationUnitPosition!
    deleteObservationUnitPosition(observationUnitPositionDbId: ID!): String!
    bulkAddObservationUnitPositionCsv: String!
    bulkAssociateObservationUnitPositionWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationObservationUnitPositionWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationUnitPositionWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationObservationUnitPositionWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
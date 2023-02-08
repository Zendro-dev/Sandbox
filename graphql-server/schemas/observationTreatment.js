module.exports = `
  type observationTreatment{
    """
    @original-field
    """
    observationTreatmentDbId: ID
    """
    @original-field
    
    """
    factor: String

    """
    @original-field
    
    """
    modality: String

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
type ObservationTreatmentConnection{
  edges: [ObservationTreatmentEdge]
  observationTreatments: [observationTreatment]
  pageInfo: pageInfo!
}

type ObservationTreatmentEdge{
  cursor: String!
  node: observationTreatment!
}

  enum observationTreatmentField {
    observationTreatmentDbId
    factor
    modality
    observationUnitDbId
  }
  
  input searchObservationTreatmentInput {
    field: observationTreatmentField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchObservationTreatmentInput]
  }

  input orderObservationTreatmentInput{
    field: observationTreatmentField
    order: Order
  }

  input bulkAssociationObservationTreatmentWithObservationUnitDbIdInput{
    observationTreatmentDbId: ID!
    observationUnitDbId: ID!
  }

  type Query {
    observationTreatments(search: searchObservationTreatmentInput, order: [ orderObservationTreatmentInput ], pagination: paginationInput! ): [observationTreatment]
    readOneObservationTreatment(observationTreatmentDbId: ID!): observationTreatment
    countObservationTreatments(search: searchObservationTreatmentInput ): Int
    csvTableTemplateObservationTreatment: [String]
    observationTreatmentsConnection(search:searchObservationTreatmentInput, order: [ orderObservationTreatmentInput ], pagination: paginationCursorInput! ): ObservationTreatmentConnection
    validateObservationTreatmentForCreation(observationTreatmentDbId: ID!, factor: String, modality: String , addObservationUnit:ID   , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationTreatmentForUpdating(observationTreatmentDbId: ID!, factor: String, modality: String , addObservationUnit:ID, removeObservationUnit:ID    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationTreatmentForDeletion(observationTreatmentDbId: ID!): Boolean!
    validateObservationTreatmentAfterReading(observationTreatmentDbId: ID!): Boolean!
    """
    observationTreatmentsZendroDefinition would return the static Zendro data model definition
    """
    observationTreatmentsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addObservationTreatment(observationTreatmentDbId: ID!, factor: String, modality: String , addObservationUnit:ID   , skipAssociationsExistenceChecks:Boolean = false): observationTreatment!
    updateObservationTreatment(observationTreatmentDbId: ID!, factor: String, modality: String , addObservationUnit:ID, removeObservationUnit:ID    , skipAssociationsExistenceChecks:Boolean = false): observationTreatment!
    deleteObservationTreatment(observationTreatmentDbId: ID!): String!
        bulkAssociateObservationTreatmentWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationObservationTreatmentWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateObservationTreatmentWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationObservationTreatmentWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
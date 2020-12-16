module.exports = `
  type scale{
    """
    @original-field
    """
    scaleDbId: ID
    """
    @original-field
    
    """
    decimalPlaces: Int

    """
    @original-field
    
    """
    scaleName: String

    """
    @original-field
    
    """
    xref: String

    """
    @original-field
    
    """
    ontologyDbId: String

    ontologyReference(search: searchOntologyReferenceInput): ontologyReference
    
    """
    @search-request
    """
    observationVariablesFilter(search: searchObservationVariableInput, order: [ orderObservationVariableInput ], pagination: paginationInput!): [observationVariable]


    """
    @search-request
    """
    observationVariablesConnection(search: searchObservationVariableInput, order: [ orderObservationVariableInput ], pagination: paginationCursorInput!): ObservationVariableConnection

    """
    @count-request
    """
    countFilteredObservationVariables(search: searchObservationVariableInput) : Int
  
    }
type ScaleConnection{
  edges: [ScaleEdge]
  pageInfo: pageInfo!
}

type ScaleEdge{
  cursor: String!
  node: scale!
}

  type VueTableScale{
    data : [scale]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum scaleField {
    scaleDbId
    decimalPlaces
    scaleName
    xref
    ontologyDbId
  }
  input searchScaleInput {
    field: scaleField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchScaleInput]
  }

  input orderScaleInput{
    field: scaleField
    order: Order
  }

  input bulkAssociationScaleWithOntologyDbIdInput{
    scaleDbId: ID!
    ontologyDbId: ID!
  }

  type Query {
    scales(search: searchScaleInput, order: [ orderScaleInput ], pagination: paginationInput! ): [scale]
    readOneScale(scaleDbId: ID!): scale
    countScales(search: searchScaleInput ): Int
    vueTableScale : VueTableScale    csvTableTemplateScale: [String]
    scalesConnection(search:searchScaleInput, order: [ orderScaleInput ], pagination: paginationCursorInput! ): ScaleConnection
  }

  type Mutation {
    addScale(scaleDbId: ID!, decimalPlaces: Int, scaleName: String, xref: String , addOntologyReference:ID  , addObservationVariables:[ID] , skipAssociationsExistenceChecks:Boolean = false): scale!
    updateScale(scaleDbId: ID!, decimalPlaces: Int, scaleName: String, xref: String , addOntologyReference:ID, removeOntologyReference:ID   , addObservationVariables:[ID], removeObservationVariables:[ID]  , skipAssociationsExistenceChecks:Boolean = false): scale!
    deleteScale(scaleDbId: ID!): String!
    bulkAddScaleCsv: String!
    bulkAssociateScaleWithOntologyDbId(bulkAssociationInput: [bulkAssociationScaleWithOntologyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateScaleWithOntologyDbId(bulkAssociationInput: [bulkAssociationScaleWithOntologyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
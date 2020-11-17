module.exports = `
  type trait{
    """
    @original-field
    """
    traitDbId: ID
    """
    @original-field
    
    """
    attribute: String

    """
    @original-field
    
    """
    entity: String

    """
    @original-field
    
    """
    mainAbbreviation: String

    """
    @original-field
    
    """
    status: String

    """
    @original-field
    
    """
    traitClass: String

    """
    @original-field
    
    """
    traitDescription: String

    """
    @original-field
    
    """
    traitName: String

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
type TraitConnection{
  edges: [TraitEdge]
  pageInfo: pageInfo!
}

type TraitEdge{
  cursor: String!
  node: trait!
}

  type VueTableTrait{
    data : [trait]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum traitField {
    traitDbId
    attribute
    entity
    mainAbbreviation
    status
    traitClass
    traitDescription
    traitName
    xref
    ontologyDbId
  }
  input searchTraitInput {
    field: traitField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchTraitInput]
  }

  input orderTraitInput{
    field: traitField
    order: Order
  }

  input bulkAssociationTraitWithOntologyDbIdInput{
    traitDbId: ID!
    ontologyDbId: ID!
  }

  type Query {
    traits(search: searchTraitInput, order: [ orderTraitInput ], pagination: paginationInput! ): [trait]
    readOneTrait(traitDbId: ID!): trait
    countTraits(search: searchTraitInput ): Int
    vueTableTrait : VueTableTrait    csvTableTemplateTrait: [String]
    traitsConnection(search:searchTraitInput, order: [ orderTraitInput ], pagination: paginationCursorInput! ): TraitConnection
  }

  type Mutation {
    addTrait(traitDbId: ID!, attribute: String, entity: String, mainAbbreviation: String, status: String, traitClass: String, traitDescription: String, traitName: String, xref: String , addOntologyReference:ID  , addObservationVariables:[ID] , skipAssociationsExistenceChecks:Boolean = false): trait!
    updateTrait(traitDbId: ID!, attribute: String, entity: String, mainAbbreviation: String, status: String, traitClass: String, traitDescription: String, traitName: String, xref: String , addOntologyReference:ID, removeOntologyReference:ID   , addObservationVariables:[ID], removeObservationVariables:[ID]  , skipAssociationsExistenceChecks:Boolean = false): trait!
    deleteTrait(traitDbId: ID!): String!
    bulkAddTraitCsv: String!
    bulkAssociateTraitWithOntologyDbId(bulkAssociationInput: [bulkAssociationTraitWithOntologyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateTraitWithOntologyDbId(bulkAssociationInput: [bulkAssociationTraitWithOntologyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
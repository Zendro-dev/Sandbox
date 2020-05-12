module.exports = `
type ontologyReference{
  """
  @original-field
  """
  ontologyDbId: ID

"""
  @original-field
  
  """
  documentationURL: String

"""
  @original-field
  
  """
  ontologyName: String

"""
  @original-field
  
  """
  version: String


  """
  @search-request
  """
  scalesConnection(search: searchScaleInput, order: [ orderScaleInput ], pagination: paginationCursorInput): ScaleConnection

  """
  @count-request
  """
  countFilteredScales(search: searchScaleInput) : Int

  """
  @search-request
  """
  methodsConnection(search: searchMethodInput, order: [ orderMethodInput ], pagination: paginationCursorInput): MethodConnection

  """
  @count-request
  """
  countFilteredMethods(search: searchMethodInput) : Int

  """
  @search-request
  """
  traitsConnection(search: searchTraitInput, order: [ orderTraitInput ], pagination: paginationCursorInput): TraitConnection

  """
  @count-request
  """
  countFilteredTraits(search: searchTraitInput) : Int

  """
  @search-request
  """
  observationVariablesConnection(search: searchObservationVariableInput, order: [ orderObservationVariableInput ], pagination: paginationCursorInput): ObservationVariableConnection

  """
  @count-request
  """
  countFilteredObservationVariables(search: searchObservationVariableInput) : Int
}

type OntologyReferenceConnection{
edges: [OntologyReferenceEdge]
pageInfo: pageInfo!
}

type OntologyReferenceEdge{
cursor: String!
node: ontologyReference!
}

type VueTableOntologyReference{
  data : [ontologyReference]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum ontologyReferenceField {
  ontologyDbId
  documentationURL
  ontologyName
  version
}

input searchOntologyReferenceInput {
  field: ontologyReferenceField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchOntologyReferenceInput]
}

input orderOntologyReferenceInput{
  field: ontologyReferenceField
  order: Order
}

type Query {
  readOneOntologyReference(ontologyDbId: ID!): ontologyReference
  countOntologyReferences(search: searchOntologyReferenceInput ): Int
  vueTableOntologyReference : VueTableOntologyReference  csvTableTemplateOntologyReference: [String]

  ontologyReferencesConnection(search:searchOntologyReferenceInput, order: [ orderOntologyReferenceInput ], pagination: paginationCursorInput ): OntologyReferenceConnection
}

  type Mutation {
  addOntologyReference(ontologyDbId: ID!, documentationURL: String, ontologyName: String, version: String  , addScales:[ID], addMethods:[ID], addTraits:[ID], addObservationVariables:[ID], skipAssociationsExistenceChecks:Boolean = false): ontologyReference!
  updateOntologyReference(ontologyDbId: ID!, documentationURL: String, ontologyName: String, version: String  , addScales:[ID], removeScales:[ID] , addMethods:[ID], removeMethods:[ID] , addTraits:[ID], removeTraits:[ID] , addObservationVariables:[ID], removeObservationVariables:[ID] , skipAssociationsExistenceChecks:Boolean = false): ontologyReference!
deleteOntologyReference(ontologyDbId: ID!): String!
bulkAddOntologyReferenceCsv: [ontologyReference] }

`;
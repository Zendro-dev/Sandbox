module.exports = `
type observation_unit{
  """
  @original-field
  """
  id: ID

  """
  @original-field
  
  """
  type: String
"""
  @original-field
  
  """
  external_id: String
"""
  @original-field
  
  """
  spatial_distribution: String
"""
  @original-field
  
  """
  study_id: String
"""
  @original-field
  
  """
  biological_material_ids: [String]
"""
  @original-field
  
  """
  data_file_ids: [Int]
"""
  @original-field
  
  """
  event_ids: [Int]
"""
  @original-field
  
  """
  factor_ids: [Int]


study(search: searchStudyInput): study
  """
  @search-request
  """
  biological_materialsConnection(search: searchBiological_materialInput, order: [ orderBiological_materialInput ], pagination: paginationCursorInput!): Biological_materialConnection
  """
  @count-request
  """
  countFilteredBiological_materials(search: searchBiological_materialInput) : Int
  """
  @search-request
  """
  data_filesConnection(search: searchData_fileInput, order: [ orderData_fileInput ], pagination: paginationCursorInput!): Data_fileConnection
  """
  @count-request
  """
  countFilteredData_files(search: searchData_fileInput) : Int
  """
  @search-request
  """
  eventsConnection(search: searchEventInput, order: [ orderEventInput ], pagination: paginationCursorInput!): EventConnection
  """
  @count-request
  """
  countFilteredEvents(search: searchEventInput) : Int
  """
  @search-request
  """
  factorsConnection(search: searchFactorInput, order: [ orderFactorInput ], pagination: paginationCursorInput!): FactorConnection
  """
  @count-request
  """
  countFilteredFactors(search: searchFactorInput) : Int
  """
  @search-request
  """
  samplesConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput!): SampleConnection
  """
  @count-request
  """
  countFilteredSamples(search: searchSampleInput) : Int

  """
  @misc-field
  """
  asCursor: String!
}

type Observation_unitConnection{
edges: [Observation_unitEdge]
observation_units: [observation_unit]
pageInfo: pageInfo!
}

type Observation_unitEdge{
cursor: String!
node: observation_unit!
}


enum observation_unitField {
  id
  type
  external_id
  spatial_distribution
  study_id
  biological_material_ids
  data_file_ids
  event_ids
  factor_ids

}

input searchObservation_unitInput {
  field: observation_unitField
  value: String
  valueType: InputType
  operator: GenericPrestoSqlOperator  excludeAdapterNames: [String]
  search: [searchObservation_unitInput]
}

input orderObservation_unitInput{
  field: observation_unitField
  order: Order
}

input bulkAssociationObservation_unitWithStudy_idInput{
  id: ID!
  study_id: ID!
}

type Query {
  readOneObservation_unit(id: ID!): observation_unit
  countObservation_units(search: searchObservation_unitInput ): Int
  csvTableTemplateObservation_unit: [String]
  observation_unitsConnection(search:searchObservation_unitInput, order: [ orderObservation_unitInput ], pagination: paginationCursorInput!): Observation_unitConnection
  validateObservation_unitForCreation(id: ID!, type: String, external_id: String, spatial_distribution: String , addStudy:ID  , addBiological_materials:[ID], addData_files:[ID], addEvents:[ID], addFactors:[ID], addSamples:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateObservation_unitForUpdating(id: ID!, type: String, external_id: String, spatial_distribution: String , addStudy:ID, removeStudy:ID   , addBiological_materials:[ID], removeBiological_materials:[ID] , addData_files:[ID], removeData_files:[ID] , addEvents:[ID], removeEvents:[ID] , addFactors:[ID], removeFactors:[ID] , addSamples:[ID], removeSamples:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateObservation_unitForDeletion(id: ID!): Boolean!
  validateObservation_unitAfterReading(id: ID!): Boolean!
  """
  observation_unitsZendroDefinition would return the static Zendro data model definition
  """
  observation_unitsZendroDefinition: GraphQLJSONObject
}

type Mutation {
  addObservation_unit(id: ID!, type: String, external_id: String, spatial_distribution: String , addStudy:ID  , addBiological_materials:[ID], addData_files:[ID], addEvents:[ID], addFactors:[ID], addSamples:[ID] , skipAssociationsExistenceChecks:Boolean = false): observation_unit!
  updateObservation_unit(id: ID!, type: String, external_id: String, spatial_distribution: String , addStudy:ID, removeStudy:ID   , addBiological_materials:[ID], removeBiological_materials:[ID] , addData_files:[ID], removeData_files:[ID] , addEvents:[ID], removeEvents:[ID] , addFactors:[ID], removeFactors:[ID] , addSamples:[ID], removeSamples:[ID]  , skipAssociationsExistenceChecks:Boolean = false): observation_unit!
  deleteObservation_unit(id: ID!): String!
    bulkAssociateObservation_unitWithStudy_id(bulkAssociationInput: [bulkAssociationObservation_unitWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  bulkDisAssociateObservation_unitWithStudy_id(bulkAssociationInput: [bulkAssociationObservation_unitWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
}
`;
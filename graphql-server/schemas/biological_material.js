module.exports = `
type biological_material{
  """
  @original-field
  """
  id: ID

  """
  @original-field
  
  """
  organism: String
"""
  @original-field
  
  """
  genus: String
"""
  @original-field
  
  """
  species: String
"""
  @original-field
  
  """
  infraspecific_name: String
"""
  @original-field
  
  """
  location_latitude: String
"""
  @original-field
  
  """
  location_longitude: String
"""
  @original-field
  
  """
  location_altitude: Float
"""
  @original-field
  
  """
  location_coordinates_uncertainty: Float
"""
  @original-field
  
  """
  preprocessing: String
"""
  @original-field
  
  """
  source_id: String
"""
  @original-field
  
  """
  source_doi: String
"""
  @original-field
  
  """
  source_latitude: String
"""
  @original-field
  
  """
  source_longitude: String
"""
  @original-field
  
  """
  source_altitude: Float
"""
  @original-field
  
  """
  source_coordinates_uncertainty: Float
"""
  @original-field
  
  """
  source_description: String
"""
  @original-field
  
  """
  study_ids: [String]
"""
  @original-field
  
  """
  observation_unit_ids: [String]


  """
  @search-request
  """
  studiesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection
  """
  @count-request
  """
  countFilteredStudies(search: searchStudyInput) : Int
  """
  @search-request
  """
  observation_unitsConnection(search: searchObservation_unitInput, order: [ orderObservation_unitInput ], pagination: paginationCursorInput!): Observation_unitConnection
  """
  @count-request
  """
  countFilteredObservation_units(search: searchObservation_unitInput) : Int

  """
  @misc-field
  """
  asCursor: String!
}

type Biological_materialConnection{
edges: [Biological_materialEdge]
biological_materials: [biological_material]
pageInfo: pageInfo!
}

type Biological_materialEdge{
cursor: String!
node: biological_material!
}

type VueTableBiological_material{
  data : [biological_material]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum biological_materialField {
  id
  organism
  genus
  species
  infraspecific_name
  location_latitude
  location_longitude
  location_altitude
  location_coordinates_uncertainty
  preprocessing
  source_id
  source_doi
  source_latitude
  source_longitude
  source_altitude
  source_coordinates_uncertainty
  source_description
  study_ids
  observation_unit_ids

}

input searchBiological_materialInput {
  field: biological_materialField
  value: String
  valueType: InputType
  operator: GenericPrestoSqlOperator  excludeAdapterNames: [String]
  search: [searchBiological_materialInput]
}

input orderBiological_materialInput{
  field: biological_materialField
  order: Order
}



type Query {
  readOneBiological_material(id: ID!): biological_material
  countBiological_materials(search: searchBiological_materialInput ): Int
  vueTableBiological_material : VueTableBiological_material  csvTableTemplateBiological_material: [String]
  biological_materialsConnection(search:searchBiological_materialInput, order: [ orderBiological_materialInput ], pagination: paginationCursorInput!): Biological_materialConnection
  validateBiological_materialForCreation(id: ID!, organism: String, genus: String, species: String, infraspecific_name: String, location_latitude: String, location_longitude: String, location_altitude: Float, location_coordinates_uncertainty: Float, preprocessing: String, source_id: String, source_doi: String, source_latitude: String, source_longitude: String, source_altitude: Float, source_coordinates_uncertainty: Float, source_description: String   , addStudies:[ID], addObservation_units:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateBiological_materialForUpdating(id: ID!, organism: String, genus: String, species: String, infraspecific_name: String, location_latitude: String, location_longitude: String, location_altitude: Float, location_coordinates_uncertainty: Float, preprocessing: String, source_id: String, source_doi: String, source_latitude: String, source_longitude: String, source_altitude: Float, source_coordinates_uncertainty: Float, source_description: String   , addStudies:[ID], removeStudies:[ID] , addObservation_units:[ID], removeObservation_units:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
  validateBiological_materialForDeletion(id: ID!): Boolean!
  validateBiological_materialAfterReading(id: ID!): Boolean!
}

type Mutation {
  addBiological_material(id: ID!, organism: String, genus: String, species: String, infraspecific_name: String, location_latitude: String, location_longitude: String, location_altitude: Float, location_coordinates_uncertainty: Float, preprocessing: String, source_id: String, source_doi: String, source_latitude: String, source_longitude: String, source_altitude: Float, source_coordinates_uncertainty: Float, source_description: String   , addStudies:[ID], addObservation_units:[ID] , skipAssociationsExistenceChecks:Boolean = false): biological_material!
  updateBiological_material(id: ID!, organism: String, genus: String, species: String, infraspecific_name: String, location_latitude: String, location_longitude: String, location_altitude: Float, location_coordinates_uncertainty: Float, preprocessing: String, source_id: String, source_doi: String, source_latitude: String, source_longitude: String, source_altitude: Float, source_coordinates_uncertainty: Float, source_description: String   , addStudies:[ID], removeStudies:[ID] , addObservation_units:[ID], removeObservation_units:[ID]  , skipAssociationsExistenceChecks:Boolean = false): biological_material!
  deleteBiological_material(id: ID!): String!
  bulkAddBiological_materialCsv: String
  }
`;
module.exports = `
  type sample{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    characteristics_fk: [String]

    """
    @original-field
    
    """
    factorValues_fk: [String]

    """
    @original-field
    
    """
    derivesFrom_fk: [String]

    """
    @original-field
    
    """
    assay_materials_samples_fk: [String]

    """
    @original-field
    
    """
    study_materials_samples_fk: [String]

    """
    @original-field
    
    """
    process_inputs_sample_fk: [String]

    """
    @original-field
    
    """
    process_outputs_sample_fk: [String]

      
    """
    @search-request
    """
    characteristicsFilter(search: searchMaterial_attribute_valueInput, order: [ orderMaterial_attribute_valueInput ], pagination: paginationInput!): [material_attribute_value]


    """
    @search-request
    """
    characteristicsConnection(search: searchMaterial_attribute_valueInput, order: [ orderMaterial_attribute_valueInput ], pagination: paginationCursorInput!): Material_attribute_valueConnection

    """
    @count-request
    """
    countFilteredCharacteristics(search: searchMaterial_attribute_valueInput) : Int
  
    """
    @search-request
    """
    factorValuesFilter(search: searchFactor_valueInput, order: [ orderFactor_valueInput ], pagination: paginationInput!): [factor_value]


    """
    @search-request
    """
    factorValuesConnection(search: searchFactor_valueInput, order: [ orderFactor_valueInput ], pagination: paginationCursorInput!): Factor_valueConnection

    """
    @count-request
    """
    countFilteredFactorValues(search: searchFactor_valueInput) : Int
  
    """
    @search-request
    """
    derivesFromFilter(search: searchSourceInput, order: [ orderSourceInput ], pagination: paginationInput!): [source]


    """
    @search-request
    """
    derivesFromConnection(search: searchSourceInput, order: [ orderSourceInput ], pagination: paginationCursorInput!): SourceConnection

    """
    @count-request
    """
    countFilteredDerivesFrom(search: searchSourceInput) : Int
  
    """
    @search-request
    """
    commentsFilter(search: searchCommentInput, order: [ orderCommentInput ], pagination: paginationInput!): [comment]


    """
    @search-request
    """
    commentsConnection(search: searchCommentInput, order: [ orderCommentInput ], pagination: paginationCursorInput!): CommentConnection

    """
    @count-request
    """
    countFilteredComments(search: searchCommentInput) : Int
  
    """
    @search-request
    """
    process_inputs_sampleFilter(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationInput!): [process]


    """
    @search-request
    """
    process_inputs_sampleConnection(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationCursorInput!): ProcessConnection

    """
    @count-request
    """
    countFilteredProcess_inputs_sample(search: searchProcessInput) : Int
  
    """
    @search-request
    """
    process_outputs_sampleFilter(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationInput!): [process]


    """
    @search-request
    """
    process_outputs_sampleConnection(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationCursorInput!): ProcessConnection

    """
    @count-request
    """
    countFilteredProcess_outputs_sample(search: searchProcessInput) : Int
  
    """
    @search-request
    """
    assay_materials_samplesFilter(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationInput!): [assay]


    """
    @search-request
    """
    assay_materials_samplesConnection(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationCursorInput!): AssayConnection

    """
    @count-request
    """
    countFilteredAssay_materials_samples(search: searchAssayInput) : Int
  
    """
    @search-request
    """
    study_materials_samplesFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    study_materials_samplesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudy_materials_samples(search: searchStudyInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type SampleConnection{
  edges: [SampleEdge]
  samples: [sample]
  pageInfo: pageInfo!
}

type SampleEdge{
  cursor: String!
  node: sample!
}

  enum sampleField {
    id
    name
    characteristics_fk
    factorValues_fk
    derivesFrom_fk
    assay_materials_samples_fk
    study_materials_samples_fk
    process_inputs_sample_fk
    process_outputs_sample_fk
  }
  
  input searchSampleInput {
    field: sampleField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchSampleInput]
  }

  input orderSampleInput{
    field: sampleField
    order: Order
  }



  type Query {
    samples(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput! ): [sample]
    readOneSample(id: ID!): sample
    countSamples(search: searchSampleInput ): Int
    csvTableTemplateSample: [String]
    samplesConnection(search:searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput! ): SampleConnection
    validateSampleForCreation(id: ID!, name: String   , addCharacteristics:[ID], addFactorValues:[ID], addDerivesFrom:[ID], addComments:[ID], addProcess_inputs_sample:[ID], addProcess_outputs_sample:[ID], addAssay_materials_samples:[ID], addStudy_materials_samples:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateSampleForUpdating(id: ID!, name: String   , addCharacteristics:[ID], removeCharacteristics:[ID] , addFactorValues:[ID], removeFactorValues:[ID] , addDerivesFrom:[ID], removeDerivesFrom:[ID] , addComments:[ID], removeComments:[ID] , addProcess_inputs_sample:[ID], removeProcess_inputs_sample:[ID] , addProcess_outputs_sample:[ID], removeProcess_outputs_sample:[ID] , addAssay_materials_samples:[ID], removeAssay_materials_samples:[ID] , addStudy_materials_samples:[ID], removeStudy_materials_samples:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateSampleForDeletion(id: ID!): Boolean!
    validateSampleAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addSample(id: ID!, name: String   , addCharacteristics:[ID], addFactorValues:[ID], addDerivesFrom:[ID], addComments:[ID], addProcess_inputs_sample:[ID], addProcess_outputs_sample:[ID], addAssay_materials_samples:[ID], addStudy_materials_samples:[ID] , skipAssociationsExistenceChecks:Boolean = false): sample!
    updateSample(id: ID!, name: String   , addCharacteristics:[ID], removeCharacteristics:[ID] , addFactorValues:[ID], removeFactorValues:[ID] , addDerivesFrom:[ID], removeDerivesFrom:[ID] , addComments:[ID], removeComments:[ID] , addProcess_inputs_sample:[ID], removeProcess_inputs_sample:[ID] , addProcess_outputs_sample:[ID], removeProcess_outputs_sample:[ID] , addAssay_materials_samples:[ID], removeAssay_materials_samples:[ID] , addStudy_materials_samples:[ID], removeStudy_materials_samples:[ID]  , skipAssociationsExistenceChecks:Boolean = false): sample!
    deleteSample(id: ID!): String!
    bulkAddSampleCsv: String!
      }
`;
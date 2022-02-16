module.exports = `
  type source{
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
    derived_children_fk: [String]

    """
    @original-field
    
    """
    study_materials_sources_fk: [String]

    """
    @original-field
    
    """
    process_inputs_source_fk: [String]

      
    """
    @search-request
    """
    derived_childrenFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput!): [sample]


    """
    @search-request
    """
    derived_childrenConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput!): SampleConnection

    """
    @count-request
    """
    countFilteredDerived_children(search: searchSampleInput) : Int
  
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
    process_inputs_sourceFilter(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationInput!): [process]


    """
    @search-request
    """
    process_inputs_sourceConnection(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationCursorInput!): ProcessConnection

    """
    @count-request
    """
    countFilteredProcess_inputs_source(search: searchProcessInput) : Int
  
    """
    @search-request
    """
    study_materials_sourcesFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    study_materials_sourcesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudy_materials_sources(search: searchStudyInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type SourceConnection{
  edges: [SourceEdge]
  sources: [source]
  pageInfo: pageInfo!
}

type SourceEdge{
  cursor: String!
  node: source!
}

  enum sourceField {
    id
    name
    characteristics_fk
    derived_children_fk
    study_materials_sources_fk
    process_inputs_source_fk
  }
  
  input searchSourceInput {
    field: sourceField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchSourceInput]
  }

  input orderSourceInput{
    field: sourceField
    order: Order
  }



  type Query {
    sources(search: searchSourceInput, order: [ orderSourceInput ], pagination: paginationInput! ): [source]
    readOneSource(id: ID!): source
    countSources(search: searchSourceInput ): Int
    csvTableTemplateSource: [String]
    sourcesConnection(search:searchSourceInput, order: [ orderSourceInput ], pagination: paginationCursorInput! ): SourceConnection
    validateSourceForCreation(id: ID!, name: String   , addDerived_children:[ID], addCharacteristics:[ID], addComments:[ID], addProcess_inputs_source:[ID], addStudy_materials_sources:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateSourceForUpdating(id: ID!, name: String   , addDerived_children:[ID], removeDerived_children:[ID] , addCharacteristics:[ID], removeCharacteristics:[ID] , addComments:[ID], removeComments:[ID] , addProcess_inputs_source:[ID], removeProcess_inputs_source:[ID] , addStudy_materials_sources:[ID], removeStudy_materials_sources:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateSourceForDeletion(id: ID!): Boolean!
    validateSourceAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addSource(id: ID!, name: String   , addDerived_children:[ID], addCharacteristics:[ID], addComments:[ID], addProcess_inputs_source:[ID], addStudy_materials_sources:[ID] , skipAssociationsExistenceChecks:Boolean = false): source!
    updateSource(id: ID!, name: String   , addDerived_children:[ID], removeDerived_children:[ID] , addCharacteristics:[ID], removeCharacteristics:[ID] , addComments:[ID], removeComments:[ID] , addProcess_inputs_source:[ID], removeProcess_inputs_source:[ID] , addStudy_materials_sources:[ID], removeStudy_materials_sources:[ID]  , skipAssociationsExistenceChecks:Boolean = false): source!
    deleteSource(id: ID!): String!
    bulkAddSourceCsv: String!
      }
`;
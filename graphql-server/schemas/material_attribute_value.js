module.exports = `
  type material_attribute_value{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    category_fk: String

    """
    @original-field
    
    """
    value: String

    """
    @original-field
    
    """
    unit_fk: String

    """
    @original-field
    
    """
    source_characteristics_fk: [String]

    """
    @original-field
    
    """
    material_characteristics_fk: [String]

    """
    @original-field
    
    """
    sample_characteristics_fk: [String]

    category(search: searchMaterial_attributeInput): material_attribute
  unit(search: searchOntology_annotationInput): ontology_annotation
    
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
    material_characteristicsFilter(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput!): [material]


    """
    @search-request
    """
    material_characteristicsConnection(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput!): MaterialConnection

    """
    @count-request
    """
    countFilteredMaterial_characteristics(search: searchMaterialInput) : Int
  
    """
    @search-request
    """
    source_characteristicsFilter(search: searchSourceInput, order: [ orderSourceInput ], pagination: paginationInput!): [source]


    """
    @search-request
    """
    source_characteristicsConnection(search: searchSourceInput, order: [ orderSourceInput ], pagination: paginationCursorInput!): SourceConnection

    """
    @count-request
    """
    countFilteredSource_characteristics(search: searchSourceInput) : Int
  
    """
    @search-request
    """
    sample_characteristicsFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput!): [sample]


    """
    @search-request
    """
    sample_characteristicsConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput!): SampleConnection

    """
    @count-request
    """
    countFilteredSample_characteristics(search: searchSampleInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type Material_attribute_valueConnection{
  edges: [Material_attribute_valueEdge]
  material_attribute_values: [material_attribute_value]
  pageInfo: pageInfo!
}

type Material_attribute_valueEdge{
  cursor: String!
  node: material_attribute_value!
}

  enum material_attribute_valueField {
    id
    category_fk
    value
    unit_fk
    source_characteristics_fk
    material_characteristics_fk
    sample_characteristics_fk
  }
  
  input searchMaterial_attribute_valueInput {
    field: material_attribute_valueField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchMaterial_attribute_valueInput]
  }

  input orderMaterial_attribute_valueInput{
    field: material_attribute_valueField
    order: Order
  }

  input bulkAssociationMaterial_attribute_valueWithCategory_fkInput{
    id: ID!
    category_fk: ID!
  }  input bulkAssociationMaterial_attribute_valueWithUnit_fkInput{
    id: ID!
    unit_fk: ID!
  }

  type Query {
    material_attribute_values(search: searchMaterial_attribute_valueInput, order: [ orderMaterial_attribute_valueInput ], pagination: paginationInput! ): [material_attribute_value]
    readOneMaterial_attribute_value(id: ID!): material_attribute_value
    countMaterial_attribute_values(search: searchMaterial_attribute_valueInput ): Int
    csvTableTemplateMaterial_attribute_value: [String]
    material_attribute_valuesConnection(search:searchMaterial_attribute_valueInput, order: [ orderMaterial_attribute_valueInput ], pagination: paginationCursorInput! ): Material_attribute_valueConnection
    validateMaterial_attribute_valueForCreation(id: ID!, value: String , addCategory:ID, addUnit:ID  , addComments:[ID], addMaterial_characteristics:[ID], addSource_characteristics:[ID], addSample_characteristics:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateMaterial_attribute_valueForUpdating(id: ID!, value: String , addCategory:ID, removeCategory:ID , addUnit:ID, removeUnit:ID   , addComments:[ID], removeComments:[ID] , addMaterial_characteristics:[ID], removeMaterial_characteristics:[ID] , addSource_characteristics:[ID], removeSource_characteristics:[ID] , addSample_characteristics:[ID], removeSample_characteristics:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateMaterial_attribute_valueForDeletion(id: ID!): Boolean!
    validateMaterial_attribute_valueAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addMaterial_attribute_value(id: ID!, value: String , addCategory:ID, addUnit:ID  , addComments:[ID], addMaterial_characteristics:[ID], addSource_characteristics:[ID], addSample_characteristics:[ID] , skipAssociationsExistenceChecks:Boolean = false): material_attribute_value!
    updateMaterial_attribute_value(id: ID!, value: String , addCategory:ID, removeCategory:ID , addUnit:ID, removeUnit:ID   , addComments:[ID], removeComments:[ID] , addMaterial_characteristics:[ID], removeMaterial_characteristics:[ID] , addSource_characteristics:[ID], removeSource_characteristics:[ID] , addSample_characteristics:[ID], removeSample_characteristics:[ID]  , skipAssociationsExistenceChecks:Boolean = false): material_attribute_value!
    deleteMaterial_attribute_value(id: ID!): String!
    bulkAddMaterial_attribute_valueCsv: String!
    bulkAssociateMaterial_attribute_valueWithCategory_fk(bulkAssociationInput: [bulkAssociationMaterial_attribute_valueWithCategory_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateMaterial_attribute_valueWithCategory_fk(bulkAssociationInput: [bulkAssociationMaterial_attribute_valueWithCategory_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateMaterial_attribute_valueWithUnit_fk(bulkAssociationInput: [bulkAssociationMaterial_attribute_valueWithUnit_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateMaterial_attribute_valueWithUnit_fk(bulkAssociationInput: [bulkAssociationMaterial_attribute_valueWithUnit_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
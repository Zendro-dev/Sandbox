module.exports = `
  type material_attribute{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    characteristicType_fk: String

    """
    @original-field
    
    """
    assay_characteristicCategories_fk: [String]

    """
    @original-field
    
    """
    study_characteristicCategories_fk: [String]

    characteristicType(search: searchOntology_annotationInput): ontology_annotation
    
    """
    @search-request
    """
    assay_characteristicCategoriesFilter(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationInput!): [assay]


    """
    @search-request
    """
    assay_characteristicCategoriesConnection(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationCursorInput!): AssayConnection

    """
    @count-request
    """
    countFilteredAssay_characteristicCategories(search: searchAssayInput) : Int
  
    """
    @search-request
    """
    study_characteristicCategoriesFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    study_characteristicCategoriesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudy_characteristicCategories(search: searchStudyInput) : Int
  
    """
    @search-request
    """
    material_attribute_value_categoryFilter(search: searchMaterial_attribute_valueInput, order: [ orderMaterial_attribute_valueInput ], pagination: paginationInput!): [material_attribute_value]


    """
    @search-request
    """
    material_attribute_value_categoryConnection(search: searchMaterial_attribute_valueInput, order: [ orderMaterial_attribute_valueInput ], pagination: paginationCursorInput!): Material_attribute_valueConnection

    """
    @count-request
    """
    countFilteredMaterial_attribute_value_category(search: searchMaterial_attribute_valueInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type Material_attributeConnection{
  edges: [Material_attributeEdge]
  material_attributes: [material_attribute]
  pageInfo: pageInfo!
}

type Material_attributeEdge{
  cursor: String!
  node: material_attribute!
}

  enum material_attributeField {
    id
    characteristicType_fk
    assay_characteristicCategories_fk
    study_characteristicCategories_fk
  }
  
  input searchMaterial_attributeInput {
    field: material_attributeField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchMaterial_attributeInput]
  }

  input orderMaterial_attributeInput{
    field: material_attributeField
    order: Order
  }

  input bulkAssociationMaterial_attributeWithCharacteristicType_fkInput{
    id: ID!
    characteristicType_fk: ID!
  }

  type Query {
    material_attributes(search: searchMaterial_attributeInput, order: [ orderMaterial_attributeInput ], pagination: paginationInput! ): [material_attribute]
    readOneMaterial_attribute(id: ID!): material_attribute
    countMaterial_attributes(search: searchMaterial_attributeInput ): Int
    csvTableTemplateMaterial_attribute: [String]
    material_attributesConnection(search:searchMaterial_attributeInput, order: [ orderMaterial_attributeInput ], pagination: paginationCursorInput! ): Material_attributeConnection
    validateMaterial_attributeForCreation(id: ID!,  , addCharacteristicType:ID  , addAssay_characteristicCategories:[ID], addStudy_characteristicCategories:[ID], addMaterial_attribute_value_category:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateMaterial_attributeForUpdating(id: ID!,  , addCharacteristicType:ID, removeCharacteristicType:ID   , addAssay_characteristicCategories:[ID], removeAssay_characteristicCategories:[ID] , addStudy_characteristicCategories:[ID], removeStudy_characteristicCategories:[ID] , addMaterial_attribute_value_category:[ID], removeMaterial_attribute_value_category:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateMaterial_attributeForDeletion(id: ID!): Boolean!
    validateMaterial_attributeAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addMaterial_attribute(id: ID!,  , addCharacteristicType:ID  , addAssay_characteristicCategories:[ID], addStudy_characteristicCategories:[ID], addMaterial_attribute_value_category:[ID] , skipAssociationsExistenceChecks:Boolean = false): material_attribute!
    updateMaterial_attribute(id: ID!,  , addCharacteristicType:ID, removeCharacteristicType:ID   , addAssay_characteristicCategories:[ID], removeAssay_characteristicCategories:[ID] , addStudy_characteristicCategories:[ID], removeStudy_characteristicCategories:[ID] , addMaterial_attribute_value_category:[ID], removeMaterial_attribute_value_category:[ID]  , skipAssociationsExistenceChecks:Boolean = false): material_attribute!
    deleteMaterial_attribute(id: ID!): String!
    bulkAddMaterial_attributeCsv: String!
    bulkAssociateMaterial_attributeWithCharacteristicType_fk(bulkAssociationInput: [bulkAssociationMaterial_attributeWithCharacteristicType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateMaterial_attributeWithCharacteristicType_fk(bulkAssociationInput: [bulkAssociationMaterial_attributeWithCharacteristicType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
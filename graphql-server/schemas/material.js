module.exports = `
  type material{
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
    type: String

    """
    @original-field
    
    """
    characteristics_fk: [String]

    """
    @original-field
    
    """
    derivesFrom_fk: [String]

    """
    @original-field
    
    """
    derived_children_fk: [String]

    """
    @original-field
    
    """
    assay_materials_otherMaterials_fk: [String]

    """
    @original-field
    
    """
    study_materials_otherMaterials_fk: [String]

    """
    @original-field
    
    """
    process_inputs_material_fk: [String]

    """
    @original-field
    
    """
    process_outputs_material_fk: [String]

      
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
    derivesFromFilter(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput!): [material]


    """
    @search-request
    """
    derivesFromConnection(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput!): MaterialConnection

    """
    @count-request
    """
    countFilteredDerivesFrom(search: searchMaterialInput) : Int
  
    """
    @search-request
    """
    derived_childrenFilter(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput!): [material]


    """
    @search-request
    """
    derived_childrenConnection(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput!): MaterialConnection

    """
    @count-request
    """
    countFilteredDerived_children(search: searchMaterialInput) : Int
  
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
    process_inputs_materialFilter(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationInput!): [process]


    """
    @search-request
    """
    process_inputs_materialConnection(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationCursorInput!): ProcessConnection

    """
    @count-request
    """
    countFilteredProcess_inputs_material(search: searchProcessInput) : Int
  
    """
    @search-request
    """
    process_outputs_materialFilter(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationInput!): [process]


    """
    @search-request
    """
    process_outputs_materialConnection(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationCursorInput!): ProcessConnection

    """
    @count-request
    """
    countFilteredProcess_outputs_material(search: searchProcessInput) : Int
  
    """
    @search-request
    """
    assay_materials_otherMaterialsFilter(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationInput!): [assay]


    """
    @search-request
    """
    assay_materials_otherMaterialsConnection(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationCursorInput!): AssayConnection

    """
    @count-request
    """
    countFilteredAssay_materials_otherMaterials(search: searchAssayInput) : Int
  
    """
    @search-request
    """
    study_materials_otherMaterialsFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    study_materials_otherMaterialsConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudy_materials_otherMaterials(search: searchStudyInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type MaterialConnection{
  edges: [MaterialEdge]
  materials: [material]
  pageInfo: pageInfo!
}

type MaterialEdge{
  cursor: String!
  node: material!
}

  enum materialField {
    id
    name
    type
    characteristics_fk
    derivesFrom_fk
    derived_children_fk
    assay_materials_otherMaterials_fk
    study_materials_otherMaterials_fk
    process_inputs_material_fk
    process_outputs_material_fk
  }
  
  input searchMaterialInput {
    field: materialField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchMaterialInput]
  }

  input orderMaterialInput{
    field: materialField
    order: Order
  }



  type Query {
    materials(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput! ): [material]
    readOneMaterial(id: ID!): material
    countMaterials(search: searchMaterialInput ): Int
    csvTableTemplateMaterial: [String]
    materialsConnection(search:searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput! ): MaterialConnection
    validateMaterialForCreation(id: ID!, name: String, type: String, derivesFrom_fk: [String], derived_children_fk: [String]   , addCharacteristics:[ID], addDerivesFrom:[ID], addDerived_children:[ID], addComments:[ID], addProcess_inputs_material:[ID], addProcess_outputs_material:[ID], addAssay_materials_otherMaterials:[ID], addStudy_materials_otherMaterials:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateMaterialForUpdating(id: ID!, name: String, type: String, derivesFrom_fk: [String], derived_children_fk: [String]   , addCharacteristics:[ID], removeCharacteristics:[ID] , addDerivesFrom:[ID], removeDerivesFrom:[ID] , addDerived_children:[ID], removeDerived_children:[ID] , addComments:[ID], removeComments:[ID] , addProcess_inputs_material:[ID], removeProcess_inputs_material:[ID] , addProcess_outputs_material:[ID], removeProcess_outputs_material:[ID] , addAssay_materials_otherMaterials:[ID], removeAssay_materials_otherMaterials:[ID] , addStudy_materials_otherMaterials:[ID], removeStudy_materials_otherMaterials:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateMaterialForDeletion(id: ID!): Boolean!
    validateMaterialAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addMaterial(id: ID!, name: String, type: String, derivesFrom_fk: [String], derived_children_fk: [String]   , addCharacteristics:[ID], addDerivesFrom:[ID], addDerived_children:[ID], addComments:[ID], addProcess_inputs_material:[ID], addProcess_outputs_material:[ID], addAssay_materials_otherMaterials:[ID], addStudy_materials_otherMaterials:[ID] , skipAssociationsExistenceChecks:Boolean = false): material!
    updateMaterial(id: ID!, name: String, type: String, derivesFrom_fk: [String], derived_children_fk: [String]   , addCharacteristics:[ID], removeCharacteristics:[ID] , addDerivesFrom:[ID], removeDerivesFrom:[ID] , addDerived_children:[ID], removeDerived_children:[ID] , addComments:[ID], removeComments:[ID] , addProcess_inputs_material:[ID], removeProcess_inputs_material:[ID] , addProcess_outputs_material:[ID], removeProcess_outputs_material:[ID] , addAssay_materials_otherMaterials:[ID], removeAssay_materials_otherMaterials:[ID] , addStudy_materials_otherMaterials:[ID], removeStudy_materials_otherMaterials:[ID]  , skipAssociationsExistenceChecks:Boolean = false): material!
    deleteMaterial(id: ID!): String!
    bulkAddMaterialCsv: String!
      }
`;
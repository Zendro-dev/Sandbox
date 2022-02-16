module.exports = `
  type assay{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    filename: String

    """
    @original-field
    
    """
    measurementType_fk: String

    """
    @original-field
    
    """
    technologyType_fk: String

    """
    @original-field
    
    """
    technologyPlatform: String

    """
    @original-field
    
    """
    materials_samples_fk: [String]

    """
    @original-field
    
    """
    materials_otherMaterials_fk: [String]

    """
    @original-field
    
    """
    characteristicCategories_fk: [String]

    """
    @original-field
    
    """
    unitCategories_fk: [String]

    """
    @original-field
    
    """
    study_assays_fk: String

    measurementType(search: searchOntology_annotationInput): ontology_annotation
  technologyType(search: searchOntology_annotationInput): ontology_annotation
  study_assays(search: searchStudyInput): study
    
    """
    @search-request
    """
    materials_otherMaterialsFilter(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput!): [material]


    """
    @search-request
    """
    materials_otherMaterialsConnection(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput!): MaterialConnection

    """
    @count-request
    """
    countFilteredMaterials_otherMaterials(search: searchMaterialInput) : Int
  
    """
    @search-request
    """
    materials_samplesFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput!): [sample]


    """
    @search-request
    """
    materials_samplesConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput!): SampleConnection

    """
    @count-request
    """
    countFilteredMaterials_samples(search: searchSampleInput) : Int
  
    """
    @search-request
    """
    dataFilesFilter(search: searchDataInput, order: [ orderDataInput ], pagination: paginationInput!): [data]


    """
    @search-request
    """
    dataFilesConnection(search: searchDataInput, order: [ orderDataInput ], pagination: paginationCursorInput!): DataConnection

    """
    @count-request
    """
    countFilteredDataFiles(search: searchDataInput) : Int
  
    """
    @search-request
    """
    characteristicCategoriesFilter(search: searchMaterial_attributeInput, order: [ orderMaterial_attributeInput ], pagination: paginationInput!): [material_attribute]


    """
    @search-request
    """
    characteristicCategoriesConnection(search: searchMaterial_attributeInput, order: [ orderMaterial_attributeInput ], pagination: paginationCursorInput!): Material_attributeConnection

    """
    @count-request
    """
    countFilteredCharacteristicCategories(search: searchMaterial_attributeInput) : Int
  
    """
    @search-request
    """
    unitCategoriesFilter(search: searchOntology_annotationInput, order: [ orderOntology_annotationInput ], pagination: paginationInput!): [ontology_annotation]


    """
    @search-request
    """
    unitCategoriesConnection(search: searchOntology_annotationInput, order: [ orderOntology_annotationInput ], pagination: paginationCursorInput!): Ontology_annotationConnection

    """
    @count-request
    """
    countFilteredUnitCategories(search: searchOntology_annotationInput) : Int
  
    """
    @search-request
    """
    processSequenceFilter(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationInput!): [process]


    """
    @search-request
    """
    processSequenceConnection(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationCursorInput!): ProcessConnection

    """
    @count-request
    """
    countFilteredProcessSequence(search: searchProcessInput) : Int
  
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
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type AssayConnection{
  edges: [AssayEdge]
  assays: [assay]
  pageInfo: pageInfo!
}

type AssayEdge{
  cursor: String!
  node: assay!
}

  enum assayField {
    id
    filename
    measurementType_fk
    technologyType_fk
    technologyPlatform
    materials_samples_fk
    materials_otherMaterials_fk
    characteristicCategories_fk
    unitCategories_fk
    study_assays_fk
  }
  
  input searchAssayInput {
    field: assayField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchAssayInput]
  }

  input orderAssayInput{
    field: assayField
    order: Order
  }

  input bulkAssociationAssayWithMeasurementType_fkInput{
    id: ID!
    measurementType_fk: ID!
  }  input bulkAssociationAssayWithTechnologyType_fkInput{
    id: ID!
    technologyType_fk: ID!
  }  input bulkAssociationAssayWithStudy_assays_fkInput{
    id: ID!
    study_assays_fk: ID!
  }

  type Query {
    assays(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationInput! ): [assay]
    readOneAssay(id: ID!): assay
    countAssays(search: searchAssayInput ): Int
    csvTableTemplateAssay: [String]
    assaysConnection(search:searchAssayInput, order: [ orderAssayInput ], pagination: paginationCursorInput! ): AssayConnection
    validateAssayForCreation(id: ID!, filename: String, technologyPlatform: String , addMeasurementType:ID, addTechnologyType:ID, addStudy_assays:ID  , addMaterials_otherMaterials:[ID], addMaterials_samples:[ID], addDataFiles:[ID], addCharacteristicCategories:[ID], addUnitCategories:[ID], addProcessSequence:[ID], addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateAssayForUpdating(id: ID!, filename: String, technologyPlatform: String , addMeasurementType:ID, removeMeasurementType:ID , addTechnologyType:ID, removeTechnologyType:ID , addStudy_assays:ID, removeStudy_assays:ID   , addMaterials_otherMaterials:[ID], removeMaterials_otherMaterials:[ID] , addMaterials_samples:[ID], removeMaterials_samples:[ID] , addDataFiles:[ID], removeDataFiles:[ID] , addCharacteristicCategories:[ID], removeCharacteristicCategories:[ID] , addUnitCategories:[ID], removeUnitCategories:[ID] , addProcessSequence:[ID], removeProcessSequence:[ID] , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateAssayForDeletion(id: ID!): Boolean!
    validateAssayAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addAssay(id: ID!, filename: String, technologyPlatform: String , addMeasurementType:ID, addTechnologyType:ID, addStudy_assays:ID  , addMaterials_otherMaterials:[ID], addMaterials_samples:[ID], addDataFiles:[ID], addCharacteristicCategories:[ID], addUnitCategories:[ID], addProcessSequence:[ID], addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): assay!
    updateAssay(id: ID!, filename: String, technologyPlatform: String , addMeasurementType:ID, removeMeasurementType:ID , addTechnologyType:ID, removeTechnologyType:ID , addStudy_assays:ID, removeStudy_assays:ID   , addMaterials_otherMaterials:[ID], removeMaterials_otherMaterials:[ID] , addMaterials_samples:[ID], removeMaterials_samples:[ID] , addDataFiles:[ID], removeDataFiles:[ID] , addCharacteristicCategories:[ID], removeCharacteristicCategories:[ID] , addUnitCategories:[ID], removeUnitCategories:[ID] , addProcessSequence:[ID], removeProcessSequence:[ID] , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): assay!
    deleteAssay(id: ID!): String!
    bulkAddAssayCsv: String!
    bulkAssociateAssayWithMeasurementType_fk(bulkAssociationInput: [bulkAssociationAssayWithMeasurementType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateAssayWithMeasurementType_fk(bulkAssociationInput: [bulkAssociationAssayWithMeasurementType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateAssayWithTechnologyType_fk(bulkAssociationInput: [bulkAssociationAssayWithTechnologyType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateAssayWithTechnologyType_fk(bulkAssociationInput: [bulkAssociationAssayWithTechnologyType_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateAssayWithStudy_assays_fk(bulkAssociationInput: [bulkAssociationAssayWithStudy_assays_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateAssayWithStudy_assays_fk(bulkAssociationInput: [bulkAssociationAssayWithStudy_assays_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
module.exports = `
  type assayResult{
    """
    @original-field
    """
    assayResult_id: ID
    """
    @original-field
    
    """
    unit: String

    """
    @original-field
    
    """
    value_as_str: String

    """
    @original-field
    
    """
    value_as_int: Int

    """
    @original-field
    
    """
    value_as_bool: Boolean

    """
    @original-field
    
    """
    value_as_float: Float

    """
    @original-field
    
    """
    assay_id: String

    """
    @original-field
    
    """
    material_ids: [String]

    """
    @original-field
    
    """
    ontologyAnnotation_ids: [String]

    """
    @original-field
    
    """
    fileAttachment_ids: [String]

    assay(search: searchAssayInput): assay
    
    """
    @search-request
    """
    materialsFilter(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput!): [material]


    """
    @search-request
    """
    materialsConnection(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput!): MaterialConnection

    """
    @count-request
    """
    countFilteredMaterials(search: searchMaterialInput) : Int
  
    """
    @search-request
    """
    fileAttachmentsFilter(search: searchFileAttachmentInput, order: [ orderFileAttachmentInput ], pagination: paginationInput!): [fileAttachment]


    """
    @search-request
    """
    fileAttachmentsConnection(search: searchFileAttachmentInput, order: [ orderFileAttachmentInput ], pagination: paginationCursorInput!): FileAttachmentConnection

    """
    @count-request
    """
    countFilteredFileAttachments(search: searchFileAttachmentInput) : Int
  
    """
    @search-request
    """
    ontologyAnnotationsFilter(search: searchOntologyAnnotationInput, order: [ orderOntologyAnnotationInput ], pagination: paginationInput!): [ontologyAnnotation]


    """
    @search-request
    """
    ontologyAnnotationsConnection(search: searchOntologyAnnotationInput, order: [ orderOntologyAnnotationInput ], pagination: paginationCursorInput!): OntologyAnnotationConnection

    """
    @count-request
    """
    countFilteredOntologyAnnotations(search: searchOntologyAnnotationInput) : Int
  
    }
type AssayResultConnection{
  edges: [AssayResultEdge]
  assayResults: [assayResult]
  pageInfo: pageInfo!
}

type AssayResultEdge{
  cursor: String!
  node: assayResult!
}

  type VueTableAssayResult{
    data : [assayResult]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum assayResultField {
    assayResult_id
    unit
    value_as_str
    value_as_int
    value_as_bool
    value_as_float
    assay_id
    material_ids
    ontologyAnnotation_ids
    fileAttachment_ids
  }
  
  input searchAssayResultInput {
    field: assayResultField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchAssayResultInput]
  }

  input orderAssayResultInput{
    field: assayResultField
    order: Order
  }

  input bulkAssociationAssayResultWithAssay_idInput{
    assayResult_id: ID!
    assay_id: ID!
  }

  type Query {
    assayResults(search: searchAssayResultInput, order: [ orderAssayResultInput ], pagination: paginationInput! ): [assayResult]
    readOneAssayResult(assayResult_id: ID!): assayResult
    countAssayResults(search: searchAssayResultInput ): Int
    vueTableAssayResult : VueTableAssayResult
    csvTableTemplateAssayResult: [String]
    assayResultsConnection(search:searchAssayResultInput, order: [ orderAssayResultInput ], pagination: paginationCursorInput! ): AssayResultConnection
  }

  type Mutation {
    addAssayResult(assayResult_id: ID!, unit: String, value_as_str: String, value_as_int: Int, value_as_bool: Boolean, value_as_float: Float , addAssay:ID  , addMaterials:[ID], addFileAttachments:[ID], addOntologyAnnotations:[ID] , skipAssociationsExistenceChecks:Boolean = false): assayResult!
    updateAssayResult(assayResult_id: ID!, unit: String, value_as_str: String, value_as_int: Int, value_as_bool: Boolean, value_as_float: Float , addAssay:ID, removeAssay:ID   , addMaterials:[ID], removeMaterials:[ID] , addFileAttachments:[ID], removeFileAttachments:[ID] , addOntologyAnnotations:[ID], removeOntologyAnnotations:[ID]  , skipAssociationsExistenceChecks:Boolean = false): assayResult!
    deleteAssayResult(assayResult_id: ID!): String!
    bulkAddAssayResultCsv: String!
    bulkAssociateAssayResultWithAssay_id(bulkAssociationInput: [bulkAssociationAssayResultWithAssay_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateAssayResultWithAssay_id(bulkAssociationInput: [bulkAssociationAssayResultWithAssay_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
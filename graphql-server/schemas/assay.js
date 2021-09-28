module.exports = `
  type assay{
    """
    @original-field
    """
    assay_id: ID
    """
    @original-field
    
    """
    measurement: String

    """
    @original-field
    
    """
    technology: String

    """
    @original-field
    
    """
    platform: String

    """
    @original-field
    
    """
    method: String

    """
    @original-field
    
    """
    study_id: String

    """
    @original-field
    
    """
    factor_ids: [String]

    """
    @original-field
    
    """
    protocol_ids: [String]

    """
    @original-field
    
    """
    material_ids: [String]

    """
    @original-field
    
    """
    ontologyAnnotation_ids: [String]

    study(search: searchStudyInput): study
    
    """
    @search-request
    """
    factorsFilter(search: searchFactorInput, order: [ orderFactorInput ], pagination: paginationInput!): [factor]


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
    protocolsFilter(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationInput!): [protocol]


    """
    @search-request
    """
    protocolsConnection(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationCursorInput!): ProtocolConnection

    """
    @count-request
    """
    countFilteredProtocols(search: searchProtocolInput) : Int
  
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

  type VueTableAssay{
    data : [assay]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum assayField {
    assay_id
    measurement
    technology
    platform
    method
    study_id
    factor_ids
    protocol_ids
    material_ids
    ontologyAnnotation_ids
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

  input bulkAssociationAssayWithStudy_idInput{
    assay_id: ID!
    study_id: ID!
  }

  type Query {
    assays(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationInput! ): [assay]
    readOneAssay(assay_id: ID!): assay
    countAssays(search: searchAssayInput ): Int
    vueTableAssay : VueTableAssay
    csvTableTemplateAssay: [String]
    assaysConnection(search:searchAssayInput, order: [ orderAssayInput ], pagination: paginationCursorInput! ): AssayConnection
  }

  type Mutation {
    addAssay(assay_id: ID!, measurement: String, technology: String, platform: String, method: String , addStudy:ID  , addFactors:[ID], addMaterials:[ID], addProtocols:[ID], addOntologyAnnotations:[ID], addFileAttachments:[ID] , skipAssociationsExistenceChecks:Boolean = false): assay!
    updateAssay(assay_id: ID!, measurement: String, technology: String, platform: String, method: String , addStudy:ID, removeStudy:ID   , addFactors:[ID], removeFactors:[ID] , addMaterials:[ID], removeMaterials:[ID] , addProtocols:[ID], removeProtocols:[ID] , addOntologyAnnotations:[ID], removeOntologyAnnotations:[ID] , addFileAttachments:[ID], removeFileAttachments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): assay!
    deleteAssay(assay_id: ID!): String!
    bulkAddAssayCsv: String!
    bulkAssociateAssayWithStudy_id(bulkAssociationInput: [bulkAssociationAssayWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateAssayWithStudy_id(bulkAssociationInput: [bulkAssociationAssayWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
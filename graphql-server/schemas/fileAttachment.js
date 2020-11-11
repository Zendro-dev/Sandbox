module.exports = `
  type fileAttachment{
    """
    @original-field
    """
    fileAttachment_id: ID
    """
    @original-field
    
    """
    fileName: String

    """
    @original-field
    
    """
    mimeType: String

    """
    @original-field
    
    """
    fileSizeKb: Int

    """
    @original-field
    
    """
    fileURL: String

    """
    @original-field
    
    """
    isImage: Boolean

    """
    @original-field
    
    """
    smallThumbnailURL: String

    """
    @original-field
    
    """
    bigThumbnailURL: String

    """
    @original-field
    
    """
    investigation_ids: [String]

    """
    @original-field
    
    """
    study_ids: [String]

    """
    @original-field
    
    """
    assay_ids: [String]

    """
    @original-field
    
    """
    assayResult_ids: [String]

    """
    @original-field
    
    """
    factor_ids: [String]

    """
    @original-field
    
    """
    material_ids: [String]

    """
    @original-field
    
    """
    protocol_ids: [String]

      
    """
    @search-request
    """
    investigationsFilter(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationInput!): [investigation]


    """
    @search-request
    """
    investigationsConnection(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationCursorInput!): InvestigationConnection

    """
    @count-request
    """
    countFilteredInvestigations(search: searchInvestigationInput) : Int
  
    """
    @search-request
    """
    studiesFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


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
    assaysFilter(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationInput!): [assay]


    """
    @search-request
    """
    assaysConnection(search: searchAssayInput, order: [ orderAssayInput ], pagination: paginationCursorInput!): AssayConnection

    """
    @count-request
    """
    countFilteredAssays(search: searchAssayInput) : Int
  
    """
    @search-request
    """
    assayResultsFilter(search: searchAssayResultInput, order: [ orderAssayResultInput ], pagination: paginationInput!): [assayResult]


    """
    @search-request
    """
    assayResultsConnection(search: searchAssayResultInput, order: [ orderAssayResultInput ], pagination: paginationCursorInput!): AssayResultConnection

    """
    @count-request
    """
    countFilteredAssayResults(search: searchAssayResultInput) : Int
  
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
  
    }
type FileAttachmentConnection{
  edges: [FileAttachmentEdge]
  pageInfo: pageInfo!
}

type FileAttachmentEdge{
  cursor: String!
  node: fileAttachment!
}

  type VueTableFileAttachment{
    data : [fileAttachment]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum fileAttachmentField {
    fileAttachment_id
    fileName
    mimeType
    fileSizeKb
    fileURL
    isImage
    smallThumbnailURL
    bigThumbnailURL
    investigation_ids
    study_ids
    assay_ids
    assayResult_ids
    factor_ids
    material_ids
    protocol_ids
  }
  input searchFileAttachmentInput {
    field: fileAttachmentField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchFileAttachmentInput]
  }

  input orderFileAttachmentInput{
    field: fileAttachmentField
    order: Order
  }



  type Query {
    fileAttachments(search: searchFileAttachmentInput, order: [ orderFileAttachmentInput ], pagination: paginationInput! ): [fileAttachment]
    readOneFileAttachment(fileAttachment_id: ID!): fileAttachment
    countFileAttachments(search: searchFileAttachmentInput ): Int
    vueTableFileAttachment : VueTableFileAttachment    csvTableTemplateFileAttachment: [String]
    fileAttachmentsConnection(search:searchFileAttachmentInput, order: [ orderFileAttachmentInput ], pagination: paginationCursorInput! ): FileAttachmentConnection
  }

  type Mutation {
    addFileAttachment(fileAttachment_id: ID!, fileName: String, mimeType: String, fileSizeKb: Int, fileURL: String, isImage: Boolean, smallThumbnailURL: String, bigThumbnailURL: String   , addInvestigations:[ID], addStudies:[ID], addAssays:[ID], addAssayResults:[ID], addFactors:[ID], addMaterials:[ID], addProtocols:[ID] , skipAssociationsExistenceChecks:Boolean = false): fileAttachment!
    updateFileAttachment(fileAttachment_id: ID!, fileName: String, mimeType: String, fileSizeKb: Int, fileURL: String, isImage: Boolean, smallThumbnailURL: String, bigThumbnailURL: String   , addInvestigations:[ID], removeInvestigations:[ID] , addStudies:[ID], removeStudies:[ID] , addAssays:[ID], removeAssays:[ID] , addAssayResults:[ID], removeAssayResults:[ID] , addFactors:[ID], removeFactors:[ID] , addMaterials:[ID], removeMaterials:[ID] , addProtocols:[ID], removeProtocols:[ID]  , skipAssociationsExistenceChecks:Boolean = false): fileAttachment!
    deleteFileAttachment(fileAttachment_id: ID!): String!
    bulkAddFileAttachmentCsv: String!
      }
`;
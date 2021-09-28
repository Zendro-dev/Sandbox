module.exports = `
  type fileAttachment{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    fileName: String

    """
    @original-field
    
    """
    fileURL: String

    """
    @original-field
    
    """
    mimeType: String

    """
    @original-field
    
    """
    fileSize: Int

    """
    @original-field
    
    """
    identifierName: String

    """
    @original-field
    
    """
    investigation_id: String

    """
    @original-field
    
    """
    study_id: String

    """
    @original-field
    
    """
    assay_id: String

    """
    @original-field
    
    """
    factor_id: String

    """
    @original-field
    
    """
    material_id: String

    """
    @original-field
    
    """
    protocol_id: String

    urlThumbnail(width: Int!, height: Int!, format:String! ): String!

    investigation(search: searchInvestigationInput): investigation
  study(search: searchStudyInput): study
  assay(search: searchAssayInput): assay
  factor(search: searchFactorInput): factor
  material(search: searchMaterialInput): material
  protocol(search: searchProtocolInput): protocol
    
    }
type FileAttachmentConnection{
  edges: [FileAttachmentEdge]
  fileAttachments: [fileAttachment]
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
    id
    fileName
    fileURL
    mimeType
    fileSize
    identifierName
    investigation_id
    study_id
    assay_id
    factor_id
    material_id
    protocol_id
  }
  
  input searchFileAttachmentInput {
    field: fileAttachmentField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchFileAttachmentInput]
  }

  input orderFileAttachmentInput{
    field: fileAttachmentField
    order: Order
  }

  input bulkAssociationFileAttachmentWithInvestigation_idInput{
    id: ID!
    investigation_id: ID!
  }  input bulkAssociationFileAttachmentWithStudy_idInput{
    id: ID!
    study_id: ID!
  }  input bulkAssociationFileAttachmentWithAssay_idInput{
    id: ID!
    assay_id: ID!
  }  input bulkAssociationFileAttachmentWithFactor_idInput{
    id: ID!
    factor_id: ID!
  }  input bulkAssociationFileAttachmentWithMaterial_idInput{
    id: ID!
    material_id: ID!
  }  input bulkAssociationFileAttachmentWithProtocol_idInput{
    id: ID!
    protocol_id: ID!
  }

  type Query {
    fileAttachments(search: searchFileAttachmentInput, order: [ orderFileAttachmentInput ], pagination: paginationInput! ): [fileAttachment]
    readOneFileAttachment(id: ID!): fileAttachment
    countFileAttachments(search: searchFileAttachmentInput ): Int
    vueTableFileAttachment : VueTableFileAttachment
    csvTableTemplateFileAttachment: [String]
    fileAttachmentsConnection(search:searchFileAttachmentInput, order: [ orderFileAttachmentInput ], pagination: paginationCursorInput! ): FileAttachmentConnection
  }

  type Mutation {
    uploadFileAttachment(file: Upload): fileAttachment
    addFileAttachment( file: Upload identifierName: String , addInvestigation:ID, addStudy:ID, addAssay:ID, addFactor:ID, addMaterial:ID, addProtocol:ID   , skipAssociationsExistenceChecks:Boolean = false): fileAttachment!
    updateFileAttachment(file: Upload id: ID!, identifierName: String , addInvestigation:ID, removeInvestigation:ID , addStudy:ID, removeStudy:ID , addAssay:ID, removeAssay:ID , addFactor:ID, removeFactor:ID , addMaterial:ID, removeMaterial:ID , addProtocol:ID, removeProtocol:ID    , skipAssociationsExistenceChecks:Boolean = false): fileAttachment!
    deleteFileAttachment(id: ID!): String!
    bulkAddFileAttachmentCsv: String!
    bulkAssociateFileAttachmentWithInvestigation_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithInvestigation_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateFileAttachmentWithInvestigation_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithInvestigation_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateFileAttachmentWithStudy_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateFileAttachmentWithStudy_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithStudy_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateFileAttachmentWithAssay_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithAssay_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateFileAttachmentWithAssay_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithAssay_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateFileAttachmentWithFactor_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithFactor_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateFileAttachmentWithFactor_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithFactor_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateFileAttachmentWithMaterial_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithMaterial_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateFileAttachmentWithMaterial_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithMaterial_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateFileAttachmentWithProtocol_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithProtocol_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateFileAttachmentWithProtocol_id(bulkAssociationInput: [bulkAssociationFileAttachmentWithProtocol_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
module.exports = `
  type FileAttachment{
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
    fileSizeKb: String

    """
    @original-field
    
    """
    fileType: String

    """
    @original-field
    
    """
    filePath: String

    """
    @original-field
    
    """
    smallTnPath: String

    """
    @original-field
    
    """
    mediumTnPath: String

    """
    @original-field
    
    """
    fileUrl: String

    """
    @original-field
    
    """
    smallTnUrl: String

    """
    @original-field
    
    """
    mediumTnUrl: String

    """
    @original-field
    
    """
    licence: String

    """
    @original-field
    
    """
    description: String

      
    }
type FileAttachmentConnection{
  edges: [FileAttachmentEdge]
  pageInfo: pageInfo!
}

type FileAttachmentEdge{
  cursor: String!
  node: FileAttachment!
}

  type VueTableFileAttachment{
    data : [FileAttachment]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum FileAttachmentField {
    id
    fileName
    fileSizeKb
    fileType
    filePath
    smallTnPath
    mediumTnPath
    licence
    description
  }
  input searchFileAttachmentInput {
    field: FileAttachmentField
    value: typeValue
    operator: Operator
    search: [searchFileAttachmentInput]
  }

  input orderFileAttachmentInput{
    field: FileAttachmentField
    order: Order
  }



  type Query {
    fileAttachments(search: searchFileAttachmentInput, order: [ orderFileAttachmentInput ], pagination: paginationInput ): [FileAttachment]
    readOneFileAttachment(id: ID!): FileAttachment
    countFileAttachments(search: searchFileAttachmentInput ): Int
    vueTableFileAttachment : VueTableFileAttachment    csvTableTemplateFileAttachment: [String]
    fileAttachmentsConnection(search:searchFileAttachmentInput, order: [ orderFileAttachmentInput ], pagination: paginationCursorInput ): FileAttachmentConnection
  }

  type Mutation {
    addFileAttachment( fileName: String, fileSizeKb: String, fileType: String, filePath: String, smallTnPath: String, mediumTnPath: String, licence: String, description: String    , skipAssociationsExistenceChecks:Boolean = false): FileAttachment!
    updateFileAttachment(id: ID!, fileName: String, fileSizeKb: String, fileType: String, filePath: String, smallTnPath: String, mediumTnPath: String, licence: String, description: String    , skipAssociationsExistenceChecks:Boolean = false): FileAttachment!
    deleteFileAttachment(id: ID!): String!
    bulkAddFileAttachmentCsv: String!
      }
`;
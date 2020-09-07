module.exports = `
  type ImageAttachment{
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
    fileSizeKb: Float

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
type ImageAttachmentConnection{
  edges: [ImageAttachmentEdge]
  pageInfo: pageInfo!
}

type ImageAttachmentEdge{
  cursor: String!
  node: ImageAttachment!
}

  type VueTableImageAttachment{
    data : [ImageAttachment]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum ImageAttachmentField {
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
  input searchImageAttachmentInput {
    field: ImageAttachmentField
    value: typeValue
    operator: Operator
    search: [searchImageAttachmentInput]
  }

  input orderImageAttachmentInput{
    field: ImageAttachmentField
    order: Order
  }



  type Query {
    imageAttachments(search: searchImageAttachmentInput, order: [ orderImageAttachmentInput ], pagination: paginationInput ): [ImageAttachment]
    readOneImageAttachment(id: ID!): ImageAttachment
    countImageAttachments(search: searchImageAttachmentInput ): Int
    vueTableImageAttachment : VueTableImageAttachment    csvTableTemplateImageAttachment: [String]
    imageAttachmentsConnection(search:searchImageAttachmentInput, order: [ orderImageAttachmentInput ], pagination: paginationCursorInput ): ImageAttachmentConnection
  }

  type Mutation {
    addImageAttachment( fileName: String, fileSizeKb: Float, fileType: String, filePath: String, smallTnPath: String, mediumTnPath: String, licence: String, description: String    , skipAssociationsExistenceChecks:Boolean = false): ImageAttachment!
    updateImageAttachment(id: ID!, fileName: String, fileSizeKb: Float, fileType: String, filePath: String, smallTnPath: String, mediumTnPath: String, licence: String, description: String    , skipAssociationsExistenceChecks:Boolean = false): ImageAttachment!
    deleteImageAttachment(id: ID!): String!
    bulkAddImageAttachmentCsv: String!
      }
`;
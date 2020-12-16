module.exports = `
  type image{
    """
    @original-field
    """
    imageDbId: ID
    """
    @original-field
    
    """
    copyright: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    imageFileName: String

    """
    @original-field
    
    """
    imageFileSize: Int

    """
    @original-field
    
    """
    imageHeight: Int

    """
    @original-field
    
    """
    imageName: String

    """
    @original-field
    
    """
    imageTimeStamp: DateTime

    """
    @original-field
    
    """
    imageURL: String

    """
    @original-field
    
    """
    imageWidth: Int

    """
    @original-field
    
    """
    mimeType: String

    """
    @original-field
    
    """
    observationUnitDbId: String

    observationUnit(search: searchObservationUnitInput): observationUnit
    
    """
    @search-request
    """
    observationsFilter(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationInput!): [observation]


    """
    @search-request
    """
    observationsConnection(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationCursorInput!): ObservationConnection

    """
    @count-request
    """
    countFilteredObservations(search: searchObservationInput) : Int
  
    }
type ImageConnection{
  edges: [ImageEdge]
  pageInfo: pageInfo!
}

type ImageEdge{
  cursor: String!
  node: image!
}

  type VueTableImage{
    data : [image]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum imageField {
    imageDbId
    copyright
    description
    imageFileName
    imageFileSize
    imageHeight
    imageName
    imageTimeStamp
    imageURL
    imageWidth
    mimeType
    observationUnitDbId
  }
  input searchImageInput {
    field: imageField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchImageInput]
  }

  input orderImageInput{
    field: imageField
    order: Order
  }

  input bulkAssociationImageWithObservationUnitDbIdInput{
    imageDbId: ID!
    observationUnitDbId: ID!
  }

  type Query {
    images(search: searchImageInput, order: [ orderImageInput ], pagination: paginationInput! ): [image]
    readOneImage(imageDbId: ID!): image
    countImages(search: searchImageInput ): Int
    vueTableImage : VueTableImage    csvTableTemplateImage: [String]
    imagesConnection(search:searchImageInput, order: [ orderImageInput ], pagination: paginationCursorInput! ): ImageConnection
  }

  type Mutation {
    addImage(imageDbId: ID!, copyright: String, description: String, imageFileName: String, imageFileSize: Int, imageHeight: Int, imageName: String, imageTimeStamp: DateTime, imageURL: String, imageWidth: Int, mimeType: String , addObservationUnit:ID  , addObservations:[ID] , skipAssociationsExistenceChecks:Boolean = false): image!
    updateImage(imageDbId: ID!, copyright: String, description: String, imageFileName: String, imageFileSize: Int, imageHeight: Int, imageName: String, imageTimeStamp: DateTime, imageURL: String, imageWidth: Int, mimeType: String , addObservationUnit:ID, removeObservationUnit:ID   , addObservations:[ID], removeObservations:[ID]  , skipAssociationsExistenceChecks:Boolean = false): image!
    deleteImage(imageDbId: ID!): String!
    bulkAddImageCsv: String!
    bulkAssociateImageWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationImageWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateImageWithObservationUnitDbId(bulkAssociationInput: [bulkAssociationImageWithObservationUnitDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
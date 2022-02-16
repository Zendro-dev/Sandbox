module.exports = `
  type data{
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
    fileName: String

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
    fileURL: String

    """
    @original-field
    
    """
    assay_dataFiles_fk: String

    """
    @original-field
    
    """
    process_inputs_data_fk: [String]

    """
    @original-field
    
    """
    process_outputs_data_fk: [String]

    assay_dataFiles(search: searchAssayInput): assay
    
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
    process_inputs_dataFilter(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationInput!): [process]


    """
    @search-request
    """
    process_inputs_dataConnection(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationCursorInput!): ProcessConnection

    """
    @count-request
    """
    countFilteredProcess_inputs_data(search: searchProcessInput) : Int
  
    """
    @search-request
    """
    process_outputs_dataFilter(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationInput!): [process]


    """
    @search-request
    """
    process_outputs_dataConnection(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationCursorInput!): ProcessConnection

    """
    @count-request
    """
    countFilteredProcess_outputs_data(search: searchProcessInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type DataConnection{
  edges: [DataEdge]
  data: [data]
  pageInfo: pageInfo!
}

type DataEdge{
  cursor: String!
  node: data!
}

  enum dataField {
    id
    name
    type
    fileName
    mimeType
    fileSize
    fileURL
    assay_dataFiles_fk
    process_inputs_data_fk
    process_outputs_data_fk
  }
  
  input searchDataInput {
    field: dataField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchDataInput]
  }

  input orderDataInput{
    field: dataField
    order: Order
  }

  input bulkAssociationDataWithAssay_dataFiles_fkInput{
    id: ID!
    assay_dataFiles_fk: ID!
  }

  type Query {
    data(search: searchDataInput, order: [ orderDataInput ], pagination: paginationInput! ): [data]
    readOneData(id: ID!): data
    countData(search: searchDataInput ): Int
    csvTableTemplateData: [String]
    dataConnection(search:searchDataInput, order: [ orderDataInput ], pagination: paginationCursorInput! ): DataConnection
    validateDataForCreation(id: ID!, name: String, type: String, fileName: String, mimeType: String, fileSize: Int, fileURL: String , addAssay_dataFiles:ID  , addComments:[ID], addProcess_inputs_data:[ID], addProcess_outputs_data:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateDataForUpdating(id: ID!, name: String, type: String, fileName: String, mimeType: String, fileSize: Int, fileURL: String , addAssay_dataFiles:ID, removeAssay_dataFiles:ID   , addComments:[ID], removeComments:[ID] , addProcess_inputs_data:[ID], removeProcess_inputs_data:[ID] , addProcess_outputs_data:[ID], removeProcess_outputs_data:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateDataForDeletion(id: ID!): Boolean!
    validateDataAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addData(id: ID!, name: String, type: String, fileName: String, mimeType: String, fileSize: Int, fileURL: String , addAssay_dataFiles:ID  , addComments:[ID], addProcess_inputs_data:[ID], addProcess_outputs_data:[ID] , skipAssociationsExistenceChecks:Boolean = false): data!
    updateData(id: ID!, name: String, type: String, fileName: String, mimeType: String, fileSize: Int, fileURL: String , addAssay_dataFiles:ID, removeAssay_dataFiles:ID   , addComments:[ID], removeComments:[ID] , addProcess_inputs_data:[ID], removeProcess_inputs_data:[ID] , addProcess_outputs_data:[ID], removeProcess_outputs_data:[ID]  , skipAssociationsExistenceChecks:Boolean = false): data!
    deleteData(id: ID!): String!
    bulkAddDataCsv: String!
    bulkAssociateDataWithAssay_dataFiles_fk(bulkAssociationInput: [bulkAssociationDataWithAssay_dataFiles_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateDataWithAssay_dataFiles_fk(bulkAssociationInput: [bulkAssociationDataWithAssay_dataFiles_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
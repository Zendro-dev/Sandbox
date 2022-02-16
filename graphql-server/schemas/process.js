module.exports = `
  type process{
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
    executesProtocol_fk: String

    """
    @original-field
    
    """
    performer: String

    """
    @original-field
    
    """
    date: DateTime

    """
    @original-field
    
    """
    previousProcess_fk: String

    """
    @original-field
    
    """
    nextProcess_fk: String

    """
    @original-field
    
    """
    inputs_source_fk: [String]

    """
    @original-field
    
    """
    inputs_sample_fk: [String]

    """
    @original-field
    
    """
    inputs_data_fk: [String]

    """
    @original-field
    
    """
    inputs_material_fk: [String]

    """
    @original-field
    
    """
    outputs_sample_fk: [String]

    """
    @original-field
    
    """
    outputs_data_fk: [String]

    """
    @original-field
    
    """
    outputs_material_fk: [String]

    """
    @original-field
    
    """
    study_processSequence_fk: String

    """
    @original-field
    
    """
    assay_processSequence_fk: String

    executesProtocol(search: searchProtocolInput): protocol
  previousProcess(search: searchProcessInput): process
  nextProcess(search: searchProcessInput): process
  assay_processSequence(search: searchAssayInput): assay
  study_processSequence(search: searchStudyInput): study
    
    """
    @search-request
    """
    parameterValuesFilter(search: searchProcess_parameter_valueInput, order: [ orderProcess_parameter_valueInput ], pagination: paginationInput!): [process_parameter_value]


    """
    @search-request
    """
    parameterValuesConnection(search: searchProcess_parameter_valueInput, order: [ orderProcess_parameter_valueInput ], pagination: paginationCursorInput!): Process_parameter_valueConnection

    """
    @count-request
    """
    countFilteredParameterValues(search: searchProcess_parameter_valueInput) : Int
  
    """
    @search-request
    """
    inputs_sourceFilter(search: searchSourceInput, order: [ orderSourceInput ], pagination: paginationInput!): [source]


    """
    @search-request
    """
    inputs_sourceConnection(search: searchSourceInput, order: [ orderSourceInput ], pagination: paginationCursorInput!): SourceConnection

    """
    @count-request
    """
    countFilteredInputs_source(search: searchSourceInput) : Int
  
    """
    @search-request
    """
    inputs_sampleFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput!): [sample]


    """
    @search-request
    """
    inputs_sampleConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput!): SampleConnection

    """
    @count-request
    """
    countFilteredInputs_sample(search: searchSampleInput) : Int
  
    """
    @search-request
    """
    inputs_dataFilter(search: searchDataInput, order: [ orderDataInput ], pagination: paginationInput!): [data]


    """
    @search-request
    """
    inputs_dataConnection(search: searchDataInput, order: [ orderDataInput ], pagination: paginationCursorInput!): DataConnection

    """
    @count-request
    """
    countFilteredInputs_data(search: searchDataInput) : Int
  
    """
    @search-request
    """
    inputs_materialFilter(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput!): [material]


    """
    @search-request
    """
    inputs_materialConnection(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput!): MaterialConnection

    """
    @count-request
    """
    countFilteredInputs_material(search: searchMaterialInput) : Int
  
    """
    @search-request
    """
    outputs_sampleFilter(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationInput!): [sample]


    """
    @search-request
    """
    outputs_sampleConnection(search: searchSampleInput, order: [ orderSampleInput ], pagination: paginationCursorInput!): SampleConnection

    """
    @count-request
    """
    countFilteredOutputs_sample(search: searchSampleInput) : Int
  
    """
    @search-request
    """
    outputs_dataFilter(search: searchDataInput, order: [ orderDataInput ], pagination: paginationInput!): [data]


    """
    @search-request
    """
    outputs_dataConnection(search: searchDataInput, order: [ orderDataInput ], pagination: paginationCursorInput!): DataConnection

    """
    @count-request
    """
    countFilteredOutputs_data(search: searchDataInput) : Int
  
    """
    @search-request
    """
    outputs_materialFilter(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationInput!): [material]


    """
    @search-request
    """
    outputs_materialConnection(search: searchMaterialInput, order: [ orderMaterialInput ], pagination: paginationCursorInput!): MaterialConnection

    """
    @count-request
    """
    countFilteredOutputs_material(search: searchMaterialInput) : Int
  
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
type ProcessConnection{
  edges: [ProcessEdge]
  processes: [process]
  pageInfo: pageInfo!
}

type ProcessEdge{
  cursor: String!
  node: process!
}

  enum processField {
    id
    name
    executesProtocol_fk
    performer
    date
    previousProcess_fk
    nextProcess_fk
    inputs_source_fk
    inputs_sample_fk
    inputs_data_fk
    inputs_material_fk
    outputs_sample_fk
    outputs_data_fk
    outputs_material_fk
    study_processSequence_fk
    assay_processSequence_fk
  }
  
  input searchProcessInput {
    field: processField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchProcessInput]
  }

  input orderProcessInput{
    field: processField
    order: Order
  }

  input bulkAssociationProcessWithExecutesProtocol_fkInput{
    id: ID!
    executesProtocol_fk: ID!
  }  input bulkAssociationProcessWithPreviousProcess_fkInput{
    id: ID!
    previousProcess_fk: ID!
  }  input bulkAssociationProcessWithNextProcess_fkInput{
    id: ID!
    nextProcess_fk: ID!
  }  input bulkAssociationProcessWithAssay_processSequence_fkInput{
    id: ID!
    assay_processSequence_fk: ID!
  }  input bulkAssociationProcessWithStudy_processSequence_fkInput{
    id: ID!
    study_processSequence_fk: ID!
  }

  type Query {
    processes(search: searchProcessInput, order: [ orderProcessInput ], pagination: paginationInput! ): [process]
    readOneProcess(id: ID!): process
    countProcesses(search: searchProcessInput ): Int
    csvTableTemplateProcess: [String]
    processesConnection(search:searchProcessInput, order: [ orderProcessInput ], pagination: paginationCursorInput! ): ProcessConnection
    validateProcessForCreation(id: ID!, name: String, performer: String, date: DateTime, previousProcess_fk: String, nextProcess_fk: String , addExecutesProtocol:ID, addPreviousProcess:ID, addNextProcess:ID, addAssay_processSequence:ID, addStudy_processSequence:ID  , addParameterValues:[ID], addInputs_source:[ID], addInputs_sample:[ID], addInputs_data:[ID], addInputs_material:[ID], addOutputs_sample:[ID], addOutputs_data:[ID], addOutputs_material:[ID], addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateProcessForUpdating(id: ID!, name: String, performer: String, date: DateTime, previousProcess_fk: String, nextProcess_fk: String , addExecutesProtocol:ID, removeExecutesProtocol:ID , addPreviousProcess:ID, removePreviousProcess:ID , addNextProcess:ID, removeNextProcess:ID , addAssay_processSequence:ID, removeAssay_processSequence:ID , addStudy_processSequence:ID, removeStudy_processSequence:ID   , addParameterValues:[ID], removeParameterValues:[ID] , addInputs_source:[ID], removeInputs_source:[ID] , addInputs_sample:[ID], removeInputs_sample:[ID] , addInputs_data:[ID], removeInputs_data:[ID] , addInputs_material:[ID], removeInputs_material:[ID] , addOutputs_sample:[ID], removeOutputs_sample:[ID] , addOutputs_data:[ID], removeOutputs_data:[ID] , addOutputs_material:[ID], removeOutputs_material:[ID] , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateProcessForDeletion(id: ID!): Boolean!
    validateProcessAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addProcess(id: ID!, name: String, performer: String, date: DateTime, previousProcess_fk: String, nextProcess_fk: String , addExecutesProtocol:ID, addPreviousProcess:ID, addNextProcess:ID, addAssay_processSequence:ID, addStudy_processSequence:ID  , addParameterValues:[ID], addInputs_source:[ID], addInputs_sample:[ID], addInputs_data:[ID], addInputs_material:[ID], addOutputs_sample:[ID], addOutputs_data:[ID], addOutputs_material:[ID], addComments:[ID] , skipAssociationsExistenceChecks:Boolean = false): process!
    updateProcess(id: ID!, name: String, performer: String, date: DateTime, previousProcess_fk: String, nextProcess_fk: String , addExecutesProtocol:ID, removeExecutesProtocol:ID , addPreviousProcess:ID, removePreviousProcess:ID , addNextProcess:ID, removeNextProcess:ID , addAssay_processSequence:ID, removeAssay_processSequence:ID , addStudy_processSequence:ID, removeStudy_processSequence:ID   , addParameterValues:[ID], removeParameterValues:[ID] , addInputs_source:[ID], removeInputs_source:[ID] , addInputs_sample:[ID], removeInputs_sample:[ID] , addInputs_data:[ID], removeInputs_data:[ID] , addInputs_material:[ID], removeInputs_material:[ID] , addOutputs_sample:[ID], removeOutputs_sample:[ID] , addOutputs_data:[ID], removeOutputs_data:[ID] , addOutputs_material:[ID], removeOutputs_material:[ID] , addComments:[ID], removeComments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): process!
    deleteProcess(id: ID!): String!
    bulkAddProcessCsv: String!
    bulkAssociateProcessWithExecutesProtocol_fk(bulkAssociationInput: [bulkAssociationProcessWithExecutesProtocol_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateProcessWithExecutesProtocol_fk(bulkAssociationInput: [bulkAssociationProcessWithExecutesProtocol_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateProcessWithPreviousProcess_fk(bulkAssociationInput: [bulkAssociationProcessWithPreviousProcess_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateProcessWithPreviousProcess_fk(bulkAssociationInput: [bulkAssociationProcessWithPreviousProcess_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateProcessWithNextProcess_fk(bulkAssociationInput: [bulkAssociationProcessWithNextProcess_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateProcessWithNextProcess_fk(bulkAssociationInput: [bulkAssociationProcessWithNextProcess_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateProcessWithAssay_processSequence_fk(bulkAssociationInput: [bulkAssociationProcessWithAssay_processSequence_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateProcessWithAssay_processSequence_fk(bulkAssociationInput: [bulkAssociationProcessWithAssay_processSequence_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateProcessWithStudy_processSequence_fk(bulkAssociationInput: [bulkAssociationProcessWithStudy_processSequence_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateProcessWithStudy_processSequence_fk(bulkAssociationInput: [bulkAssociationProcessWithStudy_processSequence_fkInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
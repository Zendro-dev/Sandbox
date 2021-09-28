module.exports = `
  type protocol{
    """
    @original-field
    """
    protocol_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    type: Date

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
    ontologyAnnotation_ids: [String]

      
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
    ontologyAnnotationFilter(search: searchOntologyAnnotationInput, order: [ orderOntologyAnnotationInput ], pagination: paginationInput!): [ontologyAnnotation]


    """
    @search-request
    """
    ontologyAnnotationConnection(search: searchOntologyAnnotationInput, order: [ orderOntologyAnnotationInput ], pagination: paginationCursorInput!): OntologyAnnotationConnection

    """
    @count-request
    """
    countFilteredOntologyAnnotation(search: searchOntologyAnnotationInput) : Int
  
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
type ProtocolConnection{
  edges: [ProtocolEdge]
  protocols: [protocol]
  pageInfo: pageInfo!
}

type ProtocolEdge{
  cursor: String!
  node: protocol!
}

  type VueTableProtocol{
    data : [protocol]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum protocolField {
    protocol_id
    name
    description
    type
    study_ids
    assay_ids
    ontologyAnnotation_ids
  }
  
  input searchProtocolInput {
    field: protocolField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchProtocolInput]
  }

  input orderProtocolInput{
    field: protocolField
    order: Order
  }



  type Query {
    protocols(search: searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationInput! ): [protocol]
    readOneProtocol(protocol_id: ID!): protocol
    countProtocols(search: searchProtocolInput ): Int
    vueTableProtocol : VueTableProtocol
    csvTableTemplateProtocol: [String]
    protocolsConnection(search:searchProtocolInput, order: [ orderProtocolInput ], pagination: paginationCursorInput! ): ProtocolConnection
  }

  type Mutation {
    addProtocol(protocol_id: ID!, name: String, description: String, type: Date   , addStudies:[ID], addAssays:[ID], addOntologyAnnotation:[ID], addFileAttachments:[ID] , skipAssociationsExistenceChecks:Boolean = false): protocol!
    updateProtocol(protocol_id: ID!, name: String, description: String, type: Date   , addStudies:[ID], removeStudies:[ID] , addAssays:[ID], removeAssays:[ID] , addOntologyAnnotation:[ID], removeOntologyAnnotation:[ID] , addFileAttachments:[ID], removeFileAttachments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): protocol!
    deleteProtocol(protocol_id: ID!): String!
    bulkAddProtocolCsv: String!
      }
`;
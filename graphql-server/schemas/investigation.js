module.exports = `
  type investigation{
    """
    @original-field
    """
    investigation_id: ID
    """
    @original-field
    
    """
    title: String

    """
    @original-field
    
    """
    description: String

    """
    @original-field
    
    """
    startDate: Date

    """
    @original-field
    
    """
    endDate: Date

    """
    @original-field
    
    """
    ontologyAnnotation_ids: [String]

    """
    @original-field
    
    """
    contact_ids: [String]

    """
    @original-field
    
    """
    fileAttachment_ids: [String]

      
    """
    @search-request
    """
    contactsFilter(search: searchContactInput, order: [ orderContactInput ], pagination: paginationInput!): [contact]


    """
    @search-request
    """
    contactsConnection(search: searchContactInput, order: [ orderContactInput ], pagination: paginationCursorInput!): ContactConnection

    """
    @count-request
    """
    countFilteredContacts(search: searchContactInput) : Int
  
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
type InvestigationConnection{
  edges: [InvestigationEdge]
  pageInfo: pageInfo!
}

type InvestigationEdge{
  cursor: String!
  node: investigation!
}

  type VueTableInvestigation{
    data : [investigation]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum investigationField {
    investigation_id
    title
    description
    startDate
    endDate
    ontologyAnnotation_ids
    contact_ids
    fileAttachment_ids
  }
  input searchInvestigationInput {
    field: investigationField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchInvestigationInput]
  }

  input orderInvestigationInput{
    field: investigationField
    order: Order
  }



  type Query {
    investigations(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationInput! ): [investigation]
    readOneInvestigation(investigation_id: ID!): investigation
    countInvestigations(search: searchInvestigationInput ): Int
    vueTableInvestigation : VueTableInvestigation    csvTableTemplateInvestigation: [String]
    investigationsConnection(search:searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationCursorInput! ): InvestigationConnection
  }

  type Mutation {
    addInvestigation(investigation_id: ID!, title: String, description: String, startDate: Date, endDate: Date   , addContacts:[ID], addStudies:[ID], addOntologyAnnotations:[ID], addFileAttachments:[ID] , skipAssociationsExistenceChecks:Boolean = false): investigation!
    updateInvestigation(investigation_id: ID!, title: String, description: String, startDate: Date, endDate: Date   , addContacts:[ID], removeContacts:[ID] , addStudies:[ID], removeStudies:[ID] , addOntologyAnnotations:[ID], removeOntologyAnnotations:[ID] , addFileAttachments:[ID], removeFileAttachments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): investigation!
    deleteInvestigation(investigation_id: ID!): String!
    bulkAddInvestigationCsv: String!
      }
`;
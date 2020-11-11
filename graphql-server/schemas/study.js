module.exports = `
  type study{
    """
    @original-field
    """
    study_id: ID
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
    startDate: Date

    """
    @original-field
    
    """
    endDate: Date

    """
    @original-field
    
    """
    investigation_id: String

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
    contact_ids: [String]

    """
    @original-field
    
    """
    material_ids: [String]

    """
    @original-field
    
    """
    ontologyAnnotation_ids: [String]

    """
    @original-field
    
    """
    fileAttachment_ids: [String]

    investigation(search: searchInvestigationInput): investigation
    
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
type StudyConnection{
  edges: [StudyEdge]
  pageInfo: pageInfo!
}

type StudyEdge{
  cursor: String!
  node: study!
}

  type VueTableStudy{
    data : [study]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum studyField {
    study_id
    name
    description
    startDate
    endDate
    investigation_id
    factor_ids
    protocol_ids
    contact_ids
    material_ids
    ontologyAnnotation_ids
    fileAttachment_ids
  }
  input searchStudyInput {
    field: studyField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchStudyInput]
  }

  input orderStudyInput{
    field: studyField
    order: Order
  }

  input bulkAssociationStudyWithInvestigation_idInput{
    study_id: ID!
    investigation_id: ID!
  }

  type Query {
    studies(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput! ): [study]
    readOneStudy(study_id: ID!): study
    countStudies(search: searchStudyInput ): Int
    vueTableStudy : VueTableStudy    csvTableTemplateStudy: [String]
    studiesConnection(search:searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput! ): StudyConnection
  }

  type Mutation {
    addStudy(study_id: ID!, name: String, description: String, startDate: Date, endDate: Date , addInvestigation:ID  , addAssays:[ID], addFactors:[ID], addProtocols:[ID], addContacts:[ID], addMaterials:[ID], addOntologyAnnotations:[ID], addFileAttachments:[ID] , skipAssociationsExistenceChecks:Boolean = false): study!
    updateStudy(study_id: ID!, name: String, description: String, startDate: Date, endDate: Date , addInvestigation:ID, removeInvestigation:ID   , addAssays:[ID], removeAssays:[ID] , addFactors:[ID], removeFactors:[ID] , addProtocols:[ID], removeProtocols:[ID] , addContacts:[ID], removeContacts:[ID] , addMaterials:[ID], removeMaterials:[ID] , addOntologyAnnotations:[ID], removeOntologyAnnotations:[ID] , addFileAttachments:[ID], removeFileAttachments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): study!
    deleteStudy(study_id: ID!): String!
    bulkAddStudyCsv: String!
    bulkAssociateStudyWithInvestigation_id(bulkAssociationInput: [bulkAssociationStudyWithInvestigation_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateStudyWithInvestigation_id(bulkAssociationInput: [bulkAssociationStudyWithInvestigation_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
module.exports = `
  type factor{
    """
    @original-field
    """
    factor_id: ID
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
    type: String

    """
    @original-field
    
    """
    assay_ids: [String]

    """
    @original-field
    
    """
    study_ids: [String]

    """
    @original-field
    
    """
    ontologyAnnotation_ids: [String]

      
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
type FactorConnection{
  edges: [FactorEdge]
  factors: [factor]
  pageInfo: pageInfo!
}

type FactorEdge{
  cursor: String!
  node: factor!
}

  type VueTableFactor{
    data : [factor]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum factorField {
    factor_id
    name
    description
    type
    assay_ids
    study_ids
    ontologyAnnotation_ids
  }
  
  input searchFactorInput {
    field: factorField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchFactorInput]
  }

  input orderFactorInput{
    field: factorField
    order: Order
  }



  type Query {
    factors(search: searchFactorInput, order: [ orderFactorInput ], pagination: paginationInput! ): [factor]
    readOneFactor(factor_id: ID!): factor
    countFactors(search: searchFactorInput ): Int
    vueTableFactor : VueTableFactor
    csvTableTemplateFactor: [String]
    factorsConnection(search:searchFactorInput, order: [ orderFactorInput ], pagination: paginationCursorInput! ): FactorConnection
  }

  type Mutation {
    addFactor(factor_id: ID!, name: String, description: String, type: String   , addAssays:[ID], addStudies:[ID], addOntologyAnnotation:[ID], addFileAttachments:[ID] , skipAssociationsExistenceChecks:Boolean = false): factor!
    updateFactor(factor_id: ID!, name: String, description: String, type: String   , addAssays:[ID], removeAssays:[ID] , addStudies:[ID], removeStudies:[ID] , addOntologyAnnotation:[ID], removeOntologyAnnotation:[ID] , addFileAttachments:[ID], removeFileAttachments:[ID]  , skipAssociationsExistenceChecks:Boolean = false): factor!
    deleteFactor(factor_id: ID!): String!
    bulkAddFactorCsv: String!
      }
`;
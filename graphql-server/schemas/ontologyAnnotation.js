module.exports = `
  type ontologyAnnotation{
    """
    @original-field
    """
    ontologyAnnotation_id: ID
    """
    @original-field
    
    """
    ontology: String

    """
    @original-field
    
    """
    ontologyURL: String

    """
    @original-field
    
    """
    term: String

    """
    @original-field
    
    """
    termURL: String

    """
    @original-field
    
    """
    investigation_ids: [String]

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
    assayResult_ids: [String]

    """
    @original-field
    
    """
    factor_ids: [String]

    """
    @original-field
    
    """
    material_ids: [String]

    """
    @original-field
    
    """
    protocol_ids: [String]

    """
    @original-field
    
    """
    contact_ids: [String]

      
    """
    @search-request
    """
    investigationsFilter(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationInput!): [investigation]


    """
    @search-request
    """
    investigationsConnection(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationCursorInput!): InvestigationConnection

    """
    @count-request
    """
    countFilteredInvestigations(search: searchInvestigationInput) : Int
  
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
    assayResultsFilter(search: searchAssayResultInput, order: [ orderAssayResultInput ], pagination: paginationInput!): [assayResult]


    """
    @search-request
    """
    assayResultsConnection(search: searchAssayResultInput, order: [ orderAssayResultInput ], pagination: paginationCursorInput!): AssayResultConnection

    """
    @count-request
    """
    countFilteredAssayResults(search: searchAssayResultInput) : Int
  
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
  
    }
type OntologyAnnotationConnection{
  edges: [OntologyAnnotationEdge]
  pageInfo: pageInfo!
}

type OntologyAnnotationEdge{
  cursor: String!
  node: ontologyAnnotation!
}

  type VueTableOntologyAnnotation{
    data : [ontologyAnnotation]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum ontologyAnnotationField {
    ontologyAnnotation_id
    ontology
    ontologyURL
    term
    termURL
    investigation_ids
    study_ids
    assay_ids
    assayResult_ids
    factor_ids
    material_ids
    protocol_ids
    contact_ids
  }
  input searchOntologyAnnotationInput {
    field: ontologyAnnotationField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchOntologyAnnotationInput]
  }

  input orderOntologyAnnotationInput{
    field: ontologyAnnotationField
    order: Order
  }



  type Query {
    ontologyAnnotations(search: searchOntologyAnnotationInput, order: [ orderOntologyAnnotationInput ], pagination: paginationInput! ): [ontologyAnnotation]
    readOneOntologyAnnotation(ontologyAnnotation_id: ID!): ontologyAnnotation
    countOntologyAnnotations(search: searchOntologyAnnotationInput ): Int
    vueTableOntologyAnnotation : VueTableOntologyAnnotation    csvTableTemplateOntologyAnnotation: [String]
    ontologyAnnotationsConnection(search:searchOntologyAnnotationInput, order: [ orderOntologyAnnotationInput ], pagination: paginationCursorInput! ): OntologyAnnotationConnection
  }

  type Mutation {
    addOntologyAnnotation(ontologyAnnotation_id: ID!, ontology: String, ontologyURL: String, term: String, termURL: String   , addInvestigations:[ID], addStudies:[ID], addAssays:[ID], addAssayResults:[ID], addFactors:[ID], addMaterials:[ID], addProtocols:[ID], addContacts:[ID] , skipAssociationsExistenceChecks:Boolean = false): ontologyAnnotation!
    updateOntologyAnnotation(ontologyAnnotation_id: ID!, ontology: String, ontologyURL: String, term: String, termURL: String   , addInvestigations:[ID], removeInvestigations:[ID] , addStudies:[ID], removeStudies:[ID] , addAssays:[ID], removeAssays:[ID] , addAssayResults:[ID], removeAssayResults:[ID] , addFactors:[ID], removeFactors:[ID] , addMaterials:[ID], removeMaterials:[ID] , addProtocols:[ID], removeProtocols:[ID] , addContacts:[ID], removeContacts:[ID]  , skipAssociationsExistenceChecks:Boolean = false): ontologyAnnotation!
    deleteOntologyAnnotation(ontologyAnnotation_id: ID!): String!
    bulkAddOntologyAnnotationCsv: String!
      }
`;
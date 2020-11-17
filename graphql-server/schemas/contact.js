module.exports = `
  type contact{
    """
    @original-field
    """
    contactDbId: ID
    """
    @original-field
    
    """
    email: String

    """
    @original-field
    
    """
    instituteName: String

    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    orcid: String

    """
    @original-field
    
    """
    type: String

    """
    @original-field
    
    """
    studyDbIds: [String]

    """
    @original-field
    
    """
    trialDbIds: [String]

      
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
    trialsFilter(search: searchTrialInput, order: [ orderTrialInput ], pagination: paginationInput!): [trial]


    """
    @search-request
    """
    trialsConnection(search: searchTrialInput, order: [ orderTrialInput ], pagination: paginationCursorInput!): TrialConnection

    """
    @count-request
    """
    countFilteredTrials(search: searchTrialInput) : Int
  
    """
    @search-request
    """
    programsFilter(search: searchProgramInput, order: [ orderProgramInput ], pagination: paginationInput!): [program]


    """
    @search-request
    """
    programsConnection(search: searchProgramInput, order: [ orderProgramInput ], pagination: paginationCursorInput!): ProgramConnection

    """
    @count-request
    """
    countFilteredPrograms(search: searchProgramInput) : Int
  
    }
type ContactConnection{
  edges: [ContactEdge]
  pageInfo: pageInfo!
}

type ContactEdge{
  cursor: String!
  node: contact!
}

  type VueTableContact{
    data : [contact]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum contactField {
    contactDbId
    email
    instituteName
    name
    orcid
    type
    studyDbIds
    trialDbIds
  }
  input searchContactInput {
    field: contactField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchContactInput]
  }

  input orderContactInput{
    field: contactField
    order: Order
  }



  type Query {
    contacts(search: searchContactInput, order: [ orderContactInput ], pagination: paginationInput! ): [contact]
    readOneContact(contactDbId: ID!): contact
    countContacts(search: searchContactInput ): Int
    vueTableContact : VueTableContact    csvTableTemplateContact: [String]
    contactsConnection(search:searchContactInput, order: [ orderContactInput ], pagination: paginationCursorInput! ): ContactConnection
  }

  type Mutation {
    addContact(contactDbId: ID!, email: String, instituteName: String, name: String, orcid: String, type: String   , addStudies:[ID], addTrials:[ID], addPrograms:[ID] , skipAssociationsExistenceChecks:Boolean = false): contact!
    updateContact(contactDbId: ID!, email: String, instituteName: String, name: String, orcid: String, type: String   , addStudies:[ID], removeStudies:[ID] , addTrials:[ID], removeTrials:[ID] , addPrograms:[ID], removePrograms:[ID]  , skipAssociationsExistenceChecks:Boolean = false): contact!
    deleteContact(contactDbId: ID!): String!
    bulkAddContactCsv: String!
      }
`;
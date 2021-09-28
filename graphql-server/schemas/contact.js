module.exports = `
  type contact{
    """
    @original-field
    """
    contact_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    email: String

    """
    @original-field
    
    """
    phone: String

    """
    @original-field
    
    """
    address: String

    """
    @original-field
    
    """
    affiliation: String

    """
    @original-field
    
    """
    study_ids: [String]

    """
    @original-field
    
    """
    investigation_ids: [String]

      
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
    investigationsFilter(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationInput!): [investigation]


    """
    @search-request
    """
    investigationsConnection(search: searchInvestigationInput, order: [ orderInvestigationInput ], pagination: paginationCursorInput!): InvestigationConnection

    """
    @count-request
    """
    countFilteredInvestigations(search: searchInvestigationInput) : Int
  
    }
type ContactConnection{
  edges: [ContactEdge]
  contacts: [contact]
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
    contact_id
    name
    email
    phone
    address
    affiliation
    study_ids
    investigation_ids
  }
  
  input searchContactInput {
    field: contactField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchContactInput]
  }

  input orderContactInput{
    field: contactField
    order: Order
  }



  type Query {
    contacts(search: searchContactInput, order: [ orderContactInput ], pagination: paginationInput! ): [contact]
    readOneContact(contact_id: ID!): contact
    countContacts(search: searchContactInput ): Int
    vueTableContact : VueTableContact
    csvTableTemplateContact: [String]
    contactsConnection(search:searchContactInput, order: [ orderContactInput ], pagination: paginationCursorInput! ): ContactConnection
  }

  type Mutation {
    addContact(contact_id: ID!, name: String, email: String, phone: String, address: String, affiliation: String   , addStudies:[ID], addInvestigations:[ID] , skipAssociationsExistenceChecks:Boolean = false): contact!
    updateContact(contact_id: ID!, name: String, email: String, phone: String, address: String, affiliation: String   , addStudies:[ID], removeStudies:[ID] , addInvestigations:[ID], removeInvestigations:[ID]  , skipAssociationsExistenceChecks:Boolean = false): contact!
    deleteContact(contact_id: ID!): String!
    bulkAddContactCsv: String!
      }
`;
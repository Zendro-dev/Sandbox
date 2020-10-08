module.exports = `
  type Person{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    name: String

  

    
    """
    @search-request
    """
    imagesFilter(search: searchImageAttachmentInput, order: [ orderImageAttachmentInput ], pagination: paginationInput!): [ImageAttachment]


    """
    @search-request
    """
    imagesConnection(search: searchImageAttachmentInput, order: [ orderImageAttachmentInput ], pagination: paginationCursorInput!): ImageAttachmentConnection

    """
    @count-request
    """
    countFilteredImages(search: searchImageAttachmentInput) : Int
  
    }
type PersonConnection{
  edges: [PersonEdge]
  pageInfo: pageInfo!
}

type PersonEdge{
  cursor: String!
  node: Person!
}

  type VueTablePerson{
    data : [Person]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum PersonField {
    id
    name
  }
  input searchPersonInput {
    field: PersonField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchPersonInput]
  }

  input orderPersonInput{
    field: PersonField
    order: Order
  }



  type Query {
    people(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput! ): [Person]
    readOnePerson(id: ID!): Person
    countPeople(search: searchPersonInput ): Int
    vueTablePerson : VueTablePerson    csvTableTemplatePerson: [String]
    peopleConnection(search:searchPersonInput, order: [ orderPersonInput ], pagination: paginationCursorInput! ): PersonConnection
  }

  type Mutation {
    addPerson( name: String   , addImages:[ID] , skipAssociationsExistenceChecks:Boolean = false): Person!
    updatePerson(id: ID!, name: String   , addImages:[ID], removeImages:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Person!
    deletePerson(id: ID!): String!
    bulkAddPersonCsv: String!
      }
`;
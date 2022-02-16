module.exports = `
  type organization{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    name: String

      
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type OrganizationConnection{
  edges: [OrganizationEdge]
  organizations: [organization]
  pageInfo: pageInfo!
}

type OrganizationEdge{
  cursor: String!
  node: organization!
}

  enum organizationField {
    id
    name
  }
  
  input searchOrganizationInput {
    field: organizationField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchOrganizationInput]
  }

  input orderOrganizationInput{
    field: organizationField
    order: Order
  }



  type Query {
    organizations(search: searchOrganizationInput, order: [ orderOrganizationInput ], pagination: paginationInput! ): [organization]
    readOneOrganization(id: ID!): organization
    countOrganizations(search: searchOrganizationInput ): Int
    csvTableTemplateOrganization: [String]
    organizationsConnection(search:searchOrganizationInput, order: [ orderOrganizationInput ], pagination: paginationCursorInput! ): OrganizationConnection
    validateOrganizationForCreation(id: ID!, name: String    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateOrganizationForUpdating(id: ID!, name: String    , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateOrganizationForDeletion(id: ID!): Boolean!
    validateOrganizationAfterReading(id: ID!): Boolean!
  }

  type Mutation {
    addOrganization(id: ID!, name: String    , skipAssociationsExistenceChecks:Boolean = false): organization!
    updateOrganization(id: ID!, name: String    , skipAssociationsExistenceChecks:Boolean = false): organization!
    deleteOrganization(id: ID!): String!
    bulkAddOrganizationCsv: String!
      }
`;
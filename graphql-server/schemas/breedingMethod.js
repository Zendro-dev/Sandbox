module.exports = `
  type breedingMethod{
    """
    @original-field
    """
    breedingMethodDbId: ID
    """
    @original-field
    
    """
    abbreviation: String

    """
    @original-field
    
    """
    breedingMethodName: String

    """
    @original-field
    
    """
    description: String

      
    """
    @search-request
    """
    germplasmFilter(search: searchGermplasmInput, order: [ orderGermplasmInput ], pagination: paginationInput!): [germplasm]


    """
    @search-request
    """
    germplasmConnection(search: searchGermplasmInput, order: [ orderGermplasmInput ], pagination: paginationCursorInput!): GermplasmConnection

    """
    @count-request
    """
    countFilteredGermplasm(search: searchGermplasmInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type BreedingMethodConnection{
  edges: [BreedingMethodEdge]
  breedingMethods: [breedingMethod]
  pageInfo: pageInfo!
}

type BreedingMethodEdge{
  cursor: String!
  node: breedingMethod!
}

  enum breedingMethodField {
    breedingMethodDbId
    abbreviation
    breedingMethodName
    description
  }
  
  input searchBreedingMethodInput {
    field: breedingMethodField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchBreedingMethodInput]
  }

  input orderBreedingMethodInput{
    field: breedingMethodField
    order: Order
  }



  type Query {
    breedingMethods(search: searchBreedingMethodInput, order: [ orderBreedingMethodInput ], pagination: paginationInput! ): [breedingMethod]
    readOneBreedingMethod(breedingMethodDbId: ID!): breedingMethod
    countBreedingMethods(search: searchBreedingMethodInput ): Int
    csvTableTemplateBreedingMethod: [String]
    breedingMethodsConnection(search:searchBreedingMethodInput, order: [ orderBreedingMethodInput ], pagination: paginationCursorInput! ): BreedingMethodConnection
    validateBreedingMethodForCreation(breedingMethodDbId: ID!, abbreviation: String, breedingMethodName: String, description: String   , addGermplasm:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateBreedingMethodForUpdating(breedingMethodDbId: ID!, abbreviation: String, breedingMethodName: String, description: String   , addGermplasm:[ID], removeGermplasm:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateBreedingMethodForDeletion(breedingMethodDbId: ID!): Boolean!
    validateBreedingMethodAfterReading(breedingMethodDbId: ID!): Boolean!
    """
    breedingMethodsZendroDefinition would return the static Zendro data model definition
    """
    breedingMethodsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addBreedingMethod(breedingMethodDbId: ID!, abbreviation: String, breedingMethodName: String, description: String   , addGermplasm:[ID] , skipAssociationsExistenceChecks:Boolean = false): breedingMethod!
    updateBreedingMethod(breedingMethodDbId: ID!, abbreviation: String, breedingMethodName: String, description: String   , addGermplasm:[ID], removeGermplasm:[ID]  , skipAssociationsExistenceChecks:Boolean = false): breedingMethod!
    deleteBreedingMethod(breedingMethodDbId: ID!): String!
      }
`;
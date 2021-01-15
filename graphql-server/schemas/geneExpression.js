module.exports = `
  type geneExpression{
    """
    @original-field
    """
    gene_id: ID
    """
    @original-field
    
    """
    assay_id: String

    """
    @original-field
    
    """
    geneCount: String

    assay(search: searchAssayInput): assay
    
    }
type GeneExpressionConnection{
  edges: [GeneExpressionEdge]
  pageInfo: pageInfo!
}

type GeneExpressionEdge{
  cursor: String!
  node: geneExpression!
}

  type VueTableGeneExpression{
    data : [geneExpression]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum geneExpressionField {
    gene_id
    assay_id
    geneCount
  }
  input searchGeneExpressionInput {
    field: geneExpressionField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchGeneExpressionInput]
  }

  input orderGeneExpressionInput{
    field: geneExpressionField
    order: Order
  }

  input bulkAssociationGeneExpressionWithAssay_idInput{
    gene_id: ID!
    assay_id: ID!
  }

  type Query {
    geneExpressions(search: searchGeneExpressionInput, order: [ orderGeneExpressionInput ], pagination: paginationInput! ): [geneExpression]
    readOneGeneExpression(gene_id: ID!): geneExpression
    countGeneExpressions(search: searchGeneExpressionInput ): Int
    vueTableGeneExpression : VueTableGeneExpression    csvTableTemplateGeneExpression: [String]
    geneExpressionsConnection(search:searchGeneExpressionInput, order: [ orderGeneExpressionInput ], pagination: paginationCursorInput! ): GeneExpressionConnection
  }

  type Mutation {
    addGeneExpression(gene_id: ID!, geneCount: String , addAssay:ID   , skipAssociationsExistenceChecks:Boolean = false): geneExpression!
    updateGeneExpression(gene_id: ID!, geneCount: String , addAssay:ID, removeAssay:ID    , skipAssociationsExistenceChecks:Boolean = false): geneExpression!
    deleteGeneExpression(gene_id: ID!): String!
    bulkAddGeneExpressionCsv: String!
    bulkAssociateGeneExpressionWithAssay_id(bulkAssociationInput: [bulkAssociationGeneExpressionWithAssay_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateGeneExpressionWithAssay_id(bulkAssociationInput: [bulkAssociationGeneExpressionWithAssay_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
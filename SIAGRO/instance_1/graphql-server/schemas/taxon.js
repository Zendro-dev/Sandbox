module.exports = `
  type taxon{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    taxon: String

    """
    @original-field
    
    """
    categoria: String

    """
    @original-field
    
    """
    estatus: String

    """
    @original-field
    
    """
    nombreAutoridad: String

    """
    @original-field
    
    """
    citaNomenclatural: String

    """
    @original-field
    
    """
    fuente: String

    """
    @original-field
    
    """
    ambiente: String

    """
    @original-field
    
    """
    grupoSNIB: String

    """
    @original-field
    
    """
    categoriaResidencia: String

    """
    @original-field
    
    """
    nom: String

    """
    @original-field
    
    """
    cites: String

    """
    @original-field
    
    """
    iucn: String

    """
    @original-field
    
    """
    prioritarias: String

    """
    @original-field
    
    """
    endemismo: String

      
    """
    @search-request
    """
    cuadrantesFilter(search: searchCuadranteInput, order: [ orderCuadranteInput ], pagination: paginationInput): [cuadrante]


    """
    @search-request
    """
    cuadrantesConnection(search: searchCuadranteInput, order: [ orderCuadranteInput ], pagination: paginationCursorInput): CuadranteConnection

    """
    @count-request
    """
    countFilteredCuadrantes(search: searchCuadranteInput) : Int
  
    }
type TaxonConnection{
  edges: [TaxonEdge]
  pageInfo: pageInfo!
}

type TaxonEdge{
  cursor: String!
  node: taxon!
}

  type VueTableTaxon{
    data : [taxon]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum taxonField {
    id
    taxon
    categoria
    estatus
    nombreAutoridad
    citaNomenclatural
    fuente
    ambiente
    grupoSNIB
    categoriaResidencia
    nom
    cites
    iucn
    prioritarias
    endemismo
  }
  input searchTaxonInput {
    field: taxonField
    value: typeValue
    operator: Operator
    search: [searchTaxonInput]
  }

  input orderTaxonInput{
    field: taxonField
    order: Order
  }
  type Query {
    taxons(search: searchTaxonInput, order: [ orderTaxonInput ], pagination: paginationInput ): [taxon]
    readOneTaxon(id: ID!): taxon
    countTaxons(search: searchTaxonInput ): Int
    vueTableTaxon : VueTableTaxon    csvTableTemplateTaxon: [String]

    taxonsConnection(search:searchTaxonInput, order: [ orderTaxonInput ], pagination: paginationCursorInput ): TaxonConnection
  }
    type Mutation {
    addTaxon(id: ID!, taxon: String, categoria: String, estatus: String, nombreAutoridad: String, citaNomenclatural: String, fuente: String, ambiente: String, grupoSNIB: String, categoriaResidencia: String, nom: String, cites: String, iucn: String, prioritarias: String, endemismo: String   , addCuadrantes:[ID] , skipAssociationsExistenceChecks:Boolean = false): taxon!
    updateTaxon(id: ID!, taxon: String, categoria: String, estatus: String, nombreAutoridad: String, citaNomenclatural: String, fuente: String, ambiente: String, grupoSNIB: String, categoriaResidencia: String, nom: String, cites: String, iucn: String, prioritarias: String, endemismo: String   , addCuadrantes:[ID], removeCuadrantes:[ID]  , skipAssociationsExistenceChecks:Boolean = false): taxon!
  deleteTaxon(id: ID!): String!
  bulkAddTaxonCsv: [taxon] }

`;
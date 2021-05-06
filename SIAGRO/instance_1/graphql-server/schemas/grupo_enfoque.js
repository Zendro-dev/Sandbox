module.exports = `
  type grupo_enfoque{
    """
    @original-field
    """
    grupo_id: ID
    """
    @original-field
    
    """
    tipo_grupo: String

    """
    @original-field
    
    """
    numero_participantes: Int

    """
    @original-field
    
    """
    fecha: Date

    """
    @original-field
    
    """
    lista_especies: String

    """
    @original-field
    
    """
    sitio_id: String

    sitio(search: searchSitioInput): sitio
    
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
type Grupo_enfoqueConnection{
  edges: [Grupo_enfoqueEdge]
  pageInfo: pageInfo!
}

type Grupo_enfoqueEdge{
  cursor: String!
  node: grupo_enfoque!
}

  type VueTableGrupo_enfoque{
    data : [grupo_enfoque]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum grupo_enfoqueField {
    grupo_id
    tipo_grupo
    numero_participantes
    fecha
    lista_especies
    sitio_id
  }
  input searchGrupo_enfoqueInput {
    field: grupo_enfoqueField
    value: typeValue
    operator: Operator
    search: [searchGrupo_enfoqueInput]
  }

  input orderGrupo_enfoqueInput{
    field: grupo_enfoqueField
    order: Order
  }

  input bulkAssociationGrupo_enfoqueWithSitio_idInput{
    grupo_id: ID!
    sitio_id: ID!
  }

  type Query {
    grupo_enfoques(search: searchGrupo_enfoqueInput, order: [ orderGrupo_enfoqueInput ], pagination: paginationInput ): [grupo_enfoque]
    readOneGrupo_enfoque(grupo_id: ID!): grupo_enfoque
    countGrupo_enfoques(search: searchGrupo_enfoqueInput ): Int
    vueTableGrupo_enfoque : VueTableGrupo_enfoque    csvTableTemplateGrupo_enfoque: [String]
    grupo_enfoquesConnection(search:searchGrupo_enfoqueInput, order: [ orderGrupo_enfoqueInput ], pagination: paginationCursorInput ): Grupo_enfoqueConnection
  }

  type Mutation {
    addGrupo_enfoque(grupo_id: ID!, tipo_grupo: String, numero_participantes: Int, fecha: Date, lista_especies: String , addSitio:ID  , addCuadrantes:[ID] , skipAssociationsExistenceChecks:Boolean = false): grupo_enfoque!
    updateGrupo_enfoque(grupo_id: ID!, tipo_grupo: String, numero_participantes: Int, fecha: Date, lista_especies: String , addSitio:ID, removeSitio:ID   , addCuadrantes:[ID], removeCuadrantes:[ID]  , skipAssociationsExistenceChecks:Boolean = false): grupo_enfoque!
    deleteGrupo_enfoque(grupo_id: ID!): String!
    bulkAddGrupo_enfoqueCsv: String!
    bulkAssociateGrupo_enfoqueWithSitio_id(bulkAssociationInput: [bulkAssociationGrupo_enfoqueWithSitio_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateGrupo_enfoqueWithSitio_id(bulkAssociationInput: [bulkAssociationGrupo_enfoqueWithSitio_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;
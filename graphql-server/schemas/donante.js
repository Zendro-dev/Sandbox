module.exports = `
  type donante{
    """
    @original-field
    """
    donante_id: ID
    """
    @original-field
    
    """
    NombreDonanteInformante: String

    """
    @original-field
    
    """
    GeneroDonanteInformante: String

    """
    @original-field
    
    """
    EdadDonanteInformante: Int

    """
    @original-field
    
    """
    ActividadDonanteInformante: String

    """
    @original-field
    
    """
    GrupoEtnicoDonanteInformante: String

    """
    @original-field
    
    """
    LenguaDonanteInformante: String

      
    """
    @search-request
    """
    registro_siagroFilter(search: searchRegistro_siagroInput, order: [ orderRegistro_siagroInput ], pagination: paginationInput!): [registro_siagro]


    """
    @search-request
    """
    registro_siagroConnection(search: searchRegistro_siagroInput, order: [ orderRegistro_siagroInput ], pagination: paginationCursorInput!): Registro_siagroConnection

    """
    @count-request
    """
    countFilteredRegistro_siagro(search: searchRegistro_siagroInput) : Int
  
    }
type DonanteConnection{
  edges: [DonanteEdge]
  donantes: [donante]
  pageInfo: pageInfo!
}

type DonanteEdge{
  cursor: String!
  node: donante!
}

  type VueTableDonante{
    data : [donante]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum donanteField {
    donante_id
    NombreDonanteInformante
    GeneroDonanteInformante
    EdadDonanteInformante
    ActividadDonanteInformante
    GrupoEtnicoDonanteInformante
    LenguaDonanteInformante
  }
  input searchDonanteInput {
    field: donanteField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchDonanteInput]
  }

  input orderDonanteInput{
    field: donanteField
    order: Order
  }



  type Query {
    donantes(search: searchDonanteInput, order: [ orderDonanteInput ], pagination: paginationInput! ): [donante]
    readOneDonante(donante_id: ID!): donante
    countDonantes(search: searchDonanteInput ): Int
    vueTableDonante : VueTableDonante
    csvTableTemplateDonante: [String]
    donantesConnection(search:searchDonanteInput, order: [ orderDonanteInput ], pagination: paginationCursorInput! ): DonanteConnection
  }

  type Mutation {
    addDonante(donante_id: ID!, NombreDonanteInformante: String, GeneroDonanteInformante: String, EdadDonanteInformante: Int, ActividadDonanteInformante: String, GrupoEtnicoDonanteInformante: String, LenguaDonanteInformante: String   , addRegistro_siagro:[ID] , skipAssociationsExistenceChecks:Boolean = false): donante!
    updateDonante(donante_id: ID!, NombreDonanteInformante: String, GeneroDonanteInformante: String, EdadDonanteInformante: Int, ActividadDonanteInformante: String, GrupoEtnicoDonanteInformante: String, LenguaDonanteInformante: String   , addRegistro_siagro:[ID], removeRegistro_siagro:[ID]  , skipAssociationsExistenceChecks:Boolean = false): donante!
    deleteDonante(donante_id: ID!): String!
    bulkAddDonanteCsv: String!
      }
`;
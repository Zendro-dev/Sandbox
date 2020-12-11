module.exports = `
  type Ejemplar{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    region: String

    """
    @original-field
    
    """
    localidad: String

    """
    @original-field
    
    """
    longitud: Float

    """
    @original-field
    
    """
    latitud: Float

    """
    @original-field
    
    """
    datum: String

    """
    @original-field
    
    """
    validacionambiente: String

    """
    @original-field
    
    """
    geovalidacion: String

    """
    @original-field
    
    """
    paismapa: String

    """
    @original-field
    
    """
    estadomapa: String

    """
    @original-field
    
    """
    claveestadomapa: String

    """
    @original-field
    
    """
    mt24nombreestadomapa: String

    """
    @original-field
    
    """
    mt24claveestadomapa: String

    """
    @original-field
    
    """
    municipiomapa: String

    """
    @original-field
    
    """
    clavemunicipiomapa: String

    """
    @original-field
    
    """
    mt24nombremunicipiomapa: String

    """
    @original-field
    
    """
    mt24clavemunicipiomapa: String

    """
    @original-field
    
    """
    incertidumbrexy: String

    """
    @original-field
    
    """
    altitudmapa: String

    """
    @original-field
    
    """
    usvserieI: String

    """
    @original-field
    
    """
    usvserieII: String

    """
    @original-field
    
    """
    usvserieIII: String

    """
    @original-field
    
    """
    usvserieIV: String

    """
    @original-field
    
    """
    usvserieV: String

    """
    @original-field
    
    """
    usvserieVI: String

    """
    @original-field
    
    """
    anp: String

    """
    @original-field
    
    """
    grupobio: String

    """
    @original-field
    
    """
    subgrupobio: String

    """
    @original-field
    
    """
    taxon: String

    """
    @original-field
    
    """
    autor: String

    """
    @original-field
    
    """
    estatustax: String

    """
    @original-field
    
    """
    reftax: String

    """
    @original-field
    
    """
    taxonvalido: String

    """
    @original-field
    
    """
    autorvalido: String

    """
    @original-field
    
    """
    reftaxvalido: String

    """
    @original-field
    
    """
    taxonvalidado: String

    """
    @original-field
    
    """
    endemismo: String

    """
    @original-field
    
    """
    taxonextinto: String

    """
    @original-field
    
    """
    ambiente: String

    """
    @original-field
    
    """
    nombrecomun: String

    """
    @original-field
    
    """
    formadecrecimiento: String

    """
    @original-field
    
    """
    prioritaria: String

    """
    @original-field
    
    """
    nivelprioridad: String

    """
    @original-field
    
    """
    exoticainvasora: String

    """
    @original-field
    
    """
    nom059: String

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
    categoriaresidenciaaves: String

    """
    @original-field
    
    """
    probablelocnodecampo: String

    """
    @original-field
    
    """
    obsusoinfo: String

    """
    @original-field
    
    """
    coleccion: String

    """
    @original-field
    
    """
    institucion: String

    """
    @original-field
    
    """
    paiscoleccion: String

    """
    @original-field
    
    """
    numcatalogo: String

    """
    @original-field
    
    """
    numcolecta: String

    """
    @original-field
    
    """
    procedenciaejemplar: String

    """
    @original-field
    
    """
    determinador: String

    """
    @original-field
    
    """
    aniodeterminacion: String

    """
    @original-field
    
    """
    mesdeterminacion: String

    """
    @original-field
    
    """
    diadeterminacion: String

    """
    @original-field
    
    """
    fechadeterminacion: String

    """
    @original-field
    
    """
    calificadordeterminacion: String

    """
    @original-field
    
    """
    colector: String

    """
    @original-field
    
    """
    aniocolecta: String

    """
    @original-field
    
    """
    mescolecta: String

    """
    @original-field
    
    """
    diacolecta: String

    """
    @original-field
    
    """
    fechacolecta: String

    """
    @original-field
    
    """
    tipo: String

    """
    @original-field
    
    """
    ejemplarfosil: String

    """
    @original-field
    
    """
    proyecto: String

    """
    @original-field
    
    """
    fuente: String

    """
    @original-field
    
    """
    formadecitar: String

    """
    @original-field
    
    """
    licenciauso: String

    """
    @original-field
    
    """
    urlproyecto: String

    """
    @original-field
    
    """
    urlorigen: String

    """
    @original-field
    
    """
    urlejemplar: String

    """
    @original-field
    
    """
    ultimafechaactualizacion: String

    """
    @original-field
    
    """
    cuarentena: String

    """
    @original-field
    
    """
    version: String

    """
    @original-field
    
    """
    especie: String

    """
    @original-field
    
    """
    especievalida: String

    """
    @original-field
    
    """
    especievalidabusqueda: String

      
    """
    @search-request
    """
    caracteristicas_cuantitativasFilter(search: searchCaracteristica_cuantitativaInput, order: [ orderCaracteristica_cuantitativaInput ], pagination: paginationInput!): [caracteristica_cuantitativa]


    """
    @search-request
    """
    caracteristicas_cuantitativasConnection(search: searchCaracteristica_cuantitativaInput, order: [ orderCaracteristica_cuantitativaInput ], pagination: paginationCursorInput!): Caracteristica_cuantitativaConnection

    """
    @count-request
    """
    countFilteredCaracteristicas_cuantitativas(search: searchCaracteristica_cuantitativaInput) : Int
  
    """
    @search-request
    """
    caracteristicas_cualitativasFilter(search: searchCaracteristica_cualitativaInput, order: [ orderCaracteristica_cualitativaInput ], pagination: paginationInput!): [caracteristica_cualitativa]


    """
    @search-request
    """
    caracteristicas_cualitativasConnection(search: searchCaracteristica_cualitativaInput, order: [ orderCaracteristica_cualitativaInput ], pagination: paginationCursorInput!): Caracteristica_cualitativaConnection

    """
    @count-request
    """
    countFilteredCaracteristicas_cualitativas(search: searchCaracteristica_cualitativaInput) : Int
  
    Taxon(search: searchTaxonInput): Taxon
    }
type EjemplarConnection{
  edges: [EjemplarEdge]
  pageInfo: pageInfo!
}

type EjemplarEdge{
  cursor: String!
  node: Ejemplar!
}

  type VueTableEjemplar{
    data : [Ejemplar]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum EjemplarField {
    id
    region
    localidad
    longitud
    latitud
    datum
    validacionambiente
    geovalidacion
    paismapa
    estadomapa
    claveestadomapa
    mt24nombreestadomapa
    mt24claveestadomapa
    municipiomapa
    clavemunicipiomapa
    mt24nombremunicipiomapa
    mt24clavemunicipiomapa
    incertidumbrexy
    altitudmapa
    usvserieI
    usvserieII
    usvserieIII
    usvserieIV
    usvserieV
    usvserieVI
    anp
    grupobio
    subgrupobio
    taxon
    autor
    estatustax
    reftax
    taxonvalido
    autorvalido
    reftaxvalido
    taxonvalidado
    endemismo
    taxonextinto
    ambiente
    nombrecomun
    formadecrecimiento
    prioritaria
    nivelprioridad
    exoticainvasora
    nom059
    cites
    iucn
    categoriaresidenciaaves
    probablelocnodecampo
    obsusoinfo
    coleccion
    institucion
    paiscoleccion
    numcatalogo
    numcolecta
    procedenciaejemplar
    determinador
    aniodeterminacion
    mesdeterminacion
    diadeterminacion
    fechadeterminacion
    calificadordeterminacion
    colector
    aniocolecta
    mescolecta
    diacolecta
    fechacolecta
    tipo
    ejemplarfosil
    proyecto
    fuente
    formadecitar
    licenciauso
    urlproyecto
    urlorigen
    urlejemplar
    ultimafechaactualizacion
    cuarentena
    version
    especie
    especievalida
    especievalidabusqueda
  }
  input searchEjemplarInput {
    field: EjemplarField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchEjemplarInput]
  }

  input orderEjemplarInput{
    field: EjemplarField
    order: Order
  }



  type Query {
    ejemplars(search: searchEjemplarInput, order: [ orderEjemplarInput ], pagination: paginationInput! ): [Ejemplar]
    readOneEjemplar(id: ID!): Ejemplar
    countEjemplars(search: searchEjemplarInput ): Int
    vueTableEjemplar : VueTableEjemplar    csvTableTemplateEjemplar: [String]
    ejemplarsConnection(search:searchEjemplarInput, order: [ orderEjemplarInput ], pagination: paginationCursorInput! ): EjemplarConnection
  }

  type Mutation {
    addEjemplar(id: ID!, region: String, localidad: String, longitud: Float, latitud: Float, datum: String, validacionambiente: String, geovalidacion: String, paismapa: String, estadomapa: String, claveestadomapa: String, mt24nombreestadomapa: String, mt24claveestadomapa: String, municipiomapa: String, clavemunicipiomapa: String, mt24nombremunicipiomapa: String, mt24clavemunicipiomapa: String, incertidumbrexy: String, altitudmapa: String, usvserieI: String, usvserieII: String, usvserieIII: String, usvserieIV: String, usvserieV: String, usvserieVI: String, anp: String, grupobio: String, subgrupobio: String, taxon: String, autor: String, estatustax: String, reftax: String, taxonvalido: String, autorvalido: String, reftaxvalido: String, taxonvalidado: String, endemismo: String, taxonextinto: String, ambiente: String, nombrecomun: String, formadecrecimiento: String, prioritaria: String, nivelprioridad: String, exoticainvasora: String, nom059: String, cites: String, iucn: String, categoriaresidenciaaves: String, probablelocnodecampo: String, obsusoinfo: String, coleccion: String, institucion: String, paiscoleccion: String, numcatalogo: String, numcolecta: String, procedenciaejemplar: String, determinador: String, aniodeterminacion: String, mesdeterminacion: String, diadeterminacion: String, fechadeterminacion: String, calificadordeterminacion: String, colector: String, aniocolecta: String, mescolecta: String, diacolecta: String, fechacolecta: String, tipo: String, ejemplarfosil: String, proyecto: String, fuente: String, formadecitar: String, licenciauso: String, urlproyecto: String, urlorigen: String, urlejemplar: String, ultimafechaactualizacion: String, cuarentena: String, version: String, especie: String, especievalida: String, especievalidabusqueda: String  , addTaxon:ID , addCaracteristicas_cuantitativas:[ID], addCaracteristicas_cualitativas:[ID] , skipAssociationsExistenceChecks:Boolean = false): Ejemplar!
    updateEjemplar(id: ID!, region: String, localidad: String, longitud: Float, latitud: Float, datum: String, validacionambiente: String, geovalidacion: String, paismapa: String, estadomapa: String, claveestadomapa: String, mt24nombreestadomapa: String, mt24claveestadomapa: String, municipiomapa: String, clavemunicipiomapa: String, mt24nombremunicipiomapa: String, mt24clavemunicipiomapa: String, incertidumbrexy: String, altitudmapa: String, usvserieI: String, usvserieII: String, usvserieIII: String, usvserieIV: String, usvserieV: String, usvserieVI: String, anp: String, grupobio: String, subgrupobio: String, taxon: String, autor: String, estatustax: String, reftax: String, taxonvalido: String, autorvalido: String, reftaxvalido: String, taxonvalidado: String, endemismo: String, taxonextinto: String, ambiente: String, nombrecomun: String, formadecrecimiento: String, prioritaria: String, nivelprioridad: String, exoticainvasora: String, nom059: String, cites: String, iucn: String, categoriaresidenciaaves: String, probablelocnodecampo: String, obsusoinfo: String, coleccion: String, institucion: String, paiscoleccion: String, numcatalogo: String, numcolecta: String, procedenciaejemplar: String, determinador: String, aniodeterminacion: String, mesdeterminacion: String, diadeterminacion: String, fechadeterminacion: String, calificadordeterminacion: String, colector: String, aniocolecta: String, mescolecta: String, diacolecta: String, fechacolecta: String, tipo: String, ejemplarfosil: String, proyecto: String, fuente: String, formadecitar: String, licenciauso: String, urlproyecto: String, urlorigen: String, urlejemplar: String, ultimafechaactualizacion: String, cuarentena: String, version: String, especie: String, especievalida: String, especievalidabusqueda: String  , addTaxon:ID, removeTaxon:ID  , addCaracteristicas_cuantitativas:[ID], removeCaracteristicas_cuantitativas:[ID] , addCaracteristicas_cualitativas:[ID], removeCaracteristicas_cualitativas:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Ejemplar!
    deleteEjemplar(id: ID!): String!
    bulkAddEjemplarCsv: String!
      }
`;

export default () => ({
  models: [
    {
      id: 0,
      name: 'caracteristica_cualitativa',
      title: 'Caracteristica_cualitativa',
      url: '/main/model/caracteristica_cualitativa',
    },
    {
      id: 1,
      name: 'caracteristica_cuantitativa',
      title: 'Caracteristica_cuantitativa',
      url: '/main/model/caracteristica_cuantitativa',
    },
    {
      id: 2,
      name: 'ejemplar',
      title: 'Ejemplar',
      url: '/main/model/ejemplar',
    },
    {
      id: 3,
      name: 'metodo',
      title: 'Metodo',
      url: '/main/model/metodo',
    },
    {
      id: 4,
      name: 'taxon',
      title: 'Taxon',
      url: '/main/model/taxon',
    },
  ],
  adminModels: [
    {
      id: 5,
      name: 'role',
      title: 'Role',
      url: '/main/admin/role',
    },
    {
      id: 6,
      name: 'role_to_user',
      title: 'Role_to_user',
      url: '/main/admin/role_to_user',
    },
    {
      id: 7,
      name: 'user',
      title: 'User',
      url: '/main/admin/user',
    },
  ],
})
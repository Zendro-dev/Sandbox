
export default () => ({
  models: [
    {
      id: 0,
      name: 'accession',
      title: 'Accession',
      url: '/main/model/accession',
    },
    {
      id: 1,
      name: 'individual',
      title: 'Individual',
      url: '/main/model/individual',
    },
    {
      id: 2,
      name: 'location',
      title: 'Location',
      url: '/main/model/location',
    },
    {
      id: 3,
      name: 'measurement',
      title: 'Measurement',
      url: '/main/model/measurement',
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
  ]
})
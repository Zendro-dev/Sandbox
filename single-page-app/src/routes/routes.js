
export default () => ({
  models: [
    {
      id: 0,
      name: 'author',
      title: 'Author',
      url: '/main/model/author',
    },
    {
      id: 1,
      name: 'book',
      title: 'Book',
      url: '/main/model/book',
    },
    {
      id: 2,
      name: 'sPARefactor',
      title: 'SPARefactor',
      url: '/main/model/sPARefactor',
    },
  ],
  adminModels: [
    {
      id: 3,
      name: 'role',
      title: 'Role',
      url: '/main/admin/role',
    },
    {
      id: 4,
      name: 'role_to_user',
      title: 'Role_to_user',
      url: '/main/admin/role_to_user',
    },
    {
      id: 5,
      name: 'user',
      title: 'User',
      url: '/main/admin/user',
    },
  ],
  zendroStudio: {
    id: 6,
    name: 'zendro-studio',
    title: 'Zendro Studio',
    url: '/main/zendro-studio',
  },
})
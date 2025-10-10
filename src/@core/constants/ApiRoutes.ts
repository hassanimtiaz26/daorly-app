export const ApiRoutes: any = {
  auth: {
    login: 'auth/login',
    register: 'auth/register',
    confirmCode: 'auth/confirm-code',
    user: 'user',
  },
  categories: {
    index: 'categories',
    subCategories: 'categories/sub',
  },
  client: {
    home: 'client/home',
  },
  location: {
    cities: 'locations/cities',
    areas: (cityId: number) => `locations/cities/${cityId}/areas`,
  },
  orders: {
    index: 'orders',
    create: 'orders',
    details: (id: number) => `orders/${id}`,
    makeOffer: (id: number) => `orders/${id}/offer`,
  },
  services: {
    index: 'services',
    show: (id: number) => `services/${id}`,
  },
  user: {
    index: 'user',
    update: 'user'
  },
}

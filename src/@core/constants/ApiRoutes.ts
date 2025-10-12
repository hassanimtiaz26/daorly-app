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
  media: {
    upload: 'media',
  },
  orders: {
    index: 'orders',
    withStatus: (status: string) => `orders?status=${status}`,
    create: 'orders',
    cancel: (orderId: number) => `orders/cancel/${orderId}`,
    details: (orderId: number) => `orders/${orderId}`,
    makeOffer: (orderId: number) => `orders/${orderId}/offers`,
    acceptOffer: (offerId: number) => `orders/offers/${offerId}/accept`,
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

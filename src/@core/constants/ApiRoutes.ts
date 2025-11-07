export const ApiRoutes: any = {
  auth: {
    login: 'auth/login',
    register: 'auth/register',
    confirmCode: 'auth/confirm-code',
    user: 'user',
  },
  business: {
    index: 'business',
  },
  complete: {
    data: 'business/form-data',
    business: 'business',
  },
  categories: {
    index: 'categories',
    subCategories: 'categories/sub',
  },
  client: {
    home: 'client/home',
  },
  provider: {
    home: 'business/home',
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
    cancel: (orderId: number) => `orders/${orderId}/cancel`,
    details: (orderId: number) => `orders/${orderId}`,
    makeOffer: (orderId: number) => `orders/${orderId}/offers`,
    acceptOffer: (orderId: number, offerId: number) => `orders/${orderId}/offers/${offerId}/accept`,
    completeOrder: (orderId: number) => `orders/${orderId}/complete`,
    rejectOrder: (orderId: number) => `orders/${orderId}/reject`,
  },
  services: {
    index: 'services',
    show: (id: number) => `services/${id}`,
  },
  subscriptions: {
    plans: 'subscriptions/plans',
    subscribe: 'subscriptions/subscribe',
  },
  user: {
    index: 'user',
    update: 'user',
    wallet: 'user/wallet',
  },
  page: {
    name: (name: string) => `pages/${name}`,
  }
}


export default async ({ to, from }) => {
  if (!to.query.keyword) {
    return Promise.reject({
      name: 'home'
    })
  }
}

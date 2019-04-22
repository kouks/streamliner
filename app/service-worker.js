
/**
 * Prechached assets, always available cache-first.
 */

workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

/**
 * Skip waiting when reregistering an updated SW.
 */

workbox.skipWaiting()
workbox.clientsClaim()

/**
 * Workbox routes.
 */

workbox.routing.registerRoute(
  new RegExp('https://fonts.gstatic.com/.*'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'fonts'
  })
)

workbox.routing.registerRoute(
  new RegExp('https://use.fontawesome.com/releases/.*'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'fonts'
  })
)

// This line of code makes sure that we always fall back to the spa router when
// someone refreshes on a non '/' route.
workbox.routing.registerNavigationRoute('/index.html', {
  blacklist: [
    // Frequently refreshed SEO files should not be cached by the SW.
    /\/robots\.txt/,
    // The service worker itself should not be cached.
    /\/service-worker\.js/,
    // Any routes ending with a slash should not be cached, but redirected to
    // a non-slash route.
    /\/$/
  ]
})

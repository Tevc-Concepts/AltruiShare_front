import type { NextConfig } from 'next'
// Import next-pwa with dynamic function wrapper to satisfy ESM
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - next-pwa provides a cjs export
import nextPwa from 'next-pwa'
const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /\/api\/method\/altruishare.*get_needs.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'needs-cache',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 10 },
        cacheableResponse: { statuses: [0, 200] }
      }
    },
    {
      urlPattern: /\/api\/method\/altruishare.*get_dashboard_data.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'dashboard-cache',
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
        cacheableResponse: { statuses: [0, 200] }
      }
    },
    {
      urlPattern: /\/api\/method\/altruishare.*get_impact_analytics.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'impact-analytics',
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 5 },
        cacheableResponse: { statuses: [0, 200] }
      }
    },
    {
      urlPattern: /\/api\/method\/altruishare.*list_notifications.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'notifications-cache',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 2 },
        cacheableResponse: { statuses: [0, 200] }
      }
    },
    {
      urlPattern: ({ request }: { request: Request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
        cacheableResponse: { statuses: [0, 200] }
      }
    }
  ]
})

const nextConfig: NextConfig = {}

export default withPWA(nextConfig)

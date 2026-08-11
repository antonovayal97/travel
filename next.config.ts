import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3101'

const mediaHosts = new Set<string>(['travel.aial-antonov.online', 'localhost', '127.0.0.1'])

try {
  mediaHosts.add(new URL(serverUrl).hostname)
} catch {
  // ignore invalid URL
}

function mediaRemotePatterns(): NonNullable<NextConfig['images']>['remotePatterns'] {
  const patterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: 'picsum.photos',
    },
  ]

  for (const hostname of mediaHosts) {
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      patterns.push({
        protocol: 'http',
        hostname,
        port: '3101',
        pathname: '/api/media/file/**',
      })
      continue
    }

    patterns.push({
      protocol: 'https',
      hostname,
      pathname: '/api/media/file/**',
    })
    patterns.push({
      protocol: 'http',
      hostname,
      pathname: '/api/media/file/**',
    })
  }

  return patterns
}

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns: mediaRemotePatterns(),
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

const withMDX = require('@next/mdx')({
  extension: /\\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  // Static export for GitHub Pages
  output: 'export',

  // Disable image optimization (not compatible with static export)
  images: {
    unoptimized: true,
  },

  // Use trailing slashes for better GitHub Pages compatibility
  trailingSlash: true,
}

module.exports = withMDX(nextConfig)

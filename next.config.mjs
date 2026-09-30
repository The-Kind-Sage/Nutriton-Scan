/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type errors must fail the build — `ignoreBuildErrors: true` was hiding them.
  typescript: { ignoreBuildErrors: false },
  images: { unoptimized: true },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,  // Ensures clean URLs for dynamic routes (e.g., /page/ instead of /page)
  images: { unoptimized: true },  // Required for static export if using Next.js Image component
  // basePath: '/repo-name',  // Uncomment and set to your GitHub repo name if deploying to a subpath (e.g., https://username.github.io/repo-name)
};

module.exports = nextConfig;

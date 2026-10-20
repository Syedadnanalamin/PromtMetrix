/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/prompts",
        destination: "/allpromts",
        permanent: true,
      },
      {
        source: "/categories",
        destination: "/allpromts",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

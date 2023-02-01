/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: {
      displayName: true,
    },
  },
  async redirects() {
    return [
      {
        source: "/callback",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/kalkuliatory/kardygan",
        destination: "/kalkuliatory/kardyhan",
        permanent: true,
      },
      {
        source: "/kalkuliatory/krugove",
        destination: "/kalkuliatory/kruhove",
        permanent: true,
      },
      {
        source: "/blog/yak-rozrahuvaty-rahlan",
        destination: "/blog/yak-rozrahuvaty-rahlan-zverkhu",
        permanent: true,
      },
      {
        source: "/blog/yak-rozrahuvaty-vytratu-pryazhi",
        destination: "/blog/yak-rozrahuvaty-vytratu-pryazhi-na-svetr",
        permanent: true,
      },
    ]
  },
}

export default nextConfig

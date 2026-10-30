/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      // Since 30.10.2026 packages are paid on yarnmk.com.ua (lib/plans.ts, PACKAGE_CHECKOUT_URL); the query
      // (?plan=quarter, utm_*) is passed through. Returns from Hutko for payments started earlier still carry
      // order_id / correlation_id and keep the old /checkout status page.
      {
        source: "/checkout",
        missing: [
          { type: "query", key: "order_id" },
          { type: "query", key: "correlation_id" },
        ],
        destination: "https://yarnmk.com.ua/oplata/pidpyska",
        permanent: false,
      },
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
      {
        source: "/blog/yak-rozrahuvaty-kardyhan",
        destination: "/blog/yak-rozrahuvaty-kardygan-spytsyamy",
        permanent: true,
      },
      {
        source: "/blog/yak-rozrahuvaty-vyazannya-po-kolu",
        destination: "/blog/yak-rozrahuvaty-krugove-vyazannya",
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: [
              '</.well-known/api-catalog>; rel="api-catalog"',
              '</.well-known/ai-catalog.json>; rel="ai-catalog"',
              '</.well-known/agent-skills/index.json>; rel="agent-skills"',
              '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
              '</.well-known/agent-card.json>; rel="agent-card"',
              '</auth.md>; rel="service-doc"',
            ].join(", "),
          },
        ],
      },
      {
        source: "/.well-known/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, HEAD, OPTIONS",
          },
        ],
      },
    ]
  },
}

export default nextConfig

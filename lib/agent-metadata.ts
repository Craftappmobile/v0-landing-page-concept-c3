export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "https://vjazhi.com.ua"

export const skillsIndex = {
  $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  skills: [
    {
      name: "knitting-calculators",
      type: "skill-md",
      description: "Interactive knitting calculators for gauge, raglan top-down, yarn consumption, and stitch counts.",
      url: `${siteUrl}/.well-known/agent-skills/knitting-calculators/SKILL.md`,
      digest: "sha256:3ad51d4920bb1498b914ef60ed072dbad558b183c8180a36f5f4df68fd04e53a",
    },
  ],
}

export const mcpServerCard = {
  serverInfo: {
    name: "vjazhi-mcp-server",
    version: "1.0.0",
    description:
      "Vjazhi knitting calculators MCP server: gauge, yarn consumption and calculator discovery.",
  },
  transport: {
    type: "http",
    endpoint: `${siteUrl}/api/mcp`,
  },
  capabilities: {
    tools: {
      listChanged: false,
    },
    resources: {
      subscribe: false,
      listChanged: false,
    },
    prompts: {
      listChanged: false,
    },
  },
}

export const a2aAgentCard = {
  protocolVersion: "0.3.0",
  name: "Vjazhi Knitting Assistant",
  version: "1.0.0",
  description:
    "Agent that answers knitting questions with Vjazhi calculators: stitch gauge, yarn consumption and calculator discovery.",
  url: `${siteUrl}/api/a2a`,
  preferredTransport: "JSONRPC",
  supportedInterfaces: [
    {
      url: `${siteUrl}/api/a2a`,
      transport: "JSONRPC",
      protocolBinding: "JSONRPC",
      protocolVersion: "0.3.0",
    },
  ],
  capabilities: {
    streaming: false,
    pushNotifications: false,
    stateTransitionHistory: false,
  },
  defaultInputModes: ["text/plain"],
  defaultOutputModes: ["text/plain"],
  skills: [
    {
      id: "calculate-gauge",
      name: "Calculate stitch gauge",
      description:
        "Convert a 10x10 cm swatch into stitches and rows per centimetre, and scale it to target measurements.",
      tags: ["gauge", "swatch", "stitches"],
    },
    {
      id: "estimate-yarn-consumption",
      name: "Estimate yarn consumption",
      description:
        "Estimate yarn usage for a garment type and size using Vjazhi reference tables (meters or grams).",
      tags: ["yarn", "consumption", "meters"],
    },
    {
      id: "search-calculators",
      name: "Find knitting calculators",
      description: "Search the Vjazhi calculator library and return direct links.",
      tags: ["calculators", "search"],
    },
  ],
}

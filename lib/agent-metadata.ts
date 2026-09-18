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

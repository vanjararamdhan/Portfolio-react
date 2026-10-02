/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  // Don't let `next dev` write AGENTS.md / CLAUDE.md into the project.
  agentRules: false,
}

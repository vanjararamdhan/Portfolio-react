/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  // Don't let `next dev` write AGENTS.md / CLAUDE.md into the project.
  agentRules: false,
  // The resume used to live at this path; keep old links (LinkedIn, applications) working.
  async redirects() {
    return [{ source: "/Ramdhan_Vanjara_Resume.pdf", destination: "/Ramdhan-Vanjara-Resume.pdf", permanent: true }];
  },
}

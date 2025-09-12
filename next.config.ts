import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repo = 'online-cv'; // Change if your repo name is different

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // swcMinify is no longer needed in Next.js 13+ (enabled by default)
  output: 'export',
  basePath: isGithubPages ? `/${repo}` : '',
  assetPrefix: isGithubPages ? `/${repo}/` : '',

  // i18n removed: not supported with output: 'export'. Use manual language routing instead.
};

export default nextConfig;

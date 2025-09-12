/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/online-cv' : '',
  assetPrefix: isGithubPages ? '/online-cv/' : '',
};

module.exports = nextConfig;

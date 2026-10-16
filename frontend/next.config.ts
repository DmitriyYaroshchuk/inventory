import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  sassOptions: {
    loadPaths: [path.join(process.cwd(), 'node_modules', 'bootstrap', 'scss')],
    quietDeps: true,
    silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
  },
};

export default nextConfig;
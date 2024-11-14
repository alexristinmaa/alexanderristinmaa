/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  webpack(config, { isServer, dev }) {
    // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true
    };

    config.resolve = {
      extensions: ['.ts', '.tsx', '.wasm', '...'],
    }

    config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/api': 'next/dist/compiled/@opentelemetry/api'
    } 

    config.resolve.fallback = { fs: false };

    patchWasmModuleImport(config, isServer);

    return config;
  }
};


// From https://github.com/vercel/next.js/discussions/35637#discussioncomment-7641310
function patchWasmModuleImport(config, isServer) {
  config.experiments = Object.assign(config.experiments || {}, {
    asyncWebAssembly: true,
  });
  config.module.defaultRules = [
    {
      type: 'javascript/auto',
      resolve: {},
    },
    {
      test: /\.json$/i,
      type: 'json',
    },
  ];
  config.optimization.moduleIds = 'named';

  config.module.rules.push({
    test: /\.wasm$/,
    type: 'asset/resource',
  });
}

export default nextConfig;

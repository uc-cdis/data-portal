const esbuild = require('esbuild');
const path = require('path');

const deps = [
  { name: 'markdown-it', outfile: 'vendor/markdown-it.cjs.js' },
  { name: 'linkify-it', outfile: 'vendor/linkify-it.cjs.js' },
];

deps.forEach(({ name, outfile }) => {
  esbuild.buildSync({
    entryPoints: [require.resolve(name)],
    bundle: true,
    format: 'cjs',
    platform: 'browser',
    outfile: path.resolve(__dirname, '..', outfile),
  });
  console.log(`Bundled ${name} -> ${outfile}`);
});

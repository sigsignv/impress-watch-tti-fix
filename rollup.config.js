import typescript from '@rollup/plugin-typescript'
import metablock from 'rollup-plugin-userscript-metablock'

export default [
  {
    input: 'index.ts',
    output: {
      file: 'impress-watch-sidebar-fix.user.js',
      format: 'iife',
      indent: false,
    },
    plugins: [
      typescript(),
      metablock(),
    ],
  },
]

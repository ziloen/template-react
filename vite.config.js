/// <reference types="vitest" />

import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import browserslist from 'browserslist'
import { Features, browserslistToTargets } from 'lightningcss'
import { execSync } from 'node:child_process'
import { resolve as r } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ command, mode }) => {
  const cwd = process.cwd()

  const IS_DEV = process.env.NODE_ENV === 'development'
  const IS_PROD = !IS_DEV
  const IS_BUILD = command === 'build'

  const target = 'baseline widely available with downstream'

  return {
    base: process.env.BASE_URL || '/',
    resolve: {
      alias: {
        '~': r('src'),
        '~cwd': cwd,
      },
    },

    define: {
      IS_BUILD,
      IS_DEV,
      IS_PROD,
      APP_BUILD_TIME: JSON.stringify(new Date().toISOString()),
      APP_BUILD_COMMIT: JSON.stringify(getCommitHash()),
    },

    plugins: [
      // https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react
      react(),

      // https://github.com/unplugin/unplugin-auto-import
      AutoImport({
        imports: [
          {
            react: [
              'Fragment',
              'Suspense',
              'useCallback',
              'useEffect',
              'useId',
              'useImperativeHandle',
              'useInsertionEffect',
              'useLayoutEffect',
              'useMemo',
              'useRef',
              'useState',
              'useSyncExternalStore',
            ],
            'react-dom': ['createPortal'],
            'react-router': [
              'useLocation',
              'useNavigate',
              'useParams',
              'useRoutes',
              'useSearchParams',
            ],
            'motion/react': ['motion', 'AnimatePresence'],
          },
          {
            from: 'clsx/lite',
            imports: ['clsx'],
            // Manually declare clsx in src/types/modules.d.ts for strict type checking clsx/lite
            dtsDisabled: true,
          },
          {
            type: true,
            from: 'react',
            imports: [
              'ComponentProps',
              'ReactNode',
              'RefCallback',
              'RefObject',
            ],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
      }),

      // https://github.com/Jevon617/unplugin-svg-component
      // unplugin-svg-component infinitely watch reload on dev and throws error on build
      // UnpluginSvgComponent({
      //   iconDir: r('src/assets/svg-icons'),
      //   dts: true,
      //   dtsDir: r('src/types'),
      //   componentStyle: 'width: 1em; height: 1em;',
      //   projectType: 'react',
      // }),

      // https://github.com/unplugin/unplugin-icons
      Icons({
        compiler: 'jsx',
        jsx: 'react',
        scale: 1,
      }),

      tailwindcss(),

      // polyfills
      // https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
      legacy({
        renderLegacyChunks: false,
        targets: target,
        modernTargets: target,
        modernPolyfills: true,
      }),
    ],

    build: {
      // disable inline base64
      assetsInlineLimit: 0,
      cssMinify: 'lightningcss',
      // build.target is overwritten by plugin-legacy modernTargets option
      // target: browserslistToEsbuild(target),
      reportCompressedSize: false,
      // FIXME: esbuild.drop: ['console', 'debugger']
      minify: 'oxc',
      rolldownOptions: {
        optimization: {
          inlineConst: { mode: 'all', pass: 3 },
        },
        output: {
          hashCharacters: 'hex',
        },
      },
    },

    css: {
      transformer: 'lightningcss',
      lightningcss: {
        // https://lightningcss.dev/transpilation.html#feature-flags
        // Always transpile
        include: (Features.Colors ^ Features.LightDark) | Features.Nesting,

        // Never transpile
        exclude:
          Features.LogicalProperties |
          Features.LightDark |
          Features.MediaRangeSyntax,

        targets: browserslistToTargets(browserslist(target)),
      },
      devSourcemap: true,
      modules: {
        generateScopedName: '[hash:hex:8]',
      },
    },

    // https://github.com/vitest-dev/vitest
    test: {
      environment: 'jsdom',
    },

    experimental: {
      // renderBuiltUrl
      enableNativePlugin: true,
    },
  }
})

function getCommitHash() {
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      encoding: 'utf8',
      stdio: 'ignore',
    })
  } catch {
    return ''
  }

  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import browserslist from 'browserslist'
import { Features, browserslistToTargets } from 'lightningcss'
import { execSync } from 'node:child_process'
import { resolve as r } from 'node:path'
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
      tsconfigPaths: false,
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
      // https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing
      tanstackRouter({
        target: 'react',
        routesDirectory: './src/pages',
        generatedRouteTree: './src/routeTree.gen.ts',
        autoCodeSplitting: true,
      }),

      // https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react
      react(),

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
      minify: 'oxc',
      rolldownOptions: {
        experimental: { lazyBarrel: true },
        optimization: { inlineConst: { mode: 'all', pass: 3 } },
        output: { hashCharacters: 'hex' },
        treeshake: { manualPureFunctions: ['console.log', 'console.info'] },
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

    experimental: {
      // renderBuiltUrl
    },

    test: {
      browser: {
        enabled: true,
        ui: false,
        headless: true,
        viewport: {
          width: 1280,
          height: 720,
        },
        provider: playwright(),
        instances: [{ browser: 'chromium' } /* , { browser: 'firefox' } */],
      },
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

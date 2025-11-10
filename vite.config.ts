import { defineConfig } from 'vite'

// Some @vitejs plugins are ESM-only. Dynamically import the plugin so
// Node's CJS loader doesn't try to require() the ESM file and fail.
export default defineConfig(async () => {
  const reactPlugin = (await import('@vitejs/plugin-react')).default
  return {
    plugins: [reactPlugin()],
    server: {
      port: 4000,
    },
  }
})

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL),
      'process.env.CLIENT_KEY_SANDBOX': JSON.stringify(env.CLIENT_KEY_SANDBOX),
      'process.env.SERVER_KEY_SANDBOX': JSON.stringify(env.SERVER_KEY_SANDBOX),
      'MIDTRANS_IS_PRODUCTION': env.MIDTRANS_IS_PRODUCTION,
    },
    server: {
      watch: {
        usePolling: true,
      },
      host: true, // needed for the Docker Container port mapping to work
      strictPort: true,
      port: 5173, // you can replace this port with any port
    }
  }
})

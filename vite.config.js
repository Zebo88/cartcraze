import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://cartcraze.onrender.com/api/products',//added this to use Netlify to connect to the backend hosted on Render.
  plugins: [react()],
})

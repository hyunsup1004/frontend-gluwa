import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        sassOptions: {
          quietDeps: true, // 이 옵션을 추가하면 경고가 무시됩니다.
        },
      },
    },
  },
})

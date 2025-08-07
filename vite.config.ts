import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    hmr: true,   // 启用热更新
    open: true,   // 启动时自动打开浏览器
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:999', // 替换为你的后端服务地址
        changeOrigin: true, // 允许跨域
        // rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      }
    }
  },
  build: {
    outDir: 'dist', // 输出目录
    minify: "esbuild", // 使用 esbuild 进行压缩
    chunkSizeWarningLimit: 1000, // 警告阈值，单位为 KB
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js', // 输出入口文件名
        chunkFileNames: 'assets/js/[name]-[hash].js', // 输出代码块文件名
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]', // 输出静态资源文件名
      }
    }
  },
  esbuild: {
    // drop: ['console', 'debugger'], // 删除 console 和 debugger 语句
    minifyIdentifiers: false, // 压缩标识符
    minifySyntax: false, // 压缩语法
    minifyWhitespace: false, // 压缩空白字符
  },
})

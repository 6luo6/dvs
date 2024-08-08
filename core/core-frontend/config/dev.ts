export default {
  server: {
    proxy: {
      '/api/f': {
        target: 'http://localhost:8100',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/f/, '')
      },
      // 使用 proxy 实例
      '/test': {
        target: 'http://bpaas.funi.com/',
        changeOrigin: true
        // rewrite: path => path.replace(/^\/api/, '/de2api')
      },
      '/api': {
        target: 'http://bpaas.funi.com/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/de2api')
      }
    },
    port: 8080,
    hmr: {
      overlay: false
    }
  }
}

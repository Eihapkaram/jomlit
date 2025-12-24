import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import history from "connect-history-api-fallback";
/*import viteImagemin from "vite-plugin-imagemin";*/

export default defineConfig({
  plugins: [
    vue(),
    {
      name: "spa-fallback",
      configureServer(server) {
        server.middlewares.use(
          history({
            disableDotRule: true,
            htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
            rewrites: [{ from: /\/.*/, to: "/index.html" }],
          })
        );
      },
    },
    /* viteImagemin({
      // تحويل الصور إلى WebP
      webp: {
        quality: 80, // جودة الصورة بعد التحويل (من 0 إلى 100)
      },
      // ضغط الصور الأخرى إن وُجدت
      gifsicle: {
        optimizationLevel: 7,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
    }),*/
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/", // ✅ دي مهمة جدًا — بتخلي المسارات نسبية وصحيحة
  server: {
    host: true,
    port: 8080,
    open: true, // يفتح المتصفح تلقائيًا
  },
});

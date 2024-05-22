import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // server を追加
  // ポートをcloud9が許可するポート
  server: {
    port: 8080,
  },

  plugins: [react()],
});

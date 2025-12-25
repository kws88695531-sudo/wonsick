import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // ✅ 가장 중요: 상대경로로 빌드 (커스텀도메인/프로젝트페이지 모두 대응)
  base: "./",

  build: {
    // ✅ GitHub Pages를 main 브랜치 /docs 로 배포할 거면 docs로 빌드
    outDir: "docs",
    emptyOutDir: true,
  },
});

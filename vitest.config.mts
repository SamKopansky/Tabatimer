import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Load env files
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    test: {
      environment: "node", // Use node environment for server actions
      globals: true,
      env: {
        // Make environment variables available to tests
        NEXT_PUBLIC_SUPABASE_URL:
          env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        RUN_INTEGRATION_TESTS:
          env.RUN_INTEGRATION_TESTS || process.env.RUN_INTEGRATION_TESTS,
      },
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: [
          "node_modules/",
          "src/test/",
          "**/*.config.*",
          "**/*.d.ts",
          "**/types/**",
        ],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

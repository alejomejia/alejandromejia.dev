import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // `next/link` and `next/image` are wrapped by the project's own `Link` and
  // `Image`, which carry the performance defaults; only those wrappers import them.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/link/**", "src/components/ui/image/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "next/link", message: "Use `Link` from `@/components/ui/link`." },
            { name: "next/image", message: "Use `Image` from `@/components/ui/image`." },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored Payload reference monorepo, not our code.
    "payload-3.x/**",
  ]),
]);

export default eslintConfig;

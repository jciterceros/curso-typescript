// @ts-check
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

const vitestGlobals = {
  describe: "readonly",
  it: "readonly",
  expect: "readonly",
  beforeEach: "readonly",
  afterEach: "readonly",
  beforeAll: "readonly",
  afterAll: "readonly",
  vi: "readonly",
  test: "readonly",
  console: "readonly",
};

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  {
    files: ["tests/**"],
    languageOptions: {
      globals: vitestGlobals,
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**"],
  },
);

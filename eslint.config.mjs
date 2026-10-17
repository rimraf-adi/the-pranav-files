import { config } from "@remotion/eslint-config-flat";

export default [
  ...config,
  {
    // Ported HyperFrames themes read loosely-typed DNA params (dna.body / dna.hero / dna.plate are open objects).
    files: ["src/themes/**/*.{ts,tsx}"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
];

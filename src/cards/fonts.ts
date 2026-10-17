// Ported from heygen-com/hyperframes (Apache-2.0), skills/talking-head-recut/assets/fonts + references/styles. Re-implemented for Remotion.
// Upstream ships Caveat / Inter and falls back to ui-serif / ui-monospace; here Google Fonts stand in for the serif + mono stacks.
import { loadFont as inter } from "@remotion/google-fonts/Inter";
import { loadFont as caveat } from "@remotion/google-fonts/Caveat";
import { loadFont as playfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as serif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as mono } from "@remotion/google-fonts/JetBrainsMono";

export const FONT = {
  sans: inter("normal", { weights: ["400", "700", "900"], subsets: ["latin"] }).fontFamily,
  hand: caveat("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily,
  display: playfair("normal", { weights: ["700", "900"], subsets: ["latin"] }).fontFamily,
  serif: serif("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily,
  mono: mono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily,
};
playfair("italic", { weights: ["700", "900"], subsets: ["latin"] });
serif("italic", { weights: ["400"], subsets: ["latin"] });

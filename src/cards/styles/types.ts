import type { Palette } from "../palettes";
import type { CardContent } from "../schema";

export type StyleProps = {
  content: CardContent;
  palette: Palette;
  /** palette.accents[accentIndex] and the next two (wrapping) */
  accent: string;
  accent2: string;
  accent3: string;
  /** pixel size of the card box */
  w: number;
  h: number;
};

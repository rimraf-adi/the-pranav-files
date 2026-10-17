import type React from "react";
import type { CardStyleKey } from "../schema";
import { Academic } from "./academic";
import { Audit } from "./audit";
import { Editorial } from "./editorial";
import { Geom } from "./geom";
import { Media } from "./media";
import { Minimal } from "./minimal";
import { Spotlight } from "./spotlight";
import { Swiss } from "./swiss";
import { Terminal } from "./terminal";
import { Whiteboard } from "./whiteboard";
import { Xhs } from "./xhs";
import type { StyleProps } from "./types";

export const CARD_STYLE_COMPONENTS: Record<CardStyleKey, React.FC<StyleProps>> = {
  academic: Academic, editorial: Editorial, minimal: Minimal, spotlight: Spotlight, geom: Geom,
  whiteboard: Whiteboard, audit: Audit, terminal: Terminal, swiss: Swiss, xhs: Xhs, media: Media,
};
export type { StyleProps };

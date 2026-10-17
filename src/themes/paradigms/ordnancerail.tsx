// Ported from heygen-com/hyperframes (Apache-2.0), skills/embedded-captions/scripts/make-theme.cjs,
// paradigmRail() (ordnance config: uppercase stamp rail). Re-implemented for Remotion.
// Wraps the shared rail paradigm, adding the DNA textTransform (upstream bakes it into the rail CSS).
import React from "react";
import { AbsoluteFill } from "remotion";
import rail from "./rail";
import type { Paradigm, ThemeCtx } from "../types";

const OrdnanceRail: React.FC<ThemeCtx> = (ctx) => {
  const tt = (ctx.dna.body as any).textTransform ?? "uppercase";
  return (
    <AbsoluteFill style={{ textTransform: tt }}>
      <rail.Component {...ctx} />
    </AbsoluteFill>
  );
};

const paradigm: Paradigm = { Component: OrdnanceRail };
export default paradigm;

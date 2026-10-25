import React from "react";
import { Easing, Img, interpolate, random, staticFile } from "remotion";
import { ACCENT, CX, CY, H, INK, SERIF, W } from "./theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const prog = (t: number, a: number, b: number, ease = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], { ...clamp, easing: ease });
/** deterministic hand-drawn wobble */
const wob = (seed: string, i: number, amp: number) => (random(`${seed}-${i}`) - 0.5) * 2 * amp;

export const Fill: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, ...style }}>{children}</div>
);

/** the pointer that rides along every image: a rounded up-triangle (profit tick). shape "dot" for punctuation. */
export const Dot: React.FC<{ x: number; y: number; r?: number; color?: string; opacity?: number; shape?: "tri" | "dot" }> = ({ x, y, r = 14, color = ACCENT, opacity = 1, shape = "tri" }) =>
  shape === "dot" ? (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: color, opacity }} />
  ) : (
    <svg width={r * 3} height={r * 3} viewBox="-15 -15 30 30" style={{ position: "absolute", left: x - r * 1.5, top: y - r * 1.5, opacity, overflow: "visible" }}>
      <path d="M0,-12 L11,9 L-11,9 Z" fill={color} stroke={color} strokeWidth={4} strokeLinejoin="round" />
    </svg>
  );

/** A hand-drawn ink arc/ring. a0/a1 in degrees (0 = top, clockwise). */
export const InkArc: React.FC<{ cx?: number; cy?: number; r: number; a0?: number; a1?: number; p?: number; width?: number; seed?: string; color?: string; dot?: boolean }> = ({
  cx = CX, cy = CY, r, a0 = 0, a1 = 360, p = 1, width = 12, seed = "arc", color = INK, dot = false,
}) => {
  const pts = React.useMemo(() => {
    const n = Math.max(24, Math.round(Math.abs(a1 - a0) / 5));
    return Array.from({ length: n + 1 }, (_, i) => {
      const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
      const rr = r * (1 + wob(seed, i, 0.012));
      return [cx + rr * Math.sin(a), cy - rr * Math.cos(a)];
    });
  }, [cx, cy, r, a0, a1, seed]);
  const d = "M" + pts.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" L");
  const len = Math.abs(((a1 - a0) * Math.PI * r) / 180) * 1.02;
  return (
    <Fill>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      </svg>
      {dot ? <Dot x={pts[0][0]} y={pts[0][1]} r={12} /> : null}
    </Fill>
  );
};

/** Engraving image, greyscale, multiplied onto the white page. */
export const Eng: React.FC<{ src: string; x?: number; y?: number; w: number; rot?: number; scale?: number; opacity?: number; circle?: boolean; focus?: string; h?: number; blur?: number; contrast?: number }> = ({
  src, x = CX, y = CY, w, rot = 0, scale = 1, opacity = 1, circle = false, focus = "50% 50%", h, blur = 0, contrast = 1.18,
}) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - (h ?? w) / 2, width: w, height: h ?? (circle ? w : "auto"), transform: `rotate(${rot}deg) scale(${scale})`, opacity, borderRadius: circle ? "50%" : 0, overflow: "hidden" }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: circle || h ? "100%" : "auto", objectFit: "cover", objectPosition: focus, display: "block", mixBlendMode: "multiply", filter: `grayscale(1) contrast(${contrast}) brightness(1.05) blur(${blur}px)` }} />
  </div>
);

export const Word: React.FC<{ children: React.ReactNode; x?: number; y?: number; size: number; weight?: number; color?: string; style?: React.CSSProperties; spacing?: string }> = ({
  children, x = CX, y = CY, size, weight = 600, color = INK, style, spacing = "-0.02em",
}) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", fontFamily: SERIF, fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: spacing, color, whiteSpace: "pre", ...style }}>{children}</div>
);

/** Terracotta candlestick mark (the brand mark of this film). `h` = total height. */
export const Mark: React.FC<{ x: number; y: number; h: number; color?: string; p?: number; seed?: string }> = ({ x, y, h, color = ACCENT, p = 1, seed = "mark" }) => {
  const bw = h * 0.42, bh = h * 0.5, wick = h * 0.1;
  const wob2 = (i: number) => wob(seed, i, h * 0.012);
  const path = `M${-bw / 2 + wob2(0)},${-bh / 2 + wob2(1)} L${bw / 2 + wob2(2)},${-bh / 2 + wob2(3)} L${bw / 2 + wob2(4)},${bh / 2 + wob2(5)} L${-bw / 2 + wob2(6)},${bh / 2 + wob2(7)} Z`;
  return (
    <svg width={h} height={h} viewBox={`${-h / 2} ${-h / 2} ${h} ${h}`} style={{ position: "absolute", left: x - h / 2, top: y - h / 2, overflow: "visible" }}>
      <defs>
        <filter id={`rough-${seed}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={Math.max(2, h * 0.025)} />
        </filter>
      </defs>
      <g filter={`url(#rough-${seed})`}>
      <rect x={-wick / 2} y={-h / 2} width={wick} height={h * p} rx={wick / 2} fill={color} />
      <g style={{ opacity: p > 0.35 ? 1 : 0 }} transform={`scale(${Math.min(1, Math.max(0, (p - 0.35) / 0.4))}, 1)`}>
        <path d={path} fill={color} stroke={color} strokeWidth={h * 0.03} strokeLinejoin="round" />
      </g>
      </g>
    </svg>
  );
};

/** fake-extruded 3D candle: stacked layers in CSS 3D, tilts with `rot` degrees */
export const Candle3D: React.FC<{ rotY: number; rotX: number; scale: number; y?: number }> = ({ rotY, rotX, scale, y = CY }) => {
  const layers = 16, depth = 5;
  return (
    <div style={{ position: "absolute", left: CX, top: y, width: 0, height: 0, perspective: 1600 }}>
      <div style={{ position: "absolute", left: -260, top: 330 * scale, width: 520, height: 60, borderRadius: "50%", background: "radial-gradient(rgba(0,0,0,0.16), rgba(0,0,0,0))", transform: `scale(${scale})` }} />
      <div style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", transform: `scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)` }}>
        {Array.from({ length: layers }, (_, i) => {
          const z = (i - layers / 2) * depth;
          const shade = 0.55 + (0.45 * i) / (layers - 1);
          return (
            <div key={i} style={{ position: "absolute", left: -200, top: -300, transform: `translateZ(${z}px)`, filter: `brightness(${shade})` }}>
              <Mark x={200} y={300} h={600} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

type Candle = { o: number; c: number; hi: number; lo: number };
const candles = (seed: string, n: number, drift = 0): Candle[] => {
  let p = 50;
  return Array.from({ length: n }, (_, i) => {
    const o = p;
    const c = o + (random(`${seed}-c${i}`) - 0.5 + drift) * 14;
    p = c;
    return { o, c, hi: Math.max(o, c) + random(`${seed}-h${i}`) * 5, lo: Math.min(o, c) - random(`${seed}-l${i}`) * 5 };
  });
};

/** ring of candlesticks on a pale disc, rotating (stand-in for the galloping-riders ring) */
export const CandleRing: React.FC<{ t: number; r?: number; n?: number; spin?: number; scale?: number }> = ({ t, r = 250, n = 16, spin = 38, scale = 1 }) => {
  const cs = React.useMemo(() => candles("ring", n, 0.05), [n]);
  const lo = Math.min(...cs.map((c) => c.lo)), hi = Math.max(...cs.map((c) => c.hi));
  const u = (v: number) => ((v - lo) / (hi - lo)) * 200;
  return (
    <Fill style={{ transform: `scale(${scale})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: CX - r - 230, top: CY - r - 230, width: (r + 230) * 2, height: (r + 230) * 2, borderRadius: "50%", background: "#ECEFF1" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(${CX},${CY}) rotate(${t * spin})`}>
          {cs.map((c, i) => {
            const a = (360 / n) * i;
            const up = c.c >= c.o;
            return (
              <g key={i} transform={`rotate(${a}) translate(0,${-r})`}>
                <line x1={0} x2={0} y1={-u(c.hi)} y2={-u(c.lo)} stroke={INK} strokeWidth={8} />
                <rect x={-30} y={-Math.max(u(c.o), u(c.c))} width={60} height={Math.max(10, Math.abs(u(c.c) - u(c.o)))} fill={up ? INK : "#FFFFFF"} stroke={INK} strokeWidth={7} />
              </g>
            );
          })}
        </g>
      </svg>
      <Dot x={CX} y={CY} r={11} />
    </Fill>
  );
};

/** a small ink price chart (random walk) */
export const MiniChart: React.FC<{ seed: string; x: number; y: number; w: number; h: number; p?: number; trend?: number; dot?: boolean; width?: number; color?: string }> = ({ seed, x, y, w, h, p = 1, trend = 0, dot = false, width = 3, color = INK }) => {
  const n = 30;
  const pts = React.useMemo(() => {
    let v = 0;
    return Array.from({ length: n }, (_, i) => {
      v += (random(`${seed}-${i}`) - 0.5 + trend) * 1.2;
      return v;
    });
  }, [seed, trend]);
  const lo = Math.min(...pts), hi = Math.max(...pts);
  const X = (i: number) => x - w / 2 + (w * i) / (n - 1);
  const Y = (v: number) => y + h / 2 - ((v - lo) / (hi - lo || 1)) * h;
  const d = "M" + pts.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" L");
  const len = w * 3;
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      </svg>
      {dot && p > 0.95 ? <Dot x={X(n - 1)} y={Y(pts[n - 1])} r={Math.max(6, width * 2.6)} /> : null}
    </>
  );
};

/** "constellation": scattered ink dots joined into a price line, one terracotta segment */
export const Constellation: React.FC<{ t: number }> = ({ t }) => {
  const dots = React.useMemo(() => Array.from({ length: 260 }, (_, i) => ({ x: random(`sx${i}`) * W, y: random(`sy${i}`) * H, r: 1 + random(`sr${i}`) ** 3 * 6 })), []);
  const line = [[560, 330], [800, 620], [960, 500], [1180, 760], [1380, 600]];
  const d = "M" + line.map((q) => q.join(",")).join(" L");
  const p = prog(t, 0, 0.18);
  return (
    <Fill>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {dots.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r={q.r} fill={INK} />)}
        <path d={d} fill="none" stroke={INK} strokeWidth={4} strokeDasharray={1200} strokeDashoffset={1200 * (1 - p)} />
        {line.map((q, i) => <circle key={`n${i}`} cx={q[0]} cy={q[1]} r={9} fill={INK} />)}
        <line x1={line[1][0]} y1={line[1][1]} x2={line[2][0]} y2={line[2][1]} stroke={ACCENT} strokeWidth={16} strokeLinecap="round" opacity={p > 0.5 ? 1 : 0} />
      </svg>
    </Fill>
  );
};

/** jagged crash line drawn left to right with a terracotta end dot */
export const CrashLine: React.FC<{ p: number; up?: boolean; variant?: number }> = ({ p, up = true, variant = 0 }) => {
  const base = variant ? [[380, 800], [560, 700], [700, 740], [900, 540], [1040, 600], [1240, 380], [1400, 430], [1560, 250]] : [[420, 820], [600, 720], [720, 780], [880, 600], [1020, 660], [1160, 500], [1300, 540], [1440, 360], [1600, 260]];
  const pts = up ? base : base.map(([a, b]) => [a, 1080 - b]);
  const d = "M" + pts.map((q) => q.join(",")).join(" L");
  const last = pts[pts.length - 1];
  return (
    <Fill>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={d} fill="none" stroke={up ? ACCENT : INK} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={1500} strokeDashoffset={1500 * (1 - p)} />
      </svg>
      {p > 0.98 ? <Dot x={last[0]} y={last[1] - 10} r={20} /> : null}
    </Fill>
  );
};

/** an ink hourglass; `p` = fraction of sand fallen */
export const Hourglass: React.FC<{ p: number; scale?: number; x?: number; y?: number }> = ({ p, scale = 1, x = CX, y = CY }) => (
  <svg width={600} height={900} viewBox="-300 -450 600 900" style={{ position: "absolute", left: x - 300, top: y - 450, transform: `scale(${scale})`, overflow: "visible" }}>
    <g fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M-170,-380 L170,-380 M-170,380 L170,380" />
      <path d="M-140,-380 C-140,-190 -20,-90 -12,0 C-20,90 -140,190 -140,380 M140,-380 C140,-190 20,-90 12,0 C20,90 140,190 140,380" />
    </g>
    <path d={`M${-120 + 100 * p},${-330 + 220 * p} C-80,-230 -20,-120 -10,-30 L10,-30 C20,-120 80,-230 ${120 - 100 * p},${-330 + 220 * p} Z`} fill={INK} opacity={1 - p * 0.9} />
    <path d={`M0,${340 - 190 * p} L${-120 * p - 20},340 L${120 * p + 20},340 Z`} fill={INK} />
    <circle cx={0} cy={0} r={12} fill={ACCENT} />
  </svg>
);

/** ruled ledger page with columns of figures; ring on one line, green checks verify the rows */
export const Ledger: React.FC<{ t: number; scale?: number; ring?: number }> = ({ t, scale = 1, ring = 0 }) => {
  const rows = 12, px = CX - 640, py = 70, pw = 1280, ph = 940, step = 66, top = py + 70;
  return (
    <Fill style={{ transform: `scale(${scale})`, transformOrigin: "50% 50%" }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={px} y={py} width={pw} height={ph} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        {[px + 400, px + 660, px + 920].map((x, i) => <line key={i} x1={x} x2={x} y1={py} y2={py + ph} stroke={INK} strokeWidth={3} opacity={0.7} />)}
        {Array.from({ length: rows }, (_, i) => {
          const y = top + i * step;
          const shown = prog(t, i * 0.01, i * 0.01 + 0.15);
          const ck = prog(t, 0.12 + i * 0.015, 0.2 + i * 0.015) * (i % 3 === 2 ? 0 : 1);
          return (
            <g key={i} opacity={shown}>
              <line x1={px} x2={px + pw} y1={y + 24} y2={y + 24} stroke="#9AA0A3" strokeWidth={2} />
              <rect x={px + 36} y={y - 8} width={180 + random(`lw${i}`) * 150} height={10} fill={INK} opacity={0.55} />
              {[0, 1, 2].map((c) => (
                <text key={c} x={px + 590 + c * 260} y={y + 14} fontFamily={SERIF} fontSize={38} textAnchor="end" fill={INK}>
                  {String(Math.round(random(`n${i}-${c}`) * 8900 + 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </text>
              ))}
              <path d={`M${px + 1180},${y + 4} l14,17 l32,-40`} fill="none" stroke={ACCENT} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - ck)} />
            </g>
          );
        })}
        <ellipse cx={px + 520} cy={top + 5 * step + 8} rx={150 * ring} ry={40} fill="none" stroke={INK} strokeWidth={6} />
      </svg>
    </Fill>
  );
};

/** thin construction diagram of a letter (square, circle, diagonals) around a big glyph */
export const LetterConstruction: React.FC<{ letter: string; t: number }> = ({ letter, t }) => {
  const p = prog(t, 0, 0.12);
  const L = CX - 340, R = CX + 340, T = CY - 360, B = CY + 320;
  return (
    <Fill>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <g fill="none" stroke={INK} strokeWidth={3} opacity={p}>
          <rect x={L} y={T} width={680} height={680} />
          <circle cx={CX} cy={CY - 20} r={340} />
          <line x1={L} y1={T} x2={R} y2={B} />
          <line x1={R} y1={T} x2={L} y2={B} />
          <line x1={CX} y1={T} x2={CX} y2={B} />
          <line x1={L} y1={CY - 20} x2={R} y2={CY - 20} />
          <circle cx={CX} cy={T - 40} r={36} />
          <path d={`M${CX - 90},${T + 10} C${CX - 160},${T - 20} ${CX - 210},${T - 60} ${CX - 250},${T - 110}`} />
        </g>
      </svg>
      <Word x={CX} y={CY + 20} size={760} weight={800} style={{ opacity: Math.min(1, p * 3) }}>{letter}</Word>
      <Dot x={CX} y={CY - 20} r={9} />
    </Fill>
  );
};

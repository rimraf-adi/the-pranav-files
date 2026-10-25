import React from "react";
import { z } from "zod";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { ACCENT, CX, CY, GRID, H, INK, PAPER, SERIF, W } from "./theme";
import { Candle3D, CandleRing, Constellation, CrashLine, Dot, Eng, Fill, Hourglass, InkArc, Ledger, LetterConstruction, MiniChart, Mark, Word, clamp, prog } from "./primitives";

/**
 * 16:9 intro film in the style of the reference (docs/references/engraving-film.md), written for a market educator.
 * Pure function of the frame. Cuts sit on a 0.1 s grid like the original; times below are seconds.
 */
export const filmSchema = z.object({
  name: z.string().default("Better Call PJ"),
  tagline: z.array(z.string()).length(2).default(["Sound knowledge,", "steady profit."]),
});
export type FilmProps = z.infer<typeof filmSchema>;

loadFont("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
loadFont("italic", { weights: ["400", "500"], subsets: ["latin"] });
loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

const P = "projects/engraving-film/assets/photos/";
const img = (n: string) => `${P}${n}.jpg`;

/** green needle on a compass: points to the rising profit line */
const Needle: React.FC<{ t: number; r?: number }> = ({ t, r = 330 }) => {
  const a = interpolate(t, [0, 0.12], [-70, 38], clamp);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(${CX},${CY}) rotate(${a})`}>
        <path d={`M0,${-r} L22,0 L0,${r * 0.35} L-22,0 Z`} fill={ACCENT} />
      </g>
      <circle cx={CX} cy={CY} r={16} fill={INK} />
    </svg>
  );
};

/** the black ink arc + green pointer that rides along every montage image */
const Pointer: React.FC<{ a0?: number; a1?: number; r?: number }> = ({ a0 = -70, a1 = 80, r = 400 }) => <InkArc r={r} a0={a0} a1={a1} width={11} seed="ptr" dot />;

const Lockup: React.FC<{ markX?: number; wipe?: number; markH?: number; name: string; opacity?: number }> = ({ markX, wipe = 1, markH = 280, name, opacity = 1 }) => {
  const size = 190;
  const textW = name.length * size * 0.41;
  const total = textW + markH * 0.42 + 56;
  const left = CX - total / 2;
  return (
    <Fill style={{ opacity }}>
      <Mark x={markX ?? left + markH * 0.21} y={CY - 8} h={markH} />
      <div style={{ position: "absolute", left: left + markH * 0.42 + 56, top: CY - size * 0.58, fontFamily: SERIF, fontWeight: 600, fontSize: size, letterSpacing: "-0.02em", color: INK, whiteSpace: "pre", clipPath: `inset(-10px ${(1 - wipe) * 100}% -10px 0)` }}>{name}</div>
    </Fill>
  );
};

/** '?' / '!' glyph with the green dot as its period */
const Punct: React.FC<{ ch: "?" | "!"; size: number; y?: number }> = ({ ch, size, y = 420 }) => (
  <Fill>
    <div style={{ position: "absolute", left: CX - size * 0.3, top: y - size * 0.62, width: size * 0.6, height: size * (ch === "?" ? 0.66 : 0.7), overflow: "hidden", fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1, textAlign: "center", color: INK }}>
      <div style={{ width: size * 0.6 }}>{ch}</div>
    </div>
    <Dot x={CX} y={y + size * 0.3} r={size * 0.07} shape="dot" />
  </Fill>
);

const Guides: React.FC<{ y: number; n?: number; gap?: number }> = ({ y, n = 5, gap = 78 }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
    {Array.from({ length: n }, (_, i) => <line key={i} x1={0} x2={W} y1={y + (i - 2) * gap} y2={y + (i - 2) * gap} stroke="#A9AEB0" strokeWidth={2} />)}
  </svg>
);

const Spiral: React.FC<{ p: number }> = ({ p }) => {
  const pts = Array.from({ length: 160 }, (_, i) => {
    const a = (i / 160) * Math.PI * 7;
    const r = 8 + a * 21;
    return [CX + r * Math.sin(a), CY - r * Math.cos(a)];
  });
  const d = "M" + pts.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" L");
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={d} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeDasharray={2600} strokeDashoffset={2600 * (1 - p)} />
    </svg>
  );
};

/** chart grid used for the "pick one" beat: 10 x 5 mini charts */
const ChartGrid: React.FC<{ ring?: number; sel?: number }> = ({ ring = 0, sel = 23 }) => {
  const pos = (i: number) => ({ x: 150 + (i % 10) * 180, y: 160 + Math.floor(i / 10) * 190 });
  const s = pos(sel);
  return (
    <>
      {Array.from({ length: 50 }, (_, i) => {
        const q = pos(i);
        return <MiniChart key={i} seed={`g${i}`} x={q.x} y={q.y} w={130} h={84} width={3} trend={i === sel ? 0.2 : 0} color={i === sel && ring > 0.9 ? ACCENT : INK} />;
      })}
      {ring > 0 ? <InkArc cx={s.x} cy={s.y} r={112} p={ring} width={7} /> : null}
    </>
  );
};

export const EngravingFilm: React.FC<FilmProps> = (raw) => {
  const props = filmSchema.parse(raw);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tq = Math.floor(t * 10 + 1e-6) / 10; // montage cuts on the 0.1 s grid
  const lt = (a: number) => t - a; // local time
  let body: React.ReactNode = null;

  if (tq < 0.3) body = <Lockup name={props.name} />;
  else if (tq < 0.5) body = tq >= 0.4 ? <Dot x={CX} y={CY} r={5} /> : null;
  else if (tq < 0.6) body = <Punct ch="?" size={900} />;
  else if (tq < 0.7) body = <Punct ch="!" size={900} />;
  else if (tq < 0.8) body = <InkArc r={430} a0={-40} a1={220} p={prog(lt(0.7), 0, 0.1)} width={18} seed="r1" />;
  else if (tq < 1.4) {
    const cells = ["tulip", "compass", "ammonite1", "chart", "beurs", "justice"];
    const i = Math.round((tq - 0.8) * 10);
    const c = cells[i];
    body = (
      <>
        {c === "chart" ? <Fill><div style={{ position: "absolute", left: CX - 410, top: CY - 410, width: 820, height: 820, borderRadius: "50%", background: "#F2F3F4" }} /><MiniChart seed="ringchart" x={CX} y={CY} w={600} h={360} width={11} trend={0.14} color={ACCENT} dot /></Fill> : <Eng src={img(c)} w={820} circle focus={c === "justice" ? "50% 62%" : c === "tulip" ? "50% 40%" : "50% 50%"} />}
        {c === "compass" ? <Needle t={lt(0.9)} r={280} /> : i >= 2 && i <= 3 ? <Mark x={CX} y={CY} h={200} /> : null}
        <InkArc r={420} a0={0} a1={360} width={18} seed={`ring${i}`} />
      </>
    );
  } else if (tq < 1.6) {
    body = (
      <>
        <Hourglass p={prog(lt(1.4), 0, 0.3, Easing.linear)} scale={tq < 1.5 ? 1.0 : 0.9} />
        <Pointer />
      </>
    );
  } else if (tq < 1.8) {
    body = tq < 1.7 ? <Hourglass p={0.9} scale={0.7} /> : <InkArc r={150} a0={-80} a1={20} cx={CX - 330} cy={CY - 20} p={prog(lt(1.7), 0, 0.1)} width={12} color={ACCENT} seed="s1" />;
  } else if (tq < 2.4) {
    const q = Math.round((tq - 1.8) * 10);
    const imgs = q >= 2;
    body = (
      <>
        <Word x={CX - 90} size={400} weight={700}>ask</Word>
        {q >= 1 ? <Word x={CX + 250} y={CY - 10} size={400} weight={600} color={ACCENT} style={{ opacity: q >= 2 ? 1 : 0.6 }}>{q >= 4 ? "!" : "?"}</Word> : null}
        {imgs ? <Eng src={img("tulip")} x={560} y={210} w={230} h={320} scale={prog(lt(2.0), 0, 0.12)} /> : null}
        {imgs ? <Eng src={img("ship-map")} x={1400} y={230} w={460} h={300} scale={prog(lt(2.0), 0, 0.12)} /> : null}
        {q >= 2 ? <Eng src={img("compass")} x={620} y={850} w={340} circle scale={prog(lt(2.0), 0, 0.12)} /> : null}
        {q >= 3 ? <Eng src={img("beurs")} x={1340} y={850} w={520} h={300} scale={prog(lt(2.2), 0, 0.12)} /> : null}
        {q >= 5 ? <InkArc r={110} a0={-90} a1={10} cx={CX - 560} cy={CY} width={9} color={ACCENT} seed="s2" /> : null}
      </>
    );
  } else if (tq < 3.0) {
    // sell -> tell
    const slash = prog(lt(2.7), 0, 0.12);
    const landed = tq >= 2.9;
    body = (
      <>
        {tq >= 2.5 ? <Eng src={img("beurs")} x={CX + 40} y={870} w={640} h={340} /> : null}
        {tq >= 2.6 ? <Eng src={img("wallstreet")} x={1480} y={250} w={440} h={290} /> : null}
        {tq >= 2.7 ? <Eng src={img("justice")} x={420} y={250} w={260} h={360} focus="50% 55%" /> : null}
        <Word x={CX} size={440} weight={700}>
          {landed ? <><span style={{ color: ACCENT }}>t</span>ell</> : "sell"}
        </Word>
        {tq >= 2.7 && !landed ? (
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={600} y1={600} x2={600 + 270 * slash} y2={600 - 80 * slash} stroke={ACCENT} strokeWidth={22} strokeLinecap="round" />
          </svg>
        ) : null}
        {landed ? <Dot x={CX - 300} y={CY - 210} r={12} /> : null}
      </>
    );
  } else if (tq < 3.2) {
    const k = tq >= 3.1;
    body = (
      <>
        <Eng src={img("calligraphy")} x={CX} y={CY} w={k ? 2600 : 1500} h={k ? 1650 : 950} focus="35% 40%" contrast={1.3} />
        <InkArc r={k ? 240 : 120} cx={k ? 700 : 770} cy={k ? 480 : 470} width={k ? 16 : 10} color={ACCENT} p={prog(lt(3.0), 0, 0.12)} seed="cal" />
      </>
    );
  } else if (tq < 3.7) {
    const q = Math.round((tq - 3.2) * 10);
    if (q <= 1) {
      const zoom = interpolate(lt(3.2), [0, 0.2], [1.7, 1], clamp);
      body = (
        <Fill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 50%" }}>
          <ChartGrid />
        </Fill>
      );
    } else if (q === 2) {
      body = <ChartGrid ring={prog(lt(3.4), 0, 0.1)} />;
    } else {
      body = (
        <>
          <MiniChart seed="g21" x={CX} y={CY} w={640} h={380} width={13} trend={0.22} color={ACCENT} p={prog(lt(3.5), 0, 0.15)} dot />
          <InkArc r={420} width={9} seed="g-ring" />
        </>
      );
    }
  } else if (tq < 4.1) {
    body = <CandleRing t={lt(3.7)} />;
  } else if (tq < 4.2) {
    body = <><Mark x={CX} y={CY} h={650} color={INK} /><Dot x={CX} y={CY} r={14} /></>;
  } else if (tq < 4.3) {
    body = <><Eng src={img("bull")} w={1300} h={925} focus="45% 55%" /><InkArc cx={1090} cy={400} r={100} width={8} /></>;
  } else if (tq < 4.4) {
    body = <><Eng src={img("justice")} w={680} h={940} focus="50% 62%" /><InkArc cx={1090} cy={680} r={110} width={8} /></>;
  } else if (tq < 4.5) {
    body = <Hourglass p={prog(lt(4.4), 0, 0.12, Easing.linear)} scale={1.0} />;
  } else if (tq < 4.8) {
    body = <><Ledger t={lt(4.5)} ring={prog(lt(4.5), 0, 0.25)} /><Guides y={CY} n={6} gap={170} /></>;
  } else if (tq < 5.1) {
    body = <Ledger t={9} scale={tq < 4.9 ? 1.25 : 1.0} ring={1} />;
  } else if (tq < 5.9) {
    const q = Math.round((tq - 5.1) * 10);
    const slash = q >= 1 && q <= 3;
    body = (
      <>
        <Guides y={CY + 14} n={5} gap={92} />
        <Word x={CX - (q >= 3 && q <= 4 ? 80 : 0)} size={430} weight={700}>
          {q <= 1 ? "chase" : q <= 4 ? <>cha<span style={{ color: ACCENT, opacity: 0.0 }}>rt</span></> : <>cha<span style={{ color: ACCENT }}>rt</span></>}
        </Word>
        {q <= 4 && slash ? <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}><line x1={1130} y1={640} x2={1130 + 380 * prog(lt(5.2), 0, 0.15)} y2={640 - 110 * prog(lt(5.2), 0, 0.15)} stroke={ACCENT} strokeWidth={24} strokeLinecap="round" /></svg> : null}
        {q >= 2 && q <= 4 ? <Word x={CX + 280} y={CY - 280} size={100} weight={400} style={{ fontStyle: "italic" }}>rt</Word> : null}
        {q >= 5 && q <= 6 ? <Word x={CX + 320} y={CY - 280} size={100} weight={400} style={{ fontStyle: "italic", opacity: 0.5 }}>rt</Word> : null}
        {q === 4 ? <Dot x={CX + 330} y={CY + 250} r={12} /> : null}
      </>
    );
  } else if (tq < 6.0) {
    body = <Word size={560} weight={700} style={{ filter: "blur(6px)" }}>chart</Word>;
  } else if (tq < 6.1) {
    body = <LetterConstruction letter="P" t={lt(6.0)} />;
  } else if (tq < 6.2) {
    body = <LetterConstruction letter="J" t={lt(6.1)} />;
  } else if (tq < 6.3) {
    body = (
      <>
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <g fill="none" stroke={INK} strokeWidth={3}>
            <rect x={CX - 120} y={CY - 210} width={240} height={420} />
            <line x1={CX} y1={CY - 480} x2={CX} y2={CY + 480} />
            <circle cx={CX} cy={CY} r={380} />
            <line x1={CX - 560} y1={CY} x2={CX + 560} y2={CY} />
          </g>
        </svg>
        <Dot x={CX} y={CY} r={9} />
      </>
    );
  } else if (tq < 6.5) {
    body = <Mark x={CX} y={CY} h={760} p={prog(lt(6.3), 0, 0.1)} />;
  } else if (tq < 6.6) {
    body = <Mark x={CX} y={CY} h={230} />;
  } else if (tq < 7.0) {
    body = <Candle3D rotY={interpolate(lt(6.6), [0, 0.4], [-35, 25])} rotX={interpolate(lt(6.6), [0, 0.4], [10, -12])} scale={0.8} />;
  } else if (tq < 7.1) {
    body = <Mark x={CX} y={CY} h={90} />;
  } else if (tq < 7.4) {
    body = <><Eng src={img("ammonite2")} w={980} circle scale={interpolate(lt(7.1), [0, 0.3], [0.9, 1.05], clamp)} /><Mark x={CX - 30} y={CY + 10} h={150} /></>;
  } else if (tq < 7.6) {
    body = <><Eng src={img("tulip")} w={660} h={980} focus="50% 40%" /><Mark x={CX + 20} y={CY - 240} h={90} /></>;
  } else if (tq < 7.8) {
    body = <><Eng src={img("compass")} w={900} circle /><Needle t={lt(7.6)} /></>;
  } else if (tq < 8.1) {
    body = <><Hourglass p={prog(lt(7.8), 0, 0.3, Easing.linear)} scale={1.0} /><InkArc cx={CX} cy={H - 140} r={110} a0={-90} a1={90} width={6} /></>;
  } else if (tq < 8.3) {
    body = <Constellation t={lt(8.1)} />;
  } else if (tq < 9.6) {
    const q = Math.round((tq - 8.3) * 10);
    const seq: React.ReactNode[] = [
      <Hourglass key="h" p={0.35} scale={1.0} />, <Eng key="t" src={img("tulip")} w={660} h={980} focus="50% 40%" />, <Eng key="c" src={img("compass")} w={900} circle />, <Eng key="c2" src={img("compass")} w={1000} circle rot={20} />,
      <Eng key="b" src={img("bull")} w={1300} h={925} focus="45% 55%" />, <CrashLine key="cl" variant={0} p={prog(lt(8.8), 0, 0.1, Easing.linear)} />,
      <MiniChart key="mc" seed="web" x={CX} y={CY} w={1100} h={520} width={9} trend={0.1} dot />, <CrashLine key="cl2" variant={1} p={1} />, <Eng key="a" src={img("ammonite1")} w={900} circle />,
      <Eng key="s" src={img("ship-map")} w={1400} h={935} />, <Eng key="be" src={img("beurs")} w={1500} h={875} />, <Eng key="w" src={img("wallstreet")} w={1400} h={920} />, <Eng key="w2" src={img("wallstreet")} w={1500} h={985} rot={-3} />,
    ];
    body = <>{seq[Math.min(q, seq.length - 1)]}<Pointer a0={-60} a1={90} r={400 + (q % 3) * 30} /></>;
  } else if (tq < 10.4) {
    const q = Math.round((tq - 9.6) * 10);
    const fills: React.ReactNode[] = [
      <Eng key="1" src={img("ship-map")} w={680} h={450} />, <Eng key="2" src={img("calligraphy")} w={680} h={430} focus="30% 40%" />, <Eng key="3" src={img("compass")} w={560} circle />, <Ledger key="4" t={9} scale={0.5} ring={1} />,
      <Eng key="5" src={img("justice")} w={440} h={620} focus="50% 60%" />, <Word key="6" size={560} weight={800}>P</Word>, <Eng key="7" src={img("bull")} w={680} h={480} focus="45% 55%" />, <Eng key="8" src={img("beurs")} w={720} h={420} />,
    ];
    body = <>{fills[Math.min(q, 7)]}<InkArc r={400} a0={40} a1={330} p={prog(lt(9.6), 0, 0.12)} width={7} seed="C" dot /></>;
  } else if (tq < 10.6) {
    body = <><Spiral p={prog(lt(10.4), 0, 0.12)} />{tq >= 10.5 ? <Eng src={img("ammonite1")} w={760} circle /> : null}<Dot x={CX} y={CY} r={10} /></>;
  } else if (tq < 10.7) body = <Dot x={CX} y={CY} r={14} />;
  else if (tq < 10.8) body = <Mark x={CX} y={CY} h={100} />;
  else if (tq < 11.1) {
    const q = Math.round((tq - 10.8) * 10);
    const wt = [500, 700, 900][q] ?? 900;
    body = (
      <>
        <Word x={CX} y={CY - 200} size={430} weight={wt}>pro</Word>
        <Word x={CX} y={CY + 190} size={430} weight={wt}>fit</Word>
        <Dot x={CX + 330} y={CY + 330} r={14 + q * 7} />
      </>
    );
  } else if (tq < 11.2) body = <Dot x={CX + 40} y={CY - 70} r={6} />;
  else if (tq < 12.1) {
    const type = (s: string, a: number, per: number) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - a) / per) + 1)));
    const k = props.tagline[0], l = props.tagline[1];
    const sc = interpolate(t, [11.2, 12.1], [1, 1.04], clamp);
    body = (
      <Fill style={{ transform: `scale(${sc})`, transformOrigin: "50% 50%" }}>
        <Word x={CX} y={CY - 100} size={160} weight={600}>{type(k, 11.2, 0.035)}</Word>
        <Word x={CX} y={CY + 85} size={160} weight={600}>
          {type(l.replace(/\.$/, ""), 11.55, 0.035)}
          {t > 12.0 ? <span style={{ color: ACCENT }}>.</span> : null}
        </Word>
      </Fill>
    );
  } else if (tq < 12.9) {
    body = <Mark x={CX} y={CY} h={460} p={prog(lt(12.1), 0, 0.6, Easing.inOut(Easing.cubic))} seed="bloom" />;
  } else if (tq < 13.6) {
    const s = prog(lt(12.9), 0, 0.2);
    const textW = props.name.length * 190 * 0.41, total = textW + 280 * 0.42 + 56;
    const finalX = CX - total / 2 + 280 * 0.21;
    body = <Lockup name={props.name} wipe={prog(lt(13.0), 0, 0.5, Easing.linear)} markX={interpolate(s, [0, 1], [CX, finalX])} markH={interpolate(s, [0, 1], [460, 280])} />;
  } else body = <Lockup name={props.name} />;

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: Math.ceil(W / 90) + 1 }, (_, i) => <line key={`v${i}`} x1={i * 90} x2={i * 90} y1={0} y2={H} stroke={GRID} strokeWidth={2} />)}
        {Array.from({ length: Math.ceil(H / 90) + 1 }, (_, i) => <line key={`h${i}`} x1={0} x2={W} y1={i * 90} y2={i * 90} stroke={GRID} strokeWidth={2} />)}
      </svg>
      {body}
    </AbsoluteFill>
  );
};

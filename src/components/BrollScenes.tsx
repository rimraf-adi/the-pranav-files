import React from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Broll } from "../schema/timeline";
import style from "../../styles/gadzhi.json";
import { clamp, fontFamily, useEnvelope } from "./common";

const S = style.reference.scenes;
const ease = Easing.out(Easing.cubic);

export const LowerThird: React.FC<Extract<Broll, { kind: "lowerThird" }>> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = interpolate(frame, [0, 0.4 * fps], [0, 1], { ...clamp, easing: ease });
  const exit = useEnvelope(0.01, 0.3);
  const c = S.lowerThird;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, exit * 4) }}>
      <div style={{ position: "absolute", left: 54, top: `${c.topPercent}%`, transform: `translateX(${(1 - k) * -520}px)`, display: "flex", alignItems: "stretch", gap: 0, background: c.bg, borderRadius: 10, overflow: "hidden", boxShadow: "0 14px 40px -12px rgba(0,0,0,.6)" }}>
        <div style={{ width: 10, background: c.bar }} />
        <div style={{ padding: "18px 30px 18px 24px", fontFamily }}>
          <div style={{ color: c.title, fontWeight: 900, fontSize: 52, lineHeight: 1, textTransform: "uppercase", letterSpacing: "-0.01em" }}>{p.title}</div>
          {p.sub ? <div style={{ color: c.sub, fontWeight: 500, fontSize: 30, marginTop: 8 }}>{p.sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Chart: React.FC<Extract<Broll, { kind: "chart" }>> = (p) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = S.chart;
  const items = p.items;
  const max = Math.max(...items.map((i) => Math.abs(i.value)), 1e-9);
  const W = 864, H = 760;
  const grow = (i: number) => interpolate(frame, [4 + i * 5, 4 + i * 5 + 0.7 * fps], [0, 1], { ...clamp, easing: ease });
  const fade = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], clamp);
  const colW = W / items.length;
  const hl = p.highlight ?? items.length - 1;
  const lo = Math.min(...items.map((i) => i.value)), hi = Math.max(...items.map((i) => i.value));
  const pts = items.map((it, i) => [colW * i + colW / 2, H - 80 - ((it.value - lo) / (hi - lo || 1)) * (H - 260)] as const);
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const draw = interpolate(frame, [4, 4 + 1.1 * fps], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ background: c.bg, opacity: fade, justifyContent: "center", alignItems: "center", fontFamily }}>
      {p.title ? <div style={{ position: "absolute", top: "13%", left: 0, right: 0, textAlign: "center", color: c.text, fontWeight: 900, fontSize: 64, textTransform: "uppercase", padding: "0 80px" }}>{p.title}</div> : null}
      <div style={{ position: "relative", width: W, height: H + 80 }}>
        {p.chartType === "bar" ? items.map((it, i) => {
          const h = (Math.abs(it.value) / max) * (H - 70) * grow(i);
          return (
            <div key={i} style={{ position: "absolute", left: colW * i + colW * 0.14, width: colW * 0.72, bottom: 80, height: h, background: i === hl ? c.bar : c.barMuted, borderRadius: "10px 10px 0 0" }}>
              <div style={{ position: "absolute", top: -58, left: 0, right: 0, textAlign: "center", color: c.text, fontWeight: 900, fontSize: 44 }}>{(it.value * grow(i)).toFixed(Number.isInteger(it.value) ? 0 : 1)}{p.unit}</div>
            </div>
          );
        }) : (
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d={path} fill="none" stroke={c.line} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
            {pts.map(([x, y], i) => (
              <g key={i} opacity={draw > (i + 0.2) / items.length ? 1 : 0}>
                <circle cx={x} cy={y} r={i === hl ? 17 : 11} fill={i === hl ? c.bar : c.line} />
                <text x={x} y={y - 30} textAnchor="middle" fill={c.text} fontWeight={900} fontSize={42}>{items[i].value}{p.unit}</text>
              </g>
            ))}
          </svg>
        )}
        {items.map((it, i) => (
          <div key={i} style={{ position: "absolute", left: colW * i, width: colW, bottom: 18, textAlign: "center", color: c.text, fontWeight: 500, fontSize: 34, opacity: grow(i) }}>{it.label}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

type Geo = { features: { properties: { name: string }; geometry: { type: string; coordinates: number[][][] | number[][][][] } }[] };
let geoCache: Geo | null = null;

const useGeo = () => {
  const [geo, setGeo] = React.useState<Geo | null>(geoCache);
  const [handle] = React.useState(() => (geoCache ? null : delayRender("world geojson")));
  React.useEffect(() => {
    if (geoCache || handle === null) return;
    fetch(staticFile("shared/world-110m.geojson"))
      .then((r) => r.json())
      .then((j: Geo) => { geoCache = j; setGeo(j); continueRender(handle); })
      .catch(() => continueRender(handle));
  }, [handle]);
  return geo;
};

export const MapScene: React.FC<Extract<Broll, { kind: "map" }>> = (p) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width: W } = useVideoConfig();
  const geo = useGeo();
  const c = S.map;
  const [lon0, lat0, lon1, lat1] = p.focus ?? [-170, -58, 180, 80];
  const w = W * 0.94;
  const sc = w / (lon1 - lon0);
  const h = sc * (lat1 - lat0);
  const px = (lon: number) => (lon - lon0) * sc;
  const py = (lat: number) => (lat1 - lat) * sc;
  const hi = new Set(p.regions.map((r) => r.toLowerCase()));
  const paths = React.useMemo(() => (geo ? geo.features.map((f) => {
    const polys = (f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates) as number[][][][];
    const d = polys.map((poly) => poly.map((ring) => ring.map(([lo, la], i) => `${i ? "L" : "M"}${px(lo).toFixed(1)} ${py(la).toFixed(1)}`).join("") + "Z").join("")).join("");
    return { name: f.properties.name, d };
  }) : []), [geo, lon0, lat0, lon1, lat1, sc]); // eslint-disable-line react-hooks/exhaustive-deps
  const light = interpolate(frame, [6, 6 + 0.6 * fps], [0, 1], { ...clamp, easing: ease });
  const fade = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: c.bg, opacity: fade, justifyContent: "center", alignItems: "center", fontFamily }}>
      {p.title ? <div style={{ position: "absolute", top: "12%", left: 0, right: 0, textAlign: "center", color: c.text, fontWeight: 900, fontSize: 64, textTransform: "uppercase", padding: "0 80px" }}>{p.title}</div> : null}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
        {paths.map((f, i) => {
          const on = hi.has(f.name.toLowerCase());
          return <path key={i} d={f.d} fill={on ? c.highlight : c.land} fillOpacity={on ? 0.35 + 0.65 * light : 1} stroke={on ? c.highlight : c.stroke} strokeWidth={on ? 2 : 1} />;
        })}
        {p.pins.map((pin, i) => {
          const t = interpolate(frame, [14 + i * 8, 14 + i * 8 + 0.35 * fps], [0, 1], { ...clamp, easing: ease });
          const x = px(pin.lon), y = py(pin.lat);
          return (
            <g key={i} opacity={t} transform={`translate(0 ${(1 - t) * -24})`}>
              <circle cx={x} cy={y} r={22} fill={c.pin} fillOpacity={0.25} />
              <circle cx={x} cy={y} r={11} fill={c.pin} />
              <text x={x + 24} y={y + 10} fill={c.text} fontWeight={900} fontSize={40} style={{ paintOrder: "stroke" }} stroke={c.bg} strokeWidth={6}>{pin.label}</text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

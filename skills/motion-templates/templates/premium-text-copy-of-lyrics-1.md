# LYRICS 1  ·  `premium-text-copy-of-lyrics-1`

![preview](thumbs/premium-text-copy-of-lyrics-1.png)  ![motion strip](thumbs/premium-text-copy-of-lyrics-1-strip.jpg)

- pack: premium-text
- fonts: AkiraExpanded-SuperBold, Impact
- effects used: Fill, Glo2

## Editable controls (defaults)

| control | value | font/size |
|---|---|---|
| LYRICS 3 | LYRICS | Impact 134 |
| Animator 1 Position | {'x': 0, 'y': 0} |  |
| Fill Color | #FF0000 |  |
| LYRICS | LYRICS | AkiraExpanded-SuperBold 134 |
| LYRICS Position | {'x': 960, 'y': 538} |  |
| Fill Color | #FF0000 |  |
| LYRICS 4 | LYRICS | Impact 134 |
| Animator 1 Position | {'x': 0, 'y': 0} |  |
| Fill Color | #FFFFFF |  |

## Comp `TXT 4` — 1920x1080 @ 23.976fps, 2.336s

### 0. LYRICS 3 (TextLayer) in 0.0s → out 2.377s
- text doc: `{"text": "LYRICS", "font": "Impact", "font_size": 134.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.4431, 0.7725, 0.9569], "stroke_width": 3.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": true}`
- `Effects/Fill / Color`: [1.0, 0.0, 0.0, 1.0] (#FF0000)
- `Effects/Fill / Opacity`: 1.0
- `Transform / Anchor Point`: [0.0, -48.0, 0.0]
- `Transform / Position`: 0.0s=[960.0, 380.0, 0.0] → 0.751s=[960.0, 439.0, 0.0] · interp bezier · expr: `(Flow bezier helper, call:) ... + 1).time;		startValue = key(nearestKeyIndex).value;		endValue = key(nearestKeyIndex + 1).value;	}}customBezier(time, animationStartTime, animationEndTime, startValue, endValue, [0, 0.55, 0.19, 1]);/* ---------- Flow Expression Template ------------ */`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Opacity`: 0.0s=0.0 → 0.751s=100.0 · interp bezier · Easing.bezier(0.84, 0.0, 0.16, 1.0) · expr: `(Flow bezier helper, call:) ... + 1).time;		startValue = key(nearestKeyIndex).value;		endValue = key(nearestKeyIndex + 1).value;	}}customBezier(time, animationStartTime, animationEndTime, startValue, endValue, [0, 0.55, 0.19, 1]);/* ---------- Flow Expression Template ------------ */`

### 1. LYRICS (TextLayer) in 0.0s → out 2.377s
- text doc: `{"text": "LYRICS", "font": "AkiraExpanded-SuperBold", "font_size": 134.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [1.0, 1.0, 1.0], "stroke_width": 2.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": true}`
- `Text/Animators/Animator 1/Selectors/Expression Selector 1 / Amount`:  · expr: `delay = .04; myDelay = delay*textIndex; t = (time - inPoint) - myDelay; if (t >= 0){   freq =3;   amplitude = 20;   decay = 8.0;   s = amplitude*Math.cos(freq*t*2*Math.PI)/Math.exp(decay*t);   [s,s] }else{   value }`
- `Text/Animators/Animator 1/Properties / Position`: [0.0, -535.0, 0.0]
- `Text/Animators/Animator 1/Properties / Scale`: [0.0, 0.0, 0.0] (#000000)
- `Text/Animators/Animator 1/Properties / Rotation`: 26.0
- `Effects/Fill / Color`: [1.0, 0.0, 0.0, 1.0] (#FF0000)
- `Effects/Fill / Opacity`: 1.0
- `Effects/Glow / Glow Based On`: 2.0
- `Effects/Glow / Glow Threshold`: 153.0
- `Effects/Glow / Glow Radius`: 213.0
- `Effects/Glow / Glow Intensity`: 0.78
- `Effects/Glow / Composite Original`: 2.0
- `Effects/Glow / Glow Operation`: 3.0
- `Effects/Glow / Glow Colors`: 1.0
- `Effects/Glow / Color Looping`: 3.0
- `Effects/Glow / Color Loops`: 1.0
- `Effects/Glow / Color Phase`: 0.0
- `Effects/Glow / A & B Midpoint`: 0.5
- `Effects/Glow / Color A`: [1.0, 1.0, 1.0, 0.0] (#FFFFFF)
- `Effects/Glow / Color B`: [0.0, 0.0, 0.0, 0.0] (#000000)
- `Effects/Glow / Glow Dimensions`: 1.0
- `Transform / Anchor Point`: [0.0, -49.0, 0.0]
- `Transform / Position`: [960.0, 538.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 2. LYRICS 4 (TextLayer) in 0.0s → out 2.377s
- text doc: `{"text": "LYRICS", "font": "Impact", "font_size": 134.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.4431, 0.7725, 0.9569], "stroke_width": 3.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": true}`
- `Effects/Fill / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Fill / Opacity`: 1.0
- `Transform / Anchor Point`: [0.0, -49.0, 0.0]
- `Transform / Position`: 0.292s=[960.0, 629.0, 0.0] → 0.834s=[960.0, 652.0, 0.0] · interp bezier
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Opacity`: 0.292s=0.0 → 0.834s=100.0 · interp bezier · Easing.bezier(0.22, 1.0, 0.36, 1.0)


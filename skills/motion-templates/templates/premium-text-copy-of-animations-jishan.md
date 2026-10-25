# animations jishan  ·  `premium-text-copy-of-animations-jishan`

![preview](thumbs/premium-text-copy-of-animations-jishan.png)  ![motion strip](thumbs/premium-text-copy-of-animations-jishan-strip.jpg)

- pack: premium-text
- fonts: Anton, Impact
- effects used: Drop Shadow, Fill, CC Light Sweep

## Editable controls (defaults)

| control | value | font/size |
|---|---|---|
| ADD | ADD | Anton 134 |
| Animator 1 Position | {'x': 0, 'y': 0} |  |
| Fill Color | #FFFFFF |  |
| ANIMATIONS | ANIMATIONS | Impact 134 |
| ANIMATIONS Position | {'x': 960, 'y': 540} |  |
| Fill Color | #FF0000 |  |
| HERE | HERE | Anton 134 |
| Animator 1 Position | {'x': 0, 'y': 0} |  |
| Fill Color | #FF0000 |  |

## Comp `TXT 2` — 1920x1080 @ 23.976fps, 3.462s

### 0. ADD (TextLayer) in 0.0s → out 3.462s
- text doc: `{"text": "ADD", "font": "Anton", "font_size": 134.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.4431, 0.7725, 0.9569], "stroke_width": 3.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": true}`
- `Effects/Fill / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Fill / Opacity`: 1.0
- `Effects/Drop Shadow / Shadow Color`: [0.0, 0.0, 0.0, 1.0] (#000000)
- `Effects/Drop Shadow / Opacity`: 127.5
- `Effects/Drop Shadow / Direction`: 135.0
- `Effects/Drop Shadow / Distance`: 5.0
- `Effects/Drop Shadow / Softness`: 5.0
- `Transform / Anchor Point`: [0.0, -45.3953, 0.0]
- `Transform / Position`: 1.418s=[964.0, 456.0, 0.0] · interp bezier
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.0s=[0.0, 0.0, 100.0] → 1.627s=[43.0, 43.0, 100.0] · interp bezier
- `Transform / Opacity`: 1.418s=100.0 · interp bezier

### 1. ANIMATIONS (TextLayer) in 0.0s → out 3.462s
- text doc: `{"text": "ANIMATIONS", "font": "Impact", "font_size": 134.0, "fill_color": [1.0, 0.0, 0.0], "stroke_color": [0.4431, 0.7725, 0.9569], "stroke_width": 3.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": true}`
- `Text/Animators/Animator 1/Selectors/Expression Selector 1 / Based On`: 2.0
- `Text/Animators/Animator 1/Selectors/Expression Selector 1 / Amount`:  · expr: `delay = .05;myDelay = delay*textIndex;t = (time - inPoint) - myDelay;if (t >= 0){  freq =2;  amplitude = 80;  decay = 9.0;  s = amplitude*Math.cos(freq*t*2*Math.PI)/Math.exp(decay*t);  [s,s]}else{  value}`
- `Text/Animators/Animator 1/Properties / Position`: [-156.0, -117.0, 0.0]
- `Text/Animators/Animator 1/Properties / Scale`: [0.0, 0.0, 0.0] (#000000)
- `Effects/Fill / Color`: [1.0, 0.0, 0.0, 1.0] (#FF0000)
- `Effects/Fill / Opacity`: 1.0
- `Effects/CC Light Sweep / Center`: 0.0s=[1052.0, 334.0] → 2.002s=[506.0, 480.0] · interp linear
- `Effects/CC Light Sweep / Direction`: -30.0
- `Effects/CC Light Sweep / Shape`: 3.0
- `Effects/CC Light Sweep / Width`: 50.0
- `Effects/CC Light Sweep / Sweep Intensity`: 25.0
- `Effects/CC Light Sweep / Edge Intensity`: 50.0
- `Effects/CC Light Sweep / Edge Thickness`: 4.0
- `Effects/CC Light Sweep / Light Color`: [1.0, 0.9804, 0.9412, 1.0] (#FFFAF0)
- `Effects/CC Light Sweep / Light Reception`: 1.0
- `Effects/Drop Shadow / Shadow Color`: [0.0, 0.0, 0.0, 1.0] (#000000)
- `Effects/Drop Shadow / Opacity`: 127.5
- `Effects/Drop Shadow / Direction`: 135.0
- `Effects/Drop Shadow / Distance`: 5.0
- `Effects/Drop Shadow / Softness`: 5.0
- `Transform / Anchor Point`: [0.0, -48.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 2. HERE (TextLayer) in 0.0s → out 3.462s
- text doc: `{"text": "HERE", "font": "Anton", "font_size": 134.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.4431, 0.7725, 0.9569], "stroke_width": 3.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": true}`
- `Effects/Drop Shadow / Shadow Color`: [0.0, 0.0, 0.0, 1.0] (#000000)
- `Effects/Drop Shadow / Opacity`: 127.5
- `Effects/Drop Shadow / Direction`: 135.0
- `Effects/Drop Shadow / Distance`: 5.0
- `Effects/Drop Shadow / Softness`: 5.0
- `Effects/Fill / Color`: [1.0, 0.0, 0.0, 1.0] (#FF0000)
- `Effects/Fill / Opacity`: 1.0
- `Transform / Anchor Point`: [2.3256, -40.7442, 0.0]
- `Transform / Position`: 1.835s=[961.0, 618.0, 0.0] · interp linear · expr: `(Flow bezier helper, call:) ...x + 1).time;		startValue = key(nearestKeyIndex).value;		endValue = key(nearestKeyIndex + 1).value;	}}customBezier(time, animationStartTime, animationEndTime, startValue, endValue, [0, 0.65, 0.3, 1]);/* ---------- Flow Expression Template ------------ */`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.0s=[0.0, 0.0, 100.0] → 1.627s=[43.0, 43.0, 100.0] · interp bezier
- `Transform / Opacity`: 1.418s=100.0 · interp bezier


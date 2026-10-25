# PLACE  11  ·  `premium-text-copy-of-place-11`

![preview](thumbs/premium-text-copy-of-place-11.png)  ![motion strip](thumbs/premium-text-copy-of-place-11-strip.jpg)

- pack: premium-text
- fonts: PlayfairDisplay-Black
- effects used: Fill, Gaussian Blur 2, Glo2, CC Light Sweep

## Editable controls (defaults)

| control | value | font/size |
|---|---|---|
| place | place | PlayfairDisplay-Black 134 |
| Animator 1 Position | {'x': 0, 'y': 0} |  |
| Fill Color | #FFFFFF |  |
| LYRICS 2 | LYRICS | PlayfairDisplay-Black 134 |
| Animator 2 Position | {'x': 0, 'y': 0} |  |
| Fill Color | #FF0000 |  |
| here | here | PlayfairDisplay-Black 134 |
| Animator 1 Position | {'x': 0, 'y': 0} |  |

## Comp `TXT 11` — 1920x1080 @ 59.94fps, 3.554s

### 0. place (TextLayer) in 0.0s → out 3.587s
- text doc: `{"text": "place", "font": "PlayfairDisplay-Black", "font_size": 134.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [1.0, 0.0, 0.0], "stroke_width": 5.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": false}`
- `Effects/Fill / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Fill / Opacity`: 1.0
- `Effects/Gaussian Blur / Blurriness`: 0.0s=25.3 → 1.001s=0.0 · interp linear · expr: `(Flow bezier helper, call:) ... + 1).time;		startValue = key(nearestKeyIndex).value;		endValue = key(nearestKeyIndex + 1).value;	}}customBezier(time, animationStartTime, animationEndTime, startValue, endValue, [0, 0.14, 0.37, 1]);/* ---------- Flow Expression Template ------------ */`
- `Effects/Gaussian Blur / Blur Dimensions`: 1.0
- `Effects/Gaussian Blur / Repeat Edge Pixels`: 1.0
- `Transform / Position`: 0.0s=[633.0104, -30.7093, 0.0] → 1.018s=[633.0104, 447.2907, 0.0] · interp linear · expr: `(Flow bezier helper, call:) ... + 1).time;		startValue = key(nearestKeyIndex).value;		endValue = key(nearestKeyIndex + 1).value;	}}customBezier(time, animationStartTime, animationEndTime, startValue, endValue, [0, 0.77, 0.17, 1]);/* ---------- Flow Expression Template ------------ */`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `startScale = 100; speed = 2; // lower = slower  [startScale - time * speed, startScale - time * speed];`
- `Transform / Opacity`: 0.033s=0.0 → 1.034s=100.0 · interp linear · expr: `(Flow bezier helper, call:) ... + 1).time;		startValue = key(nearestKeyIndex).value;		endValue = key(nearestKeyIndex + 1).value;	}}customBezier(time, animationStartTime, animationEndTime, startValue, endValue, [0, 0.16, 0.61, 1]);/* ---------- Flow Expression Template ------------ */`

### 1. LYRICS 2 (TextLayer) in 0.0s → out 3.62s
- text doc: `{"text": "LYRICS", "font": "PlayfairDisplay-Black", "font_size": 134.0, "fill_color": [1.0, 0.0, 0.0235], "stroke_color": [1.0, 0.0, 0.0], "stroke_width": 5.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": false}`
- `Text/Animators/Animator 1/Selectors/Expression Selector 1 / Amount`:  · expr: `delay = .060 ;myDelay = delay*textIndex;t = (time - inPoint) - myDelay;if (t >= 0){  freq =2;  amplitude = 50;  decay = 8.0;  s = amplitude*Math.cos(freq*t*2*Math.PI)/Math.exp(decay*t);  [s,s]}else{  value}`
- `Text/Animators/Animator 1/Properties / Position`: [123.0, -156.0, 0.0]
- `Text/Animators/Animator 1/Properties / Scale`: [0.0, 0.0, 100.0]
- `Text/Animators/Animator 1/Properties / Rotation`: 53.0
- `Text/Animators/Animator 1/Properties / Opacity`: 0.0
- `Effects/Fill / Color`: [1.0, 0.0, 0.0, 1.0] (#FF0000)
- `Effects/Fill / Opacity`: 1.0
- `Effects/CC Light Sweep / Center`: 0.033s=[1196.0, 230.0] → 1.151s=[272.0, 872.0] · interp linear
- `Effects/CC Light Sweep / Direction`: -30.0
- `Effects/CC Light Sweep / Shape`: 3.0
- `Effects/CC Light Sweep / Width`: 50.0
- `Effects/CC Light Sweep / Sweep Intensity`: 25.0
- `Effects/CC Light Sweep / Edge Intensity`: 50.0
- `Effects/CC Light Sweep / Edge Thickness`: 4.0
- `Effects/CC Light Sweep / Light Color`: [1.0, 0.9804, 0.9412, 1.0] (#FFFAF0)
- `Effects/CC Light Sweep / Light Reception`: 1.0
- `Effects/Glow / Glow Based On`: 2.0
- `Effects/Glow / Glow Threshold`: 153.0
- `Effects/Glow / Glow Radius`: 46.0
- `Effects/Glow / Glow Intensity`: 0.5
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
- `Transform / Anchor Point`: [0.0, -43.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `startScale = 206; speed = 4; // lower = slower  [startScale - time * speed, startScale - time * speed];`

### 2. here (TextLayer) in -0.017s → out 3.587s
- text doc: `{"text": "here", "font": "PlayfairDisplay-Black", "font_size": 134.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [1.0, 0.0, 0.0], "stroke_width": 5.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": false}`
- `Effects/Fill / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Fill / Opacity`: 1.0
- `Effects/Gaussian Blur / Blurriness`: 0.0s=25.3 → 1.001s=0.0 · interp linear · expr: `(Flow bezier helper, call:) ... + 1).time;		startValue = key(nearestKeyIndex).value;		endValue = key(nearestKeyIndex + 1).value;	}}customBezier(time, animationStartTime, animationEndTime, startValue, endValue, [0, 0.14, 0.37, 1]);/* ---------- Flow Expression Template ------------ */`
- `Effects/Gaussian Blur / Blur Dimensions`: 1.0
- `Effects/Gaussian Blur / Repeat Edge Pixels`: 0.0
- `Transform / Position`: 0.0s=[1302.0104, 934.5017, 0.0] → 1.001s=[1302.0104, 685.5017, 0.0] · interp linear · expr: `(Flow bezier helper, call:) ... + 1).time;		startValue = key(nearestKeyIndex).value;		endValue = key(nearestKeyIndex + 1).value;	}}customBezier(time, animationStartTime, animationEndTime, startValue, endValue, [0, 0.48, 0.27, 1]);/* ---------- Flow Expression Template ------------ */`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `startScale = 100; speed = 2; // lower = slower  [startScale - time * speed, startScale - time * speed];`
- `Transform / Opacity`: 0.0s=0.0 → 1.001s=100.0 · interp linear · expr: `(Flow bezier helper, call:) ... + 1).time;		startValue = key(nearestKeyIndex).value;		endValue = key(nearestKeyIndex + 1).value;	}}customBezier(time, animationStartTime, animationEndTime, startValue, endValue, [0, 0.14, 0.37, 1]);/* ---------- Flow Expression Template ------------ */`


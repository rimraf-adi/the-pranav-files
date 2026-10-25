# PUT LYRICS  ·  `premium-text-copy-of-put-lyrics`

![preview](thumbs/premium-text-copy-of-put-lyrics.png)  ![motion strip](thumbs/premium-text-copy-of-put-lyrics-strip.jpg)

- pack: premium-text
- fonts: Impact, Lato-BlackItalic
- effects used: Drop Shadow, Fill, Gaussian Blur 2, CC Light Sweep

## Editable controls (defaults)

| control | value | font/size |
|---|---|---|
| PLACE | PUT | Lato-BlackItalic 134 |
| Animator 1 Position | {'x': 0, 'y': 0} |  |
| Fill Color | #FFFFFF |  |
| LYRICS | LYRICS | Impact 134 |
| Animator 2 Position | {'x': 0, 'y': 0} |  |
| Fill Color | #FF0000 |  |
| HERE | HERE | Lato-BlackItalic 134 |
| Animator 1 Position | {'x': 0, 'y': 0} |  |
| Fill Color | #FFFFFF |  |

## Comp `TXT 3` — 1920x1080 @ 23.976fps, 2.419s

### 0. PLACE (TextLayer) in 0.0s → out 2.419s [is_3d]
- text doc: `{"text": "PUT", "font": "Lato-BlackItalic", "font_size": 134.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [1.0, 1.0, 1.0], "stroke_width": 5.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": true}`
- `Effects/Fill / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Fill / Opacity`: 1.0
- `Effects/Gaussian Blur / Blurriness`: 9.0
- `Effects/Gaussian Blur / Blur Dimensions`: 1.0
- `Effects/Gaussian Blur / Repeat Edge Pixels`: 1.0
- `Transform / Anchor Point`: [0.0, -28.0, 0.0]
- `Transform / Position`: 0.0s=[-429.0, 418.0, 0.0] → 1.627s=[960.0, 418.0, 0.0] · interp bezier · expr: `(Flow bezier helper, call:) ... + 1).time;		startValue = key(nearestKeyIndex).value;		endValue = key(nearestKeyIndex + 1).value;	}}customBezier(time, animationStartTime, animationEndTime, startValue, endValue, [0, 0.93, 0.19, 1]);/* ---------- Flow Expression Template ------------ */`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Opacity`: 0.0s=0.0 → 0.918s=100.0 · interp linear

### 1. LYRICS (TextLayer) in 0.0s → out 2.419s [is_3d]
- text doc: `{"text": "LYRICS", "font": "Impact", "font_size": 134.0, "fill_color": [1.0, 0.0, 0.0], "stroke_color": [0.4431, 0.7725, 0.9569], "stroke_width": 3.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": true}`
- `Text/Animators/Animator 1/Selectors/Expression Selector 1 / Amount`:  · expr: `freq = 1.5; decay = 5; duration = 0.25; retard = textIndex*thisComp.frameDuration*1; t = time - (inPoint + retard); startVal = [100,100,100]; endVal = [0,0,0]; if (t < duration){ linear(t,0,duration,startVal,endVal); }else{ amp = (endVal - startVal)/duration; w = freq*Math.PI*2; endVal +`
- `Text/Animators/Animator 1/Properties / Position`: [53.0, -228.0, 0.0]
- `Text/Animators/Animator 1/Properties / Scale`: [0.0, 0.0, 100.0]
- `Text/Animators/Animator 1/Properties / Rotation`: 46.0
- `Text/Animators/Animator 1/Properties / Tracking Type`: 3.0
- `Text/Animators/Animator 1/Properties / Tracking Amount`: -37.0
- `Effects/Fill / Color`: [1.0, 0.0, 0.0, 1.0] (#FF0000)
- `Effects/Fill / Opacity`: 1.0
- `Effects/CC Light Sweep / Center`: 0.501s=[1096.0, 270.0] → 2.002s=[516.0, 724.0] · interp linear
- `Effects/CC Light Sweep / Direction`: 0.0s=-30.0 · interp linear
- `Effects/CC Light Sweep / Shape`: 3.0
- `Effects/CC Light Sweep / Width`: 50.0
- `Effects/CC Light Sweep / Sweep Intensity`: 25.0
- `Effects/CC Light Sweep / Edge Intensity`: 50.0
- `Effects/CC Light Sweep / Edge Thickness`: 4.0
- `Effects/CC Light Sweep / Light Color`: [1.0, 0.9804, 0.9412, 1.0] (#FFFAF0)
- `Effects/CC Light Sweep / Light Reception`: 1.0
- `Effects/CC Light Sweep 2 / Center`: [1130.0, 724.0]
- `Effects/CC Light Sweep 2 / Direction`: 0.0s=-30.0 · interp linear
- `Effects/CC Light Sweep 2 / Shape`: 1.0
- `Effects/CC Light Sweep 2 / Width`: 50.0
- `Effects/CC Light Sweep 2 / Sweep Intensity`: 25.0
- `Effects/CC Light Sweep 2 / Edge Intensity`: 75.0
- `Effects/CC Light Sweep 2 / Edge Thickness`: 4.0
- `Effects/CC Light Sweep 2 / Light Color`: [1.0, 0.9804, 0.9412, 1.0] (#FFFAF0)
- `Effects/CC Light Sweep 2 / Light Reception`: 1.0
- `Effects/Drop Shadow / Shadow Color`: [0.0, 0.0, 0.0, 1.0] (#000000)
- `Effects/Drop Shadow / Opacity`: 127.5
- `Effects/Drop Shadow / Direction`: 135.0
- `Effects/Drop Shadow / Distance`: 14.0
- `Effects/Drop Shadow / Softness`: 36.0
- `Transform / Anchor Point`: [0.0, -28.0, 0.0]
- `Transform / Position`: 1.335s=[960.0, 540.0, -5.0] · interp linear
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: [140.0, 140.0, 140.0]

### 2. HERE (TextLayer) in 0.0s → out 2.419s [is_3d]
- text doc: `{"text": "HERE", "font": "Lato-BlackItalic", "font_size": 134.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [1.0, 1.0, 1.0], "stroke_width": 6.0, "tracking": 0, "leading": 207.0, "justification": 7415, "all_caps": true}`
- `Effects/Fill / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Fill / Opacity`: 1.0
- `Effects/Gaussian Blur / Blurriness`: 9.0
- `Effects/Gaussian Blur / Blur Dimensions`: 1.0
- `Effects/Gaussian Blur / Repeat Edge Pixels`: 1.0
- `Transform / Anchor Point`: [0.0, -28.0, 0.0]
- `Transform / Position`: 0.0s=[960.0, 801.0, 0.0] → 1.376s=[960.0, 649.0, 0.0] · interp bezier
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Opacity`: 0.25s=0.0 → 0.918s=100.0 · interp linear


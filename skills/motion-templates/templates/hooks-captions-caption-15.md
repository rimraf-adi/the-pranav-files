# Caption 15  ·  `hooks-captions-caption-15`

![preview](thumbs/hooks-captions-caption-15.png)  ![motion strip](thumbs/hooks-captions-caption-15-strip.jpg)

- pack: hooks-captions
- fonts: NHaasGroteskDSPro-75Bd
- effects used: Box Blur2, Fill, Geometry2, Glo2

## Editable controls (defaults)

| control | value | font/size |
|---|---|---|
| Text 01 | How to make | NHaasGroteskDSPro-75Bd 100 |
| Text 01 On / Off | True |  |
| Text 01 Color | #FFFFFF |  |
| Main Position X | -98 |  |
| Main Position Y | 85 |  |
| Main Scale | 50 |  |
| Text 02 On / Off | True |  |
| Text 02 Color | #FFFFFF |  |
| Start Value | 0 |  |
| End Value | 750 |  |
| Main Position X | 106 |  |
| Main Position Y | -32 |  |
| Main Scale | 250 |  |
| Text 03 | dollar in a day | NHaasGroteskDSPro-75Bd 100 |
| Text 03 On / Off | True |  |
| Text 03 Color | #00FFEF |  |
| Main Position X | 0 |  |
| Main Position Y | -85 |  |
| Main Scale | 80 |  |
| Text 04 | just cooking in your kitchen. | NHaasGroteskDSPro-75Bd 100 |
| Text 04 On / Off | True |  |
| Text 04 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | -113 |  |
| Main Scale | 50 |  |

## Comp `Caption 15` — 1080x1920 @ 25.0fps, 10.0s

### 0. Control Text 04 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 04 On / Off / Checkbox`: 1.0
- `Effects/Text 04 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: -113.0
- `Effects/Main Scale / Slider`: 50.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 1. Control Text 03 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 03 On / Off / Checkbox`: 1.0
- `Effects/Text 03 Color / Color`: [0.0, 1.0, 0.9381, 1.0] (#00FFEF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: -85.0
- `Effects/Main Scale / Slider`: 80.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 2. Control Text 02 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 02 On / Off / Checkbox`: 1.0
- `Effects/Text 02 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 106.0
- `Effects/Main Position Y / Slider`: -32.0
- `Effects/Main Scale / Slider`: 250.0
- `Effects/Start Value / Slider`: 0.0
- `Effects/End Value / Slider`: 750.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 3. Control Text 01 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 01 On / Off / Checkbox`: 1.0
- `Effects/Text 01 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: -98.0
- `Effects/Main Position Y / Slider`: 85.0
- `Effects/Main Scale / Slider`: 50.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 4. Text 01 (AVLayer) in 0.0s → out 10.0s, precomp `Text 01`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 01").effect("Text 01 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [285.5, 37.0]
- `Effects/Transform / Position`: [285.5, 37.0]
- `Effects/Transform / Uniform Scale`: 1.0
- `Effects/Transform / Scale Height`: 100.0
- `Effects/Transform / Scale Width`: 100.0
- `Effects/Transform / Skew`: 0.0
- `Effects/Transform / Skew Axis`: 0.0
- `Effects/Transform / Rotation`: 0.0
- `Effects/Transform / Opacity`:  · expr: `thisComp.layer("Control Text 01").effect("Text 01 On / Off")("ADBE Checkbox Control-0001")*100`
- `Effects/Transform / Use Composition’s Shutter Angle`: 1.0
- `Effects/Transform / Shutter Angle`: 0.0
- `Effects/Transform / Sampling`: 1.0
- `Effects/Fast Box Blur / Blur Radius`: 0.0s=50.0 → 1.0s=0.0 · interp linear
- `Effects/Fast Box Blur / Iterations`: 3.0
- `Effects/Fast Box Blur / Blur Dimensions`: 1.0
- `Effects/Fast Box Blur / Repeat Edge Pixels`: 1.0
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 01");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 01").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.0s=0.0 → 1.0s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 5. Text 02 (AVLayer) in 0.12s → out 10.0s, precomp `Text 02`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 02").effect("Text 02 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [100.0, 40.5]
- `Effects/Transform / Position`: [100.0, 40.5]
- `Effects/Transform / Uniform Scale`: 1.0
- `Effects/Transform / Scale Height`: 100.0
- `Effects/Transform / Scale Width`: 100.0
- `Effects/Transform / Skew`: 0.0
- `Effects/Transform / Skew Axis`: 0.0
- `Effects/Transform / Rotation`: 0.0
- `Effects/Transform / Opacity`:  · expr: `thisComp.layer("Control Text 02").effect("Text 02 On / Off")("ADBE Checkbox Control-0001")*100`
- `Effects/Transform / Use Composition’s Shutter Angle`: 1.0
- `Effects/Transform / Shutter Angle`: 0.0
- `Effects/Transform / Sampling`: 1.0
- `Effects/Glow / Glow Based On`: 2.0
- `Effects/Glow / Glow Threshold`: 153.0
- `Effects/Glow / Glow Radius`: 200.0
- `Effects/Glow / Glow Intensity`: 1.0
- `Effects/Glow / Composite Original`: 2.0
- `Effects/Glow / Glow Operation`: 3.0
- `Effects/Glow / Glow Colors`: 1.0
- `Effects/Glow / Color Looping`: 3.0
- `Effects/Glow / Color Loops`: 1.0
- `Effects/Glow / Color Phase`: 0.0
- `Effects/Glow / A & B Midpoint`: 0.5
- `Effects/Glow / Color A`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Glow / Color B`: [0.0, 0.0, 0.0, 1.0] (#000000)
- `Effects/Glow / Glow Dimensions`: 1.0
- `Effects/Glow 2 / Glow Based On`: 2.0
- `Effects/Glow 2 / Glow Threshold`: 153.0
- `Effects/Glow 2 / Glow Radius`: 800.0
- `Effects/Glow 2 / Glow Intensity`: 1.0
- `Effects/Glow 2 / Composite Original`: 2.0
- `Effects/Glow 2 / Glow Operation`: 3.0
- `Effects/Glow 2 / Glow Colors`: 1.0
- `Effects/Glow 2 / Color Looping`: 3.0
- `Effects/Glow 2 / Color Loops`: 1.0
- `Effects/Glow 2 / Color Phase`: 0.0
- `Effects/Glow 2 / A & B Midpoint`: 0.5
- `Effects/Glow 2 / Color A`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Glow 2 / Color B`: [0.0, 0.0, 0.0, 1.0] (#000000)
- `Effects/Glow 2 / Glow Dimensions`: 1.0
- `Transform / Position`: 0.12s=[343.1868, 1615.7369, 0.0] → 1.12s=[343.1868, 1326.7369, 0.0] · interp linear · expr: `ctrl = thisComp.layer("Control Text 02");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 02").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.12s=0.0 → 1.12s=100.0 · interp linear
- `Essential Properties / End Value`:  · expr: `thisComp.layer("Control Text 02").effect("End Value")("ADBE Slider Control-0001")`
- `Replace Source / Item Cache Entry`: None

### 6. Text 03 (AVLayer) in 0.36s → out 10.0s, precomp `Text 03`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 03").effect("Text 03 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [302.0, 44.5]
- `Effects/Transform / Position`: [302.0, 44.5]
- `Effects/Transform / Uniform Scale`: 1.0
- `Effects/Transform / Scale Height`: 100.0
- `Effects/Transform / Scale Width`: 100.0
- `Effects/Transform / Skew`: 0.0
- `Effects/Transform / Skew Axis`: 0.0
- `Effects/Transform / Rotation`: 0.0
- `Effects/Transform / Opacity`:  · expr: `thisComp.layer("Control Text 03").effect("Text 03 On / Off")("ADBE Checkbox Control-0001")*100`
- `Effects/Transform / Use Composition’s Shutter Angle`: 1.0
- `Effects/Transform / Shutter Angle`: 0.0
- `Effects/Transform / Sampling`: 1.0
- `Effects/Fast Box Blur / Blur Radius`: 0.36s=50.0 → 1.36s=0.0 · interp linear
- `Effects/Fast Box Blur / Iterations`: 3.0
- `Effects/Fast Box Blur / Blur Dimensions`: 1.0
- `Effects/Fast Box Blur / Repeat Edge Pixels`: 1.0
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 03");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 03").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.36s=0.0 → 1.36s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 7. Text 04 (AVLayer) in 0.24s → out 10.0s, precomp `Text 04`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 04").effect("Text 04 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [620.0, 45.0]
- `Effects/Transform / Position`: [620.0, 45.0]
- `Effects/Transform / Uniform Scale`: 1.0
- `Effects/Transform / Scale Height`: 100.0
- `Effects/Transform / Scale Width`: 100.0
- `Effects/Transform / Skew`: 0.0
- `Effects/Transform / Skew Axis`: 0.0
- `Effects/Transform / Rotation`: 0.0
- `Effects/Transform / Opacity`:  · expr: `thisComp.layer("Control Text 04").effect("Text 04 On / Off")("ADBE Checkbox Control-0001")*100`
- `Effects/Transform / Use Composition’s Shutter Angle`: 1.0
- `Effects/Transform / Shutter Angle`: 0.0
- `Effects/Transform / Sampling`: 1.0
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 04");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 04").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.24s=0.0 → 1.24s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

## Comp `Text 01` — 571x74 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "How to make", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Transform / Anchor Point`: [1.9103, -35.1974, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 02` — 200x81 @ 25.0fps, 12.24s

### 0. Control (ShapeLayer) in 0.0s → out 12.24s
- `Effects/Start Value / Slider`: 0.0
- `Effects/End Value / Slider`: 750.0
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 1. Number Counter (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "1000", "font": "PlayfairDisplay-Italic", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Effects/Number Counter / Counting Animation`: 0.0s=0.0 → 1.0s=100.0 · interp linear
- `Effects/Number Counter / Start Value`:  · expr: `thisComp.layer("Control").effect("Start Value")("ADBE Slider Control-0001")`
- `Effects/Number Counter / End Value`:  · expr: `thisComp.layer("Control").effect("End Value")("ADBE Slider Control-0001")`
- `Effects/Number Counter / Symbols`: 0.0
- `Effects/Number Counter / Decimal Padding`: 0.0
- `Effects/Number Counter / Decimal Separator`: 1.0
- `Effects/Number Counter / Thousands Separator`: 1.0
- `Effects/Number Counter / Prefix`: 1.0
- `Effects/Number Counter / Suffix`: 1.0
- `Effects/Number Counter / Number Counter`: 0.0
- `Transform / Anchor Point`: [-5.127, -19.3848, 0.0]
- `Transform / Position`: [99.5, 40.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 03` — 604x89 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "dollar in a day", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/Animators/Position/Selectors/Expression Selector 1 / Based On`: 3.0
- `Text/Animators/Position/Selectors/Expression Selector 1 / Amount`:  · expr: `delay = .1; myDelay = delay*textIndex; t = (time - inPoint) - myDelay; if (t >= 0) { 	freq = 2; 	amplitude = 220; 	decay = 8.0; 	s = amplitude * Math.cos(freq*t*2*Math.PI)/Math.exp(decay*t); 	[s,s] } else { 	value }`
- `Text/Animators/Position/Properties / Position`: [0.0, 50.0, 0.0]
- `Text/Animators/Position/Properties / Opacity`: 0.0
- `Transform / Anchor Point`: [1.144, -27.4933, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 04` — 1240x90 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "just cooking in your kitchen.", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/Animators/Animator 1/Selectors/Range Selector 1 / Start`: 0.0s=0.0 → 1.24s=100.0 · interp linear
- `Text/Animators/Animator 1/Selectors/Range Selector 1/Advanced / Based On`: 2.0
- `Text/Animators/Animator 1/Properties / Opacity`: 0.0
- `Transform / Anchor Point`: [-3.8948, -27.0905, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0


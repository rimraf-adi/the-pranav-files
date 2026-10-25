# Caption 04  ·  `hooks-captions-caption-04`

![preview](thumbs/hooks-captions-caption-04.png)  ![motion strip](thumbs/hooks-captions-caption-04-strip.jpg)

- pack: hooks-captions
- fonts: NHaasGroteskDSPro-75Bd
- effects used: Fill, Geometry2

## Editable controls (defaults)

| control | value | font/size |
|---|---|---|
| Text 01 | This is | NHaasGroteskDSPro-75Bd 100 |
| Text 01 On / Off | True |  |
| Text 01 Color | #00FFE6 |  |
| Main Position X | -98 |  |
| Main Position Y | 85 |  |
| Main Scale | 60 |  |
| Text 02 | where | NHaasGroteskDSPro-75Bd 100 |
| Text 02 On / Off | True |  |
| Text 02 Color | #FFFFFF |  |
| Main Position X | 106 |  |
| Main Position Y | -32 |  |
| Main Scale | 60 |  |
| Text 03 | the opportunity | NHaasGroteskDSPro-75Bd 100 |
| Text 03 On / Off | True |  |
| Text 03 Color | #F3FF00 |  |
| Main Position X | 0 |  |
| Main Position Y | -85 |  |
| Main Scale | 100 |  |
| Text 04 | starts | NHaasGroteskDSPro-75Bd 100 |
| Text 04 On / Off | True |  |
| Text 04 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | -113 |  |
| Main Scale | 100 |  |

## Comp `Caption 04` — 1080x1920 @ 25.0fps, 10.0s

### 0. Control Text 04 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 04 On / Off / Checkbox`: 1.0
- `Effects/Text 04 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: -113.0
- `Effects/Main Scale / Slider`: 100.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 1. Control Text 03 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 03 On / Off / Checkbox`: 1.0
- `Effects/Text 03 Color / Color`: [0.9544, 1.0, 0.0, 1.0] (#F3FF00)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: -85.0
- `Effects/Main Scale / Slider`: 100.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 2. Control Text 02 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 02 On / Off / Checkbox`: 1.0
- `Effects/Text 02 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 106.0
- `Effects/Main Position Y / Slider`: -32.0
- `Effects/Main Scale / Slider`: 60.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 3. Control Text 01 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 01 On / Off / Checkbox`: 1.0
- `Effects/Text 01 Color / Color`: [0.0, 1.0, 0.9011, 1.0] (#00FFE6)
- `Effects/Main Position X / Slider`: -98.0
- `Effects/Main Position Y / Slider`: 85.0
- `Effects/Main Scale / Slider`: 60.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 4. Text 01 (AVLayer) in 0.0s → out 10.0s, precomp `Text 01`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 01").effect("Text 01 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [141.0, 37.0]
- `Effects/Transform / Position`: [141.0, 37.0]
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
- `Transform / Position`: 0.0s=[541.5576, 1982.2954, 0.0] → 1.0s=[541.5576, 1144.2954, 0.0] · interp linear · expr: `ctrl = thisComp.layer("Control Text 01");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 01").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.0s=0.0 → 1.0s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 5. Text 02 (AVLayer) in 0.2s → out 10.0s, precomp `Text 02`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 02").effect("Text 02 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [142.0, 37.0]
- `Effects/Transform / Position`: [142.0, 37.0]
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
- `Transform / Position`: 0.2s=[527.1868, 2099.7369, 0.0] → 1.2s=[527.1868, 1261.7369, 0.0] · interp linear · expr: `ctrl = thisComp.layer("Control Text 02");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 02").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.2s=0.0 → 1.2s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 6. Text 03 (AVLayer) in 0.4s → out 10.0s, precomp `Text 03`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 03").effect("Text 03 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [349.0, 44.5]
- `Effects/Transform / Position`: [349.0, 44.5]
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
- `Transform / Position`: 0.4s=[540.1828, 2241.9823, 0.0] → 1.4s=[540.1828, 1403.9823, 0.0] · interp linear · expr: `ctrl = thisComp.layer("Control Text 03");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 03").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.4s=0.0 → 1.4s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 7. Text 04 (AVLayer) in 0.6s → out 10.0s, precomp `Text 04`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 04").effect("Text 04 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [131.5, 34.5]
- `Effects/Transform / Position`: [131.5, 34.5]
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
- `Transform / Position`: 0.6s=[542.3896, 2364.5535, 0.0] → 1.6s=[542.3896, 1526.5535, 0.0] · interp linear · expr: `ctrl = thisComp.layer("Control Text 04");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 04").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.6s=0.0 → 1.6s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

## Comp `Text 01` — 282x74 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "This is", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Transform / Anchor Point`: [0.3295, -35.1974, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 02` — 284x74 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "where", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Transform / Anchor Point`: [-0.6578, -35.2478, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 03` — 698x89 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "the opportunity", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Transform / Anchor Point`: [0.8922, -27.4933, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 04` — 263x69 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "starts", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Transform / Anchor Point`: [-0.1237, -33.1329, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0


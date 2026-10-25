# Caption 12  ·  `hooks-captions-caption-12`

![preview](thumbs/hooks-captions-caption-12.png)  ![motion strip](thumbs/hooks-captions-caption-12-strip.jpg)

- pack: hooks-captions
- fonts: NHaasGroteskDSPro-75Bd
- effects used: Box Blur2, Fill, Geometry2

## Editable controls (defaults)

| control | value | font/size |
|---|---|---|
| Text 01 | I will | NHaasGroteskDSPro-75Bd 100 |
| Text 01 On / Off | True |  |
| Text 01 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Main Scale | 50 |  |
| Text 02 | explain | NHaasGroteskDSPro-75Bd 100 |
| Text 02 On / Off | True |  |
| Text 02 Color | #FFD100 |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Main Scale | 50 |  |
| Text 03 | how much | NHaasGroteskDSPro-75Bd 100 |
| Text 03 On / Off | True |  |
| Text 03 Color | #FFD100 |  |
| Main Position X | 0 |  |
| Main Position Y | -85 |  |
| Main Scale | 100 |  |
| Text 04 | do you need to start camper | NHaasGroteskDSPro-75Bd 100 |
| Text 04 On / Off | True |  |
| Text 04 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Main Scale | 40 |  |

## Comp `Caption 12` — 1080x1920 @ 25.0fps, 10.0s

### 0. Control Text 04 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 04 On / Off / Checkbox`: 1.0
- `Effects/Text 04 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Effects/Main Scale / Slider`: 40.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 1. Control Text 03 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 03 On / Off / Checkbox`: 1.0
- `Effects/Text 03 Color / Color`: [1.0, 0.8202, 0.0, 1.0] (#FFD100)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: -85.0
- `Effects/Main Scale / Slider`: 100.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 2. Control Text 02 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 02 On / Off / Checkbox`: 1.0
- `Effects/Text 02 Color / Color`: [1.0, 0.8196, 0.0, 1.0] (#FFD100)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Effects/Main Scale / Slider`: 50.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 3. Control Text 01 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 01 On / Off / Checkbox`: 1.0
- `Effects/Text 01 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Effects/Main Scale / Slider`: 50.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 4. Text 01 (AVLayer) in 0.0s → out 10.0s, precomp `Text 01`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 01").effect("Text 01 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [93.0, 36.0]
- `Effects/Transform / Position`: [93.0, 36.0]
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
- `Transform / Anchor Point`: [186.0, 36.0, 0.0]
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 01");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 01").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Rotation`: 0.0s=-120.0 → 1.0s=0.0 · interp linear
- `Transform / Opacity`: 0.0s=0.0 → 1.0s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 5. Text 02 (AVLayer) in 0.12s → out 10.0s, precomp `Text 02`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 02").effect("Text 02 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [161.0, 44.5]
- `Effects/Transform / Position`: [161.0, 44.5]
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
- `Effects/Fast Box Blur / Blur Radius`: 0.12s=50.0 → 1.12s=0.0 · interp linear
- `Effects/Fast Box Blur / Iterations`: 3.0
- `Effects/Fast Box Blur / Blur Dimensions`: 1.0
- `Effects/Fast Box Blur / Repeat Edge Pixels`: 1.0
- `Transform / Anchor Point`: [0.0, 44.5, 0.0]
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 02");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 02").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Rotation`: 0.12s=120.0 → 1.12s=0.0 · interp linear
- `Transform / Opacity`: 0.12s=0.0 → 1.12s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 6. Text 03 (AVLayer) in 0.24s → out 10.0s, precomp `Text 03`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 03").effect("Text 03 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [227.5, 37.0]
- `Effects/Transform / Position`: [227.5, 37.0]
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
- `Effects/Fast Box Blur / Blur Radius`: 0.24s=50.0 → 1.24s=0.0 · interp linear
- `Effects/Fast Box Blur / Iterations`: 3.0
- `Effects/Fast Box Blur / Blur Dimensions`: 1.0
- `Effects/Fast Box Blur / Repeat Edge Pixels`: 1.0
- `Transform / Position`: 0.24s=[1554.0, 1263.5048, 0.0] → 1.24s=[736.0, 1263.5048, 0.0] · interp linear · expr: `ctrl = thisComp.layer("Control Text 03");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 03").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.24s=0.0 → 1.24s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 7. Text 04 (AVLayer) in 0.4s → out 10.0s, precomp `Text 04`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 04").effect("Text 04 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [620.0, 44.5]
- `Effects/Transform / Position`: [620.0, 44.5]
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
- `Transform / Opacity`: 0.4s=0.0 → 1.4s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

## Comp `Text 01` — 186x72 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "I will", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7414, "all_caps": false}`
- `Transform / Anchor Point`: [-3.8549, -36.0031, 0.0]
- `Transform / Position`: [185.8049, 36.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 02` — 322x89 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "explain", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7413, "all_caps": false}`
- `Transform / Anchor Point`: [1.6113, -27.4933, 0.0]
- `Transform / Position`: [-0.1337, 44.5, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 03` — 455x74 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "how much", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Transform / Anchor Point`: [0.4032, -35.1974, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 04` — 1240x89 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "do you need to start camper", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1 / Offset`: 0.0s=-100.0 → 1.0s=100.0 · interp linear
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Based On`: 3.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Shape`: 2.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Ease Low`: 99.0
- `Text/Animators/Slide Down By Character/Properties / Position`: [0.0, 100.0, 0.0]
- `Text/Animators/Slide Down By Character/Properties / Opacity`: 0.0
- `Transform / Anchor Point`: [0.2866, -27.4933, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0


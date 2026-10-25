# Hook 03  ·  `hooks-captions-hook-03`

![preview](thumbs/hooks-captions-hook-03.png)  ![motion strip](thumbs/hooks-captions-hook-03-strip.jpg)

- pack: hooks-captions
- fonts: NHaasGroteskDSPro-75Bd
- effects used: Fill, Geometry2

## Editable controls (defaults)

| control | value | font/size |
|---|---|---|
| Text 01 | Small | NHaasGroteskDSPro-75Bd 100 |
| Text 01 On / Off | True |  |
| Text 01 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Text 02 | changes | NHaasGroteskDSPro-75Bd 100 |
| Text 02 On / Off | True |  |
| Text 02 Color | #00F9FF |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Text 03 | big | NHaasGroteskDSPro-75Bd 100 |
| Text 03 On / Off | True |  |
| Text 03 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Text 04 | results | NHaasGroteskDSPro-75Bd 100 |
| Text 04 On / Off | True |  |
| Text 04 Color | #F3FF00 |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Text 05 | Today, we will speak habits. | NHaasGroteskDSPro-75Bd 100 |
| Text 05 On / Off | True |  |
| Text 05 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Text 06 | Let's start video. | NHaasGroteskDSPro-75Bd 100 |
| Text 06 On / Off | True |  |
| Text 06 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Media 01 | None |  |

## Comp `Hook 03` — 1080x1920 @ 25.0fps, 6.0s

### 0. Control Text 06 (ShapeLayer) in 0.0s → out 6.0s
- `Effects/Text 06 On / Off / Checkbox`: 1.0
- `Effects/Text 06 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 1. Control Text 05 (ShapeLayer) in 0.0s → out 6.0s
- `Effects/Text 05 On / Off / Checkbox`: 1.0
- `Effects/Text 05 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 2. Control Text 04 (ShapeLayer) in 0.0s → out 6.0s
- `Effects/Text 04 On / Off / Checkbox`: 1.0
- `Effects/Text 04 Color / Color`: [0.9529, 1.0, 0.0, 1.0] (#F3FF00)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 3. Control Text 03 (ShapeLayer) in 0.0s → out 6.0s
- `Effects/Text 03 On / Off / Checkbox`: 1.0
- `Effects/Text 03 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 4. Control Text 02 (ShapeLayer) in 0.0s → out 6.0s
- `Effects/Text 02 On / Off / Checkbox`: 1.0
- `Effects/Text 02 Color / Color`: [0.0, 0.9771, 1.0, 1.0] (#00F9FF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 5. Control Text 01 (ShapeLayer) in 0.0s → out 6.0s
- `Effects/Text 01 On / Off / Checkbox`: 1.0
- `Effects/Text 01 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 6. Text 06 (AVLayer) in 3.4s → out 6.0s, precomp `Text 06`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 06").effect("Text 06 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [418.3111, 41.9719]
- `Effects/Transform / Position`: [417.6407, 41.9719]
- `Effects/Transform / Uniform Scale`: 1.0
- `Effects/Transform / Scale Height`: 100.0
- `Effects/Transform / Scale Width`: 100.0
- `Effects/Transform / Skew`: 0.0
- `Effects/Transform / Skew Axis`: 0.0
- `Effects/Transform / Rotation`: 0.0
- `Effects/Transform / Opacity`:  · expr: `thisComp.layer("Control Text 06").effect("Text 06 On / Off")("ADBE Checkbox Control-0001")*100`
- `Effects/Transform / Use Composition’s Shutter Angle`: 1.0
- `Effects/Transform / Shutter Angle`: 0.0
- `Effects/Transform / Sampling`: 1.0
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 06");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: [70.0, 70.0, 100.0]
- `Replace Source / Item Cache Entry`: None

### 7. Mask 2 (ShapeLayer) in 3.4s → out 6.0s
- `Contents/Group 1/Contents/Rectangle Path 1 / Size`: 3.4s=[900.0, 0.0] → 4.96s=[900.0, 1080.0] → 5.96s=[0.0, 0.0] · interp bezier,linear
- `Contents/Group 1/Contents/Rectangle Path 1 / Roundness`: 130.0
- `Contents/Group 1/Contents/Fill 1 / Color`: [0.7, 0.7, 0.7, 1.0] (#B2B2B2)
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 8. Mask (ShapeLayer) in 3.4s → out 6.0s
- `Contents/Group 1/Contents/Rectangle Path 1 / Size`: 3.4s=[900.0, 0.0] → 4.96s=[900.0, 1080.0] → 5.96s=[0.0, 0.0] · interp bezier,linear
- `Contents/Group 1/Contents/Rectangle Path 1 / Roundness`: 130.0
- `Contents/Group 1/Contents/Fill 1 / Color`: [0.7, 0.7, 0.7, 1.0] (#B2B2B2)
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 9. Media 01 (AVLayer) in 3.4s → out 6.0s, precomp `Media 01`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Replace Source / Item Cache Entry`: None

### 10. Text 05 (AVLayer) in 1.08s → out 3.4s, precomp `Text 05`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [700.2667, 51.0469]
- `Effects/Transform / Position`: [699.1444, 51.0469]
- `Effects/Transform / Uniform Scale`: 1.0
- `Effects/Transform / Scale Height`: 100.0
- `Effects/Transform / Scale Width`: 100.0
- `Effects/Transform / Skew`: 0.0
- `Effects/Transform / Skew Axis`: 0.0
- `Effects/Transform / Rotation`: 0.0
- `Effects/Transform / Opacity`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 On / Off")("ADBE Checkbox Control-0001")*100`
- `Effects/Transform / Use Composition’s Shutter Angle`: 1.0
- `Effects/Transform / Shutter Angle`: 0.0
- `Effects/Transform / Sampling`: 1.0
- `Transform / Position`: 2.56s=[515.7066, 1480.0228, 0.0] → 3.4s=[515.7066, 960.9815, 0.0] · interp bezier · expr: `ctrl = thisComp.layer("Control Text 05");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: [49.9772, 49.9772, 100.0]
- `Replace Source / Item Cache Entry`: None

### 11. Text 05 (AVLayer) in 1.44s → out 3.4s, precomp `Text 05`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [700.2667, 51.0469]
- `Effects/Transform / Position`: [699.1444, 51.0469]
- `Effects/Transform / Uniform Scale`: 1.0
- `Effects/Transform / Scale Height`: 100.0
- `Effects/Transform / Scale Width`: 100.0
- `Effects/Transform / Skew`: 0.0
- `Effects/Transform / Skew Axis`: 0.0
- `Effects/Transform / Rotation`: 0.0
- `Effects/Transform / Opacity`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 On / Off")("ADBE Checkbox Control-0001")*100`
- `Effects/Transform / Use Composition’s Shutter Angle`: 1.0
- `Effects/Transform / Shutter Angle`: 0.0
- `Effects/Transform / Sampling`: 1.0
- `Transform / Position`: 2.56s=[515.7066, 654.4228, 0.0] → 3.4s=[515.7066, 962.0132, 0.0] · interp bezier · expr: `ctrl = thisComp.layer("Control Text 05");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: [49.9772, 49.9772, 100.0]
- `Replace Source / Item Cache Entry`: None

### 12. Text 05 (AVLayer) in 1.2s → out 3.4s, precomp `Text 05`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [700.2667, 51.0469]
- `Effects/Transform / Position`: [699.1444, 51.0469]
- `Effects/Transform / Uniform Scale`: 1.0
- `Effects/Transform / Scale Height`: 100.0
- `Effects/Transform / Scale Width`: 100.0
- `Effects/Transform / Skew`: 0.0
- `Effects/Transform / Skew Axis`: 0.0
- `Effects/Transform / Rotation`: 0.0
- `Effects/Transform / Opacity`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 On / Off")("ADBE Checkbox Control-0001")*100`
- `Effects/Transform / Use Composition’s Shutter Angle`: 1.0
- `Effects/Transform / Shutter Angle`: 0.0
- `Effects/Transform / Sampling`: 1.0
- `Transform / Position`: 2.56s=[515.7066, 860.8228, 0.0] → 3.4s=[515.7066, 960.9815, 0.0] · interp bezier · expr: `ctrl = thisComp.layer("Control Text 05");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: [49.9772, 49.9772, 100.0]
- `Replace Source / Item Cache Entry`: None

### 13. Text 05 (AVLayer) in 1.56s → out 3.4s, precomp `Text 05`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [700.2667, 51.0469]
- `Effects/Transform / Position`: [699.1444, 51.0469]
- `Effects/Transform / Uniform Scale`: 1.0
- `Effects/Transform / Scale Height`: 100.0
- `Effects/Transform / Scale Width`: 100.0
- `Effects/Transform / Skew`: 0.0
- `Effects/Transform / Skew Axis`: 0.0
- `Effects/Transform / Rotation`: 0.0
- `Effects/Transform / Opacity`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 On / Off")("ADBE Checkbox Control-0001")*100`
- `Effects/Transform / Use Composition’s Shutter Angle`: 1.0
- `Effects/Transform / Shutter Angle`: 0.0
- `Effects/Transform / Sampling`: 1.0
- `Transform / Position`: 2.56s=[515.7066, 1067.2228, 0.0] → 3.4s=[515.7066, 962.0132, 0.0] · interp bezier · expr: `ctrl = thisComp.layer("Control Text 05");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: [49.9772, 49.9772, 100.0]
- `Replace Source / Item Cache Entry`: None

### 14. Text 05 (AVLayer) in 1.68s → out 3.4s, precomp `Text 05`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [700.2667, 51.0469]
- `Effects/Transform / Position`: [699.1444, 51.0469]
- `Effects/Transform / Uniform Scale`: 1.0
- `Effects/Transform / Scale Height`: 100.0
- `Effects/Transform / Scale Width`: 100.0
- `Effects/Transform / Skew`: 0.0
- `Effects/Transform / Skew Axis`: 0.0
- `Effects/Transform / Rotation`: 0.0
- `Effects/Transform / Opacity`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 On / Off")("ADBE Checkbox Control-0001")*100`
- `Effects/Transform / Use Composition’s Shutter Angle`: 1.0
- `Effects/Transform / Shutter Angle`: 0.0
- `Effects/Transform / Sampling`: 1.0
- `Transform / Position`: 2.56s=[515.7066, 1273.6228, 0.0] → 3.4s=[515.7066, 962.0132, 0.0] · interp bezier · expr: `ctrl = thisComp.layer("Control Text 05");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: [49.9772, 49.9772, 100.0]
- `Replace Source / Item Cache Entry`: None

### 15. Text 05 (AVLayer) in 1.32s → out 3.4s, precomp `Text 05`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [700.2667, 51.0469]
- `Effects/Transform / Position`: [699.1444, 51.0469]
- `Effects/Transform / Uniform Scale`: 1.0
- `Effects/Transform / Scale Height`: 100.0
- `Effects/Transform / Scale Width`: 100.0
- `Effects/Transform / Skew`: 0.0
- `Effects/Transform / Skew Axis`: 0.0
- `Effects/Transform / Rotation`: 0.0
- `Effects/Transform / Opacity`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 On / Off")("ADBE Checkbox Control-0001")*100`
- `Effects/Transform / Use Composition’s Shutter Angle`: 1.0
- `Effects/Transform / Shutter Angle`: 0.0
- `Effects/Transform / Sampling`: 1.0
- `Transform / Position`: 2.56s=[515.7066, 448.0228, 0.0] → 3.4s=[515.7066, 962.0132, 0.0] · interp bezier · expr: `ctrl = thisComp.layer("Control Text 05");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: [49.9772, 49.9772, 100.0]
- `Replace Source / Item Cache Entry`: None

### 16. Text 01 (AVLayer) in 0.0s → out 6.0s, precomp `Text 01`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 01").effect("Text 01 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [126.5, 39.0]
- `Effects/Transform / Position`: [126.5, 39.0]
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
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 01");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.0s=[0.0, 0.0, 100.0] → 0.48s=[100.0, 100.0, 100.0] · interp linear
- `Replace Source / Item Cache Entry`: None

### 17. Text 02 (AVLayer) in 0.2s → out 6.0s, precomp `Text 02`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 02").effect("Text 02 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [191.5, 45.0]
- `Effects/Transform / Position`: [191.5, 45.0]
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
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 02");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.2s=[0.0, 0.0, 100.0] → 0.68s=[100.0, 100.0, 100.0] · interp linear
- `Replace Source / Item Cache Entry`: None

### 18. Text 03 (AVLayer) in 0.4s → out 6.0s, precomp `Text 03`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 03").effect("Text 03 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [66.0, 45.0]
- `Effects/Transform / Position`: [66.0, 45.0]
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
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 03");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.4s=[0.0, 0.0, 100.0] → 0.88s=[100.0, 100.0, 100.0] · interp linear
- `Replace Source / Item Cache Entry`: None

### 19. Text 04 (AVLayer) in 0.6s → out 6.0s, precomp `Text 04`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 04").effect("Text 04 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [176.8, 41.9719]
- `Effects/Transform / Position`: [176.5167, 41.9719]
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
- `Transform / Scale`: 0.6s=[0.0, 0.0, 100.0] → 1.08s=[100.0, 100.0, 100.0] · interp linear
- `Replace Source / Item Cache Entry`: None

## Comp `Media 01` — 1080x1080 @ 60.0fps, 10.0s

## Comp `Text 01` — 253x78 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "Small", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/More Options / Grouping Alignment`: [0.0, -40.0]
- `Text/More Options / Fill & Stroke`: 2.0
- `Text/Animators/Blur & Fade/Selectors/Animation / Start`:  · expr: `100-effect("Blur & Fade Out - Animator Width")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation / Offset`:  · expr: `var a = effect("Blur & Fade Out - Completion")(1); var w = 100-effect("Blur & Fade Out - Animator Width")(1);  linear(a,0,100,-100,100-w);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Based On`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Shape`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease High`:  · expr: `effect("Blur & Fade Out - Ease Out")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease Low`:  · expr: `effect("Blur & Fade Out - Ease In")(1);`
- `Text/Animators/Blur & Fade/Properties / Position`:  · expr: `effect("Blur & Fade Out - Position")(1);`
- `Text/Animators/Blur & Fade/Properties / Scale`: [0.0, 0.0, 0.0] (#000000)
- `Text/Animators/Blur & Fade/Properties / Rotation`:  · expr: `effect("Blur & Fade Out - Rotation")(1);`
- `Text/Animators/Blur & Fade/Properties / Opacity`:  · expr: `effect("Opacity")("Slider")`
- `Text/Animators/Blur & Fade/Properties / Blur`:  · expr: `var b = effect("Blur & Fade Out - Blur Amount")(1); [b, b];`
- `Effects/Blur & Fade Out - Completion / Slider`: 0.12s=0.0 → 1.04s=100.0 · interp linear
- `Effects/Blur & Fade Out - Animator Width / Slider`: 100.0
- `Effects/Blur & Fade Out - Blur Amount / Slider`: 100.0
- `Effects/Blur & Fade Out - Position / Point`: [151.8, 0.0]
- `Effects/Blur & Fade Out - Rotation / Angle`: 53.0
- `Effects/Blur & Fade Out - Ease In / Slider`: 100.0
- `Effects/Blur & Fade Out - Ease Out / Slider`: 0.0
- `Transform / Anchor Point`: [-1.1721, -35.8017, 0.0]
- `Transform / Position`: [126.0, 37.4982, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 02` — 383x90 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "changes", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/More Options / Grouping Alignment`: [0.0, -40.0]
- `Text/More Options / Fill & Stroke`: 2.0
- `Text/Animators/Blur & Fade/Selectors/Animation / Start`:  · expr: `100-effect("Blur & Fade Out - Animator Width")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation / Offset`:  · expr: `var a = effect("Blur & Fade Out - Completion")(1); var w = 100-effect("Blur & Fade Out - Animator Width")(1);  linear(a,0,100,-100,100-w);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Based On`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Shape`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease High`:  · expr: `effect("Blur & Fade Out - Ease Out")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease Low`:  · expr: `effect("Blur & Fade Out - Ease In")(1);`
- `Text/Animators/Blur & Fade/Properties / Position`:  · expr: `effect("Blur & Fade Out - Position")(1);`
- `Text/Animators/Blur & Fade/Properties / Scale`: [0.0, 0.0, 0.0] (#000000)
- `Text/Animators/Blur & Fade/Properties / Rotation`:  · expr: `effect("Blur & Fade Out - Rotation")(1);`
- `Text/Animators/Blur & Fade/Properties / Opacity`:  · expr: `effect("Opacity")("Slider")`
- `Text/Animators/Blur & Fade/Properties / Blur`:  · expr: `var b = effect("Blur & Fade Out - Blur Amount")(1); [b, b];`
- `Effects/Blur & Fade Out - Completion / Slider`: 0.12s=0.0 → 1.04s=100.0 · interp linear
- `Effects/Blur & Fade Out - Animator Width / Slider`: 100.0
- `Effects/Blur & Fade Out - Blur Amount / Slider`: 100.0
- `Effects/Blur & Fade Out - Position / Point`: [229.8, 0.0]
- `Effects/Blur & Fade Out - Rotation / Angle`: 53.0
- `Effects/Blur & Fade Out - Ease In / Slider`: 100.0
- `Effects/Blur & Fade Out - Ease Out / Slider`: 0.0
- `Transform / Anchor Point`: [0.2791, -27.0905, 0.0]
- `Transform / Position`: [191.0, 52.2095, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 03` — 132x90 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "big", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/More Options / Grouping Alignment`: [0.0, -40.0]
- `Text/More Options / Fill & Stroke`: 2.0
- `Text/Animators/Blur & Fade/Selectors/Animation / Start`:  · expr: `100-effect("Blur & Fade Out - Animator Width")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation / Offset`:  · expr: `var a = effect("Blur & Fade Out - Completion")(1); var w = 100-effect("Blur & Fade Out - Animator Width")(1);  linear(a,0,100,-100,100-w);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Based On`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Shape`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease High`:  · expr: `effect("Blur & Fade Out - Ease Out")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease Low`:  · expr: `effect("Blur & Fade Out - Ease In")(1);`
- `Text/Animators/Blur & Fade/Properties / Position`:  · expr: `effect("Blur & Fade Out - Position")(1);`
- `Text/Animators/Blur & Fade/Properties / Scale`: [0.0, 0.0, 0.0] (#000000)
- `Text/Animators/Blur & Fade/Properties / Rotation`:  · expr: `effect("Blur & Fade Out - Rotation")(1);`
- `Text/Animators/Blur & Fade/Properties / Opacity`:  · expr: `effect("Opacity")("Slider")`
- `Text/Animators/Blur & Fade/Properties / Blur`:  · expr: `var b = effect("Blur & Fade Out - Blur Amount")(1); [b, b];`
- `Effects/Blur & Fade Out - Completion / Slider`: 0.12s=0.0 → 1.04s=100.0 · interp linear
- `Effects/Blur & Fade Out - Animator Width / Slider`: 100.0
- `Effects/Blur & Fade Out - Blur Amount / Slider`: 100.0
- `Effects/Blur & Fade Out - Position / Point`: [79.2, 0.0]
- `Effects/Blur & Fade Out - Rotation / Angle`: 53.0
- `Effects/Blur & Fade Out - Ease In / Slider`: 100.0
- `Effects/Blur & Fade Out - Ease Out / Slider`: 0.0
- `Transform / Anchor Point`: [0.4984, -27.1209, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 04` — 306x74 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "results", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/More Options / Grouping Alignment`: [0.0, -40.0]
- `Text/More Options / Fill & Stroke`: 2.0
- `Text/Animators/Blur & Fade/Selectors/Animation / Start`:  · expr: `100-effect("Blur & Fade Out - Animator Width")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation / Offset`:  · expr: `var a = effect("Blur & Fade Out - Completion")(1); var w = 100-effect("Blur & Fade Out - Animator Width")(1);  linear(a,0,100,-100,100-w);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Based On`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Shape`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease High`:  · expr: `effect("Blur & Fade Out - Ease Out")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease Low`:  · expr: `effect("Blur & Fade Out - Ease In")(1);`
- `Text/Animators/Blur & Fade/Properties / Position`:  · expr: `effect("Blur & Fade Out - Position")(1);`
- `Text/Animators/Blur & Fade/Properties / Scale`: [0.0, 0.0, 0.0] (#000000)
- `Text/Animators/Blur & Fade/Properties / Rotation`:  · expr: `effect("Blur & Fade Out - Rotation")(1);`
- `Text/Animators/Blur & Fade/Properties / Opacity`:  · expr: `effect("Opacity")("Slider")`
- `Text/Animators/Blur & Fade/Properties / Blur`:  · expr: `var b = effect("Blur & Fade Out - Blur Amount")(1); [b, b];`
- `Effects/Blur & Fade Out - Completion / Slider`: 0.12s=0.0 → 1.04s=100.0 · interp linear
- `Effects/Blur & Fade Out - Animator Width / Slider`: 100.0
- `Effects/Blur & Fade Out - Blur Amount / Slider`: 100.0
- `Effects/Blur & Fade Out - Position / Point`: [183.6, 0.0]
- `Effects/Blur & Fade Out - Rotation / Angle`: 53.0
- `Effects/Blur & Fade Out - Ease In / Slider`: 100.0
- `Effects/Blur & Fade Out - Ease Out / Slider`: 0.0
- `Transform / Anchor Point`: [1.4373, -35.1974, 0.0]
- `Transform / Position`: [153.0, 36.1025, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 05` — 1212x90 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "Today, we will speak habits.", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/Animators/Cursor Blink/Selectors/Expression Selector 1 / Amount`:  · expr: `textIndex === textTotal ? 100 : 0;`
- `Text/Animators/Cursor Blink/Properties / Opacity`:  · expr: `var showCursor = effect("Cursor On/Off")(1); var blinkSpeed = effect("Cursor Blink Speed")(1);  var animProp = effect("Animation")(1); var nearestAnimKey = animProp.nearestKey(time); var prevAnimKeyIndex = Math.max(nearestAnimKey.index - (nearestAnimKey.time > time), 1); var blink = Math.sin(Math.PI`
- `Effects/Animation / Slider`: 0.0s=0.0 → 1.28s=100.0 · interp linear
- `Effects/Cursor On/Off / Checkbox`: 1.0
- `Effects/Cursor Shape / Menu`: 1.0
- `Effects/Cursor Blink Speed / Slider`: 4.0
- `Transform / Anchor Point`: [-0.6721, -26.9897, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 06` — 724x74 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "Let's start video.", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1 / Offset`: 0.0s=-100.0 → 1.0s=100.0 · interp linear
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Based On`: 3.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Shape`: 2.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Ease Low`: 99.0
- `Text/Animators/Slide Down By Character/Properties / Position`: [0.0, 100.0, 0.0]
- `Text/Animators/Slide Down By Character/Properties / Opacity`: 0.0
- `Transform / Anchor Point`: [0.9392, -35.1974, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0


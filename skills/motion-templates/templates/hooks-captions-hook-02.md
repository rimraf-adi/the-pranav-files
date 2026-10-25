# Hook 02  ·  `hooks-captions-hook-02`

![preview](thumbs/hooks-captions-hook-02.png)  ![motion strip](thumbs/hooks-captions-hook-02-strip.jpg)

- pack: hooks-captions
- fonts: NHaasGroteskDSPro-75Bd
- effects used: Fill, Geometry2

## Editable controls (defaults)

| control | value | font/size |
|---|---|---|
| Text 01 | How | NHaasGroteskDSPro-75Bd 100 |
| Text 01 Color | #FFFFFF |  |
| Text 01 On / Off | True |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Text 02 | I made | NHaasGroteskDSPro-75Bd 100 |
| Text 02 On / Off | True |  |
| Text 02 Color | #00F9FF |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Text 03 | 500K$ | NHaasGroteskDSPro-75Bd 100 |
| Text 03 On / Off | True |  |
| Text 03 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Text 04 | last year! | NHaasGroteskDSPro-75Bd 100 |
| Text 04 On / Off | True |  |
| Text 04 Color | #F3FF00 |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Text 05 | I am explaining / my 5 secrets. | NHaasGroteskDSPro-75Bd 100 |
| Text 05 On / Off | True |  |
| Text 05 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | 0 |  |
| Media 01 | None |  |
| Media 02 | None |  |

## Comp `Hook 02` — 1080x1920 @ 25.0fps, 5.0s

### 0. Control Text 05 (ShapeLayer) in 0.0s → out 5.0s
- `Effects/Text 05 On / Off / Checkbox`: 1.0
- `Effects/Text 05 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 1. Control Text 04 (ShapeLayer) in 0.0s → out 5.0s
- `Effects/Text 04 On / Off / Checkbox`: 1.0
- `Effects/Text 04 Color / Color`: [0.9529, 1.0, 0.0, 1.0] (#F3FF00)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 2. Control Text 03 (ShapeLayer) in 0.0s → out 5.0s
- `Effects/Text 03 On / Off / Checkbox`: 1.0
- `Effects/Text 03 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 3. Control Text 02 (ShapeLayer) in 0.0s → out 5.0s
- `Effects/Text 02 On / Off / Checkbox`: 1.0
- `Effects/Text 02 Color / Color`: [0.0, 0.9771, 1.0, 1.0] (#00F9FF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 4. Control Text 01 (ShapeLayer) in 0.0s → out 5.0s
- `Effects/Text 01 On / Off / Checkbox`: 1.0
- `Effects/Text 01 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 0.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 5. Mask 2 (ShapeLayer) in 0.8s → out 2.16s, parent `Media 01`
- `Contents/Group 1/Contents/Rectangle Path 1 / Size`: [1080.0, 1080.0]
- `Contents/Group 1/Contents/Rectangle Path 1 / Roundness`: 1.76s=130.0 · interp bezier
- `Contents/Group 1/Contents/Fill 1 / Color`: [0.7, 0.7, 0.7, 1.0] (#B2B2B2)
- `Transform / Position`: [540.0, 540.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.8s=[0.0, 0.0, 100.0] → 1.8s=[100.0, 100.0, 100.0] · interp linear

### 6. Mask (ShapeLayer) in 0.8s → out 2.16s, parent `Media 01`
- `Contents/Group 1/Contents/Rectangle Path 1 / Size`: [1080.0, 1080.0]
- `Contents/Group 1/Contents/Rectangle Path 1 / Roundness`: 1.76s=130.0 · interp bezier
- `Contents/Group 1/Contents/Fill 1 / Color`: [0.7, 0.7, 0.7, 1.0] (#B2B2B2)
- `Transform / Position`: [540.0, 540.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.8s=[0.0, 0.0, 100.0] → 1.8s=[100.0, 100.0, 100.0] · interp linear

### 7. Text 05 (AVLayer) in 2.16s → out 5.0s, parent `Media 02`, precomp `Text 05`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 05").effect("Text 05 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [379.0222, 107.1984]
- `Effects/Transform / Position`: [378.4148, 107.1984]
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
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 05");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Replace Source / Item Cache Entry`: None

### 8. Mask 3 (ShapeLayer) in 2.16s → out 5.0s, parent `Media 02`
- `Contents/Group 1/Contents/Rectangle Path 1 / Size`: 2.8s=[1080.0, 1600.0] → 4.64s=[1080.0, 0.0] · interp bezier
- `Contents/Group 1/Contents/Rectangle Path 1 / Roundness`: 130.0
- `Contents/Group 1/Contents/Fill 1 / Color`: [0.7, 0.7, 0.7, 1.0] (#B2B2B2)
- `Contents/Stroke 1 / Stroke Width`: 4.44s=2.0 → 4.64s=0.0 · interp linear
- `Transform / Position`: [540.0, 800.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 9. Mask (ShapeLayer) in 2.16s → out 5.0s, parent `Media 02`
- `Contents/Group 1/Contents/Rectangle Path 1 / Size`: 2.8s=[1080.0, 1600.0] → 4.64s=[1080.0, 0.0] · interp bezier
- `Contents/Group 1/Contents/Rectangle Path 1 / Roundness`: 130.0
- `Contents/Group 1/Contents/Fill 1 / Color`: [0.7, 0.7, 0.7, 1.0] (#B2B2B2)
- `Transform / Position`: [540.0, 800.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 10. Media 02 (AVLayer) in 2.16s → out 5.0s, precomp `Media 02`
- `Transform / Position`: 1.68s=[515.7066, 1426.7197, 0.0] → 2.64s=[540.0, 960.0, 0.0] · interp bezier
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.6s=[0.0, 0.0, 100.0] → 1.6s=[50.0, 50.0, 100.0] → 1.68s=[50.0, 50.0, 100.0] → 2.64s=[100.0, 100.0, 100.0] · interp bezier,linear
- `Replace Source / Item Cache Entry`: None

### 11. Media 01 (AVLayer) in 0.6s → out 2.16s, precomp `Media 01`
- `Transform / Position`: 1.68s=[515.7066, 1426.7197, 0.0] → 2.64s=[540.0, 960.0, 0.0] · interp bezier
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.6s=[0.0, 0.0, 100.0] → 1.6s=[50.0, 50.0, 100.0] → 1.68s=[50.0, 50.0, 100.0] → 2.64s=[100.0, 100.0, 100.0] · interp bezier,linear
- `Replace Source / Item Cache Entry`: None

### 12. Text 01 (AVLayer) in 0.0s → out 5.0s, precomp `Text 01`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 01").effect("Text 01 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [100.0, 37.0]
- `Effects/Transform / Position`: [100.0, 37.0]
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
- `Transform / Position`: 1.0s=[281.296, 799.5828, 0.0] → 1.8s=[1515.296, 799.5828, 0.0] · interp bezier · expr: `ctrl = thisComp.layer("Control Text 01");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.0s=[0.0, 0.0, 100.0] → 1.0s=[60.0, 60.0, 100.0] · interp linear
- `Replace Source / Item Cache Entry`: None

### 13. Text 02 (AVLayer) in 0.2s → out 5.0s, precomp `Text 02`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 02").effect("Text 02 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [146.5, 37.0]
- `Effects/Transform / Position`: [146.5, 37.0]
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
- `Transform / Position`: 1.2s=[441.3997, 869.2222, 0.0] → 2.0s=[1675.3997, 869.2222, 0.0] · interp bezier · expr: `ctrl = thisComp.layer("Control Text 02");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.2s=[0.0, 0.0, 100.0] → 1.2s=[120.0, 120.0, 100.0] · interp linear
- `Replace Source / Item Cache Entry`: None

### 14. Text 03 (AVLayer) in 0.4s → out 5.0s, precomp `Text 03`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 03").effect("Text 03 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [159.5, 43.5]
- `Effects/Transform / Position`: [159.5, 43.5]
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
- `Transform / Position`: 1.4s=[607.2875, 985.8535, 0.0] → 2.2s=[1841.2875, 985.8535, 0.0] · interp bezier · expr: `ctrl = thisComp.layer("Control Text 03");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.4s=[0.0, 0.0, 100.0] → 1.4s=[180.0, 180.0, 100.0] · interp linear
- `Replace Source / Item Cache Entry`: None

### 15. Text 04 (AVLayer) in 0.6s → out 5.0s, precomp `Text 04`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 04").effect("Text 04 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [228.2222, 50.4797]
- `Effects/Transform / Position`: [227.8565, 50.4797]
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
- `Transform / Position`: 1.6s=[626.9719, 1100.0823, 0.0] → 2.4s=[1860.9718, 1100.0823, 0.0] · interp bezier · expr: `ctrl = thisComp.layer("Control Text 04");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: 0.6s=[0.0, 0.0, 100.0] → 1.6s=[90.0, 90.0, 100.0] · interp linear
- `Replace Source / Item Cache Entry`: None

## Comp `Media 01` — 1080x1080 @ 60.0fps, 10.0s

## Comp `Media 02` — 1080x1600 @ 60.0fps, 10.0s

## Comp `Text 01` — 200x74 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "How", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/More Options / Grouping Alignment`: [0.0, -40.0]
- `Text/More Options / Fill & Stroke`: 2.0
- `Transform / Anchor Point`: [23.0251, -34.2999, 0.0]
- `Transform / Position`: [118.0, 37.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 02` — 293x74 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "I made", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Transform / Anchor Point`: [1.9606, -35.1974, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 03` — 319x87 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "500K$", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Transform / Anchor Point`: [-0.6355, -33.0826, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 04` — 395x89 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "last year!", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Transform / Anchor Point`: [-0.259, -27.4933, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 05` — 656x189 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "I am explaining\nmy 5 secrets.", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1 / Offset`: 0.0s=-100.0 → 1.0s=100.0 · interp linear
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Based On`: 3.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Shape`: 2.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Ease Low`: 99.0
- `Text/Animators/Slide Down By Character/Properties / Position`: [0.0, 100.0, 0.0]
- `Text/Animators/Slide Down By Character/Properties / Opacity`: 0.0
- `Transform / Anchor Point`: [0.7564, 22.5067, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0


# Hook 05  ·  `hooks-captions-hook-05`

![preview](thumbs/hooks-captions-hook-05.png)  ![motion strip](thumbs/hooks-captions-hook-05-strip.jpg)

- pack: hooks-captions
- fonts: NHaasGroteskDSPro-75Bd, PlayfairDisplay-BoldItalic
- effects used: Fill, Geometry2

## Editable controls (defaults)

| control | value | font/size |
|---|---|---|
| Text 01 | 7 | NHaasGroteskDSPro-75Bd 100 |
| Text 01 On / Off | True |  |
| Text 01 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | 85 |  |
| Main Scale | 350 |  |
| Text 02 | Advices | PlayfairDisplay-BoldItalic 100 |
| Text 02 On / Off | True |  |
| Text 02 Color | #00F9FF |  |
| Main Position X | 106 |  |
| Main Position Y | -32 |  |
| Main Scale | 150 |  |
| Text 03 | from | NHaasGroteskDSPro-75Bd 100 |
| Text 03 On / Off | True |  |
| Text 03 Color | #FFFFFF |  |
| Main Position X | 0 |  |
| Main Position Y | -85 |  |
| Main Scale | 70 |  |
| Text 04 | seven / millionaire woman. | NHaasGroteskDSPro-75Bd 100 |
| Text 04 On / Off | True |  |
| Text 04 Color | #F3FF00 |  |
| Main Position X | 0 |  |
| Main Position Y | -113 |  |
| Main Scale | 150 |  |
| Media 01 | None |  |

## Comp `Hook 05` — 1080x1920 @ 25.0fps, 5.0s

### 0. Control Text 04 (ShapeLayer) in 0.0s → out 5.0s
- `Effects/Text 04 On / Off / Checkbox`: 1.0
- `Effects/Text 04 Color / Color`: [0.9529, 1.0, 0.0, 1.0] (#F3FF00)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: -113.0
- `Effects/Main Scale / Slider`: 150.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 1. Control Text 03 (ShapeLayer) in 0.0s → out 5.0s
- `Effects/Text 03 On / Off / Checkbox`: 1.0
- `Effects/Text 03 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: -85.0
- `Effects/Main Scale / Slider`: 70.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 2. Control Text 02 (ShapeLayer) in 0.0s → out 5.0s
- `Effects/Text 02 On / Off / Checkbox`: 1.0
- `Effects/Text 02 Color / Color`: [0.0, 0.9771, 1.0, 1.0] (#00F9FF)
- `Effects/Main Position X / Slider`: 106.0
- `Effects/Main Position Y / Slider`: -32.0
- `Effects/Main Scale / Slider`: 150.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 3. Control Text 01 (ShapeLayer) in 0.0s → out 5.0s
- `Effects/Text 01 On / Off / Checkbox`: 1.0
- `Effects/Text 01 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 0.0
- `Effects/Main Position Y / Slider`: 85.0
- `Effects/Main Scale / Slider`: 350.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 4. Mask 2 (ShapeLayer) in 0.0s → out 5.0s, parent `Media 01`
- `Contents/Group 1/Contents/Rectangle Path 1 / Size`: 0.0s=[0.0, 1080.0] → 1.04s=[1080.0, 1080.0] → 2.52s=[1080.0, 1080.0] → 3.92s=[0.0, 1080.0] · interp linear
- `Contents/Group 1/Contents/Rectangle Path 1 / Roundness`: 130.0
- `Contents/Group 1/Contents/Fill 1 / Color`: [0.7, 0.7, 0.7, 1.0] (#B2B2B2)
- `Contents/Group 1/Contents/Stroke 1 / Stroke Width`: 3.48s=2.0 → 3.92s=0.0 · interp linear
- `Transform / Position`: [540.0, 540.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 5. Mask (ShapeLayer) in 0.0s → out 5.0s, parent `Media 01`
- `Contents/Group 1/Contents/Rectangle Path 1 / Size`: 0.0s=[0.0, 1080.0] → 1.04s=[1080.0, 1080.0] → 2.52s=[1080.0, 1080.0] → 3.92s=[0.0, 1080.0] · interp linear
- `Contents/Group 1/Contents/Rectangle Path 1 / Roundness`: 130.0
- `Contents/Group 1/Contents/Fill 1 / Color`: [0.7, 0.7, 0.7, 1.0] (#B2B2B2)
- `Transform / Position`: [540.0, 540.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 6. Media 01 (AVLayer) in 0.0s → out 5.0s, precomp `Media 01`
- `Transform / Position`: 0.0s=[-526.0, 1327.0, 0.0] → 1.04s=[540.0, 1327.0, 0.0] · interp linear
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`: [50.0, 50.0, 100.0]
- `Replace Source / Item Cache Entry`: None

### 7. Text 01 (AVLayer) in 0.0s → out 5.0s, precomp `Text 01`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 01").effect("Text 01 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [25.5, 34.5]
- `Effects/Transform / Position`: [25.5, 34.5]
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
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 01").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.0s=0.0 → 1.0s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 8. Text 02 (AVLayer) in 0.12s → out 5.0s, precomp `Text 02`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 02").effect("Text 02 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [176.0, 40.5]
- `Effects/Transform / Position`: [176.0, 40.5]
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
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 02").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.12s=0.0 → 1.12s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 9. Text 03 (AVLayer) in 0.24s → out 5.0s, precomp `Text 03`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 03").effect("Text 03 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [106.5, 37.0]
- `Effects/Transform / Position`: [106.5, 37.0]
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
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 03").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.24s=0.0 → 1.24s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 10. Text 04 (AVLayer) in 0.4s → out 5.0s, precomp `Text 04`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 04").effect("Text 04 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [245.0, 77.5]
- `Effects/Transform / Position`: [245.0, 77.5]
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

## Comp `Media 01` — 1080x1080 @ 60.0fps, 10.0s

## Comp `Text 01` — 51x69 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "7", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/More Options / Grouping Alignment`: [0.0, -40.0]
- `Text/More Options / Fill & Stroke`: 2.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1 / Offset`: 0.0s=-100.0 → 1.52s=100.0 · interp linear
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Based On`: 3.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Shape`: 2.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Ease Low`: 99.0
- `Text/Animators/Slide Down By Character/Properties / Position`: [0.0, 100.0, 0.0]
- `Text/Animators/Slide Down By Character/Properties / Opacity`: 0.0
- `Text/Animators/Blur & Fade/Selectors/Animation / Start`:  · expr: `100-effect("Blur & Fade Out - Animator Width")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation / Offset`:  · expr: `var a = effect("Blur & Fade Out - Completion")(1);  var w = 100-effect("Blur & Fade Out - Animator Width")(1);    linear(a,0,100,-100,100-w);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Shape`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease High`:  · expr: `effect("Blur & Fade Out - Ease Out")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease Low`:  · expr: `effect("Blur & Fade Out - Ease In")(1);`
- `Text/Animators/Blur & Fade/Properties / Position`:  · expr: `effect("Blur & Fade Out - Position")(1);`
- `Text/Animators/Blur & Fade/Properties / Scale`: [0.0, 0.0, 0.0] (#000000)
- `Text/Animators/Blur & Fade/Properties / Rotation`:  · expr: `effect("Blur & Fade Out - Rotation")(1);`
- `Text/Animators/Blur & Fade/Properties / Opacity`:  · expr: `effect("Opacity")("Slider")`
- `Text/Animators/Blur & Fade/Properties / Blur`:  · expr: `var b = effect("Blur & Fade Out - Blur Amount")(1);  [b, b];`
- `Effects/Blur & Fade Out - Completion / Slider`: 2.0s=0.0 → 3.44s=100.0 · interp linear
- `Effects/Blur & Fade Out - Animator Width / Slider`: 100.0
- `Effects/Blur & Fade Out - Blur Amount / Slider`: 100.0
- `Effects/Blur & Fade Out - Position / Point`: [10.4615, 0.0]
- `Effects/Blur & Fade Out - Rotation / Angle`: 53.0
- `Effects/Blur & Fade Out - Ease In / Slider`: 100.0
- `Effects/Blur & Fade Out - Ease Out / Slider`: 0.0
- `Transform / Anchor Point`: [10.4614, -34.2999, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 02` — 352x81 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "Advices", "font": "PlayfairDisplay-BoldItalic", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/More Options / Grouping Alignment`: [0.0, -40.0]
- `Text/More Options / Fill & Stroke`: 2.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1 / Offset`: 0.0s=-100.0 → 1.0s=100.0 · interp linear
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Based On`: 3.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Shape`: 2.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Ease Low`: 99.0
- `Text/Animators/Slide Down By Character/Properties / Position`: [0.0, 100.0, 0.0]
- `Text/Animators/Slide Down By Character/Properties / Opacity`: 0.0
- `Text/Animators/Blur & Fade/Selectors/Animation / Start`:  · expr: `100-effect("Blur & Fade Out - Animator Width")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation / Offset`:  · expr: `var a = effect("Blur & Fade Out - Completion")(1); var w = 100-effect("Blur & Fade Out - Animator Width")(1);  linear(a,0,100,-100,100-w);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Shape`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease High`:  · expr: `effect("Blur & Fade Out - Ease Out")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease Low`:  · expr: `effect("Blur & Fade Out - Ease In")(1);`
- `Text/Animators/Blur & Fade/Properties / Position`:  · expr: `effect("Blur & Fade Out - Position")(1);`
- `Text/Animators/Blur & Fade/Properties / Scale`: [0.0, 0.0, 0.0] (#000000)
- `Text/Animators/Blur & Fade/Properties / Rotation`:  · expr: `effect("Blur & Fade Out - Rotation")(1);`
- `Text/Animators/Blur & Fade/Properties / Opacity`:  · expr: `effect("Opacity")("Slider")`
- `Text/Animators/Blur & Fade/Properties / Blur`:  · expr: `var b = effect("Blur & Fade Out - Blur Amount")(1); [b, b];`
- `Effects/Blur & Fade Out - Completion / Slider`: 1.96s=0.0 → 3.12s=100.0 · interp linear
- `Effects/Blur & Fade Out - Animator Width / Slider`: 100.0
- `Effects/Blur & Fade Out - Blur Amount / Slider`: 100.0
- `Effects/Blur & Fade Out - Position / Point`: [120.0, 0.0]
- `Effects/Blur & Fade Out - Rotation / Angle`: 53.0
- `Effects/Blur & Fade Out - Ease In / Slider`: 100.0
- `Effects/Blur & Fade Out - Ease Out / Slider`: 0.0
- `Transform / Anchor Point`: [-4.9805, -39.0381, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 03` — 213x74 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "from", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7415, "all_caps": false}`
- `Text/More Options / Grouping Alignment`: [0.0, -40.0]
- `Text/More Options / Fill & Stroke`: 2.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1 / Offset`: 0.0s=-100.0 → 1.0s=100.0 · interp linear
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Based On`: 3.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Shape`: 2.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Ease Low`: 99.0
- `Text/Animators/Slide Down By Character/Properties / Position`: [0.0, 100.0, 0.0]
- `Text/Animators/Slide Down By Character/Properties / Opacity`: 0.0
- `Text/Animators/Blur & Fade/Selectors/Animation / Start`:  · expr: `100-effect("Blur & Fade Out - Animator Width")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation / Offset`:  · expr: `var a = effect("Blur & Fade Out - Completion")(1); var w = 100-effect("Blur & Fade Out - Animator Width")(1);  linear(a,0,100,-100,100-w);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Shape`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease High`:  · expr: `effect("Blur & Fade Out - Ease Out")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease Low`:  · expr: `effect("Blur & Fade Out - Ease In")(1);`
- `Text/Animators/Blur & Fade/Properties / Position`:  · expr: `effect("Blur & Fade Out - Position")(1);`
- `Text/Animators/Blur & Fade/Properties / Scale`: [0.0, 0.0, 0.0] (#000000)
- `Text/Animators/Blur & Fade/Properties / Rotation`:  · expr: `effect("Blur & Fade Out - Rotation")(1);`
- `Text/Animators/Blur & Fade/Properties / Opacity`:  · expr: `effect("Opacity")("Slider")`
- `Text/Animators/Blur & Fade/Properties / Blur`:  · expr: `var b = effect("Blur & Fade Out - Blur Amount")(1); [b, b];`
- `Effects/Blur & Fade Out - Completion / Slider`: 1.92s=0.0 → 3.2s=100.0 · interp linear
- `Effects/Blur & Fade Out - Animator Width / Slider`: 100.0
- `Effects/Blur & Fade Out - Blur Amount / Slider`: 100.0
- `Effects/Blur & Fade Out - Position / Point`: [120.0, 0.0]
- `Effects/Blur & Fade Out - Rotation / Angle`: 53.0
- `Effects/Blur & Fade Out - Ease In / Slider`: 100.0
- `Effects/Blur & Fade Out - Ease Out / Slider`: 0.0
- `Transform / Anchor Point`: [-0.9009, -35.4996, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 04` — 490x155 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "seven\nmillionaire woman.", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7413, "all_caps": false}`
- `Text/More Options / Grouping Alignment`: [0.0, -40.0]
- `Text/More Options / Fill & Stroke`: 2.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1 / Offset`: 0.0s=-100.0 → 1.0s=100.0 · interp linear
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Based On`: 3.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Shape`: 2.0
- `Text/Animators/Slide Down By Character/Selectors/Range Selector 1/Advanced / Ease Low`: 99.0
- `Text/Animators/Slide Down By Character/Properties / Position`: [0.0, 100.0, 0.0]
- `Text/Animators/Slide Down By Character/Properties / Opacity`: 0.0
- `Text/Animators/Blur & Fade/Selectors/Animation / Start`:  · expr: `100-effect("Blur & Fade Out - Animator Width")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation / Offset`:  · expr: `var a = effect("Blur & Fade Out - Completion")(1); var w = 100-effect("Blur & Fade Out - Animator Width")(1);  linear(a,0,100,-100,100-w);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Shape`: 3.0
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease High`:  · expr: `effect("Blur & Fade Out - Ease Out")(1);`
- `Text/Animators/Blur & Fade/Selectors/Animation/Advanced / Ease Low`:  · expr: `effect("Blur & Fade Out - Ease In")(1);`
- `Text/Animators/Blur & Fade/Properties / Position`:  · expr: `effect("Blur & Fade Out - Position")(1);`
- `Text/Animators/Blur & Fade/Properties / Scale`: [0.0, 0.0, 0.0] (#000000)
- `Text/Animators/Blur & Fade/Properties / Rotation`:  · expr: `effect("Blur & Fade Out - Rotation")(1);`
- `Text/Animators/Blur & Fade/Properties / Opacity`:  · expr: `effect("Opacity")("Slider")`
- `Text/Animators/Blur & Fade/Properties / Blur`:  · expr: `var b = effect("Blur & Fade Out - Blur Amount")(1); [b, b];`
- `Effects/Blur & Fade Out - Completion / Slider`: 1.84s=0.0 → 3.2s=100.0 · interp linear
- `Effects/Blur & Fade Out - Animator Width / Slider`: 100.0
- `Effects/Blur & Fade Out - Blur Amount / Slider`: 100.0
- `Effects/Blur & Fade Out - Position / Point`: [120.0, 0.0]
- `Effects/Blur & Fade Out - Rotation / Angle`: 53.0
- `Effects/Blur & Fade Out - Ease In / Slider`: 100.0
- `Effects/Blur & Fade Out - Ease Out / Slider`: 0.0
- `Transform / Anchor Point`: [0.8057, -53.0731, 0.0]
- `Transform / Position`: [0.181, 0.1578, 0.0] (#2E2800)
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0


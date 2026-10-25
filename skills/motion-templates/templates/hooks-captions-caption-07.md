# Caption 07  ·  `hooks-captions-caption-07`

![preview](thumbs/hooks-captions-caption-07.png)  ![motion strip](thumbs/hooks-captions-caption-07-strip.jpg)

- pack: hooks-captions
- fonts: NHaasGroteskDSPro-75Bd
- effects used: Box Blur2, Fill, Geometry2

## Editable controls (defaults)

| control | value | font/size |
|---|---|---|
| Text 01 | One | NHaasGroteskDSPro-75Bd 100 |
| Text 01 On / Off | True |  |
| Text 01 Color | #FFFFFF |  |
| Main Scale | 50 |  |
| Main Position X | 50 |  |
| Main Position Y | 19 |  |
| Text 02 | move | NHaasGroteskDSPro-75Bd 100 |
| Text 02 On / Off | True |  |
| Text 02 Color | #FFF100 |  |
| Main Position X | 50 |  |
| Main Position Y | 0 |  |
| Main Scale | 75 |  |
| Text 03 | changes | NHaasGroteskDSPro-75Bd 100 |
| Text 03 On / Off | True |  |
| Text 03 Color | #00FFF6 |  |
| Main Position X | 50 |  |
| Main Position Y | 0 |  |
| Main Scale | 150 |  |
| Text 04 | everything. | NHaasGroteskDSPro-75Bd 100 |
| Text 04 On / Off | True |  |
| Text 04 Color | #FFFFFF |  |
| Main Position X | 50 |  |
| Main Position Y | 0 |  |
| Main Scale | 50 |  |

## Comp `Caption 07` — 1080x1920 @ 25.0fps, 10.0s

### 0. Control Text 04 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 04 On / Off / Checkbox`: 1.0
- `Effects/Text 04 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 50.0
- `Effects/Main Position Y / Slider`: 0.0
- `Effects/Main Scale / Slider`: 50.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 1. Control Text 03 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 03 On / Off / Checkbox`: 1.0
- `Effects/Text 03 Color / Color`: [0.0, 1.0, 0.9662, 1.0] (#00FFF6)
- `Effects/Main Position X / Slider`: 50.0
- `Effects/Main Position Y / Slider`: 0.0
- `Effects/Main Scale / Slider`: 150.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 2. Control Text 02 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 02 On / Off / Checkbox`: 1.0
- `Effects/Text 02 Color / Color`: [1.0, 0.9448, 0.0, 1.0] (#FFF100)
- `Effects/Main Position X / Slider`: 50.0
- `Effects/Main Position Y / Slider`: 0.0
- `Effects/Main Scale / Slider`: 75.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 3. Control Text 01 (ShapeLayer) in 0.0s → out 10.0s
- `Effects/Text 01 On / Off / Checkbox`: 1.0
- `Effects/Text 01 Color / Color`: [1.0, 1.0, 1.0, 1.0] (#FFFFFF)
- `Effects/Main Position X / Slider`: 50.0
- `Effects/Main Position Y / Slider`: 19.0
- `Effects/Main Scale / Slider`: 50.0
- `Transform / Position`: [362.5, 35.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

### 4. Text 01 (AVLayer) in 0.0s → out 10.0s, precomp `Text 01`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 01").effect("Text 01 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [92.5, 37.5]
- `Effects/Transform / Position`: 0.0s=[-4.7963, 37.5] → 1.0s=[92.5, 37.5] · interp linear
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
- `Effects/Fast Box Blur / Blur Radius`: 0.0s=15.0 → 1.0s=0.0 · interp linear
- `Effects/Fast Box Blur / Iterations`: 3.0
- `Effects/Fast Box Blur / Blur Dimensions`: 1.0
- `Effects/Fast Box Blur / Repeat Edge Pixels`: 1.0
- `Transform / Anchor Point`: [185.0, 75.0, 0.0]
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 01");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 01").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.0s=0.0 → 1.0s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 5. Text 02 (AVLayer) in 0.16s → out 10.0s, precomp `Text 02`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 02").effect("Text 02 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [99.4074, 35.7214]
- `Effects/Transform / Position`: 0.16s=[-68.6815, 35.7214] → 1.24s=[99.4074, 35.7214] · interp linear
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
- `Effects/Fast Box Blur / Blur Radius`: 0.16s=15.0 → 1.16s=0.0 · interp linear
- `Effects/Fast Box Blur / Iterations`: 3.0
- `Effects/Fast Box Blur / Blur Dimensions`: 1.0
- `Effects/Fast Box Blur / Repeat Edge Pixels`: 1.0
- `Transform / Anchor Point`: [244.0, -0.0, 0.0]
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 02");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 02").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.16s=0.0 → 1.16s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 6. Text 03 (AVLayer) in 0.0s → out 10.0s, precomp `Text 03`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 03").effect("Text 03 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [191.5, 61.4531]
- `Effects/Transform / Position`: [191.5, 61.4531]
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
- `Effects/Fast Box Blur / Blur Radius`: 0.0s=15.0 → 1.0s=0.0 · interp linear
- `Effects/Fast Box Blur / Iterations`: 3.0
- `Effects/Fast Box Blur / Blur Dimensions`: 1.0
- `Effects/Fast Box Blur / Repeat Edge Pixels`: 1.0
- `Transform / Anchor Point`: [0.0, 45.0, 0.0]
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 03");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 03").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.0s=0.0 → 1.0s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

### 7. Text 04 (AVLayer) in 0.6s → out 10.0s, precomp `Text 04`
- `Effects/Fill / Color`:  · expr: `thisComp.layer("Control Text 04").effect("Text 04 Color")("ADBE Color Control-0001")`
- `Effects/Fill / Opacity`: 1.0
- `Effects/Transform / Anchor Point`: [252.0, 45.0]
- `Effects/Transform / Position`: [252.0, 45.0]
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
- `Effects/Fast Box Blur / Blur Radius`: 0.6s=15.0 → 1.6s=0.0 · interp linear
- `Effects/Fast Box Blur / Iterations`: 3.0
- `Effects/Fast Box Blur / Blur Dimensions`: 1.0
- `Effects/Fast Box Blur / Repeat Edge Pixels`: 1.0
- `Transform / Anchor Point`: [504.0, 0.0, 0.0]
- `Transform / Position`:  · expr: `ctrl = thisComp.layer("Control Text 04");  x = ctrl.effect("Main Position X")("Slider"); y = ctrl.effect("Main Position Y")("Slider");  value + [x,y]`
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0
- `Transform / Scale`:  · expr: `temp = thisComp.layer("Control Text 04").effect("Main Scale")("ADBE Slider Control-0001"); [temp, temp]`
- `Transform / Opacity`: 0.6s=0.0 → 1.6s=100.0 · interp linear
- `Replace Source / Item Cache Entry`: None

## Comp `Text 01` — 185x75 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "One", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7414, "all_caps": false}`
- `Transform / Anchor Point`: [-1.1141, -35.8521, 0.0]
- `Transform / Position`: [184.7859, 37.5, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 02` — 244x55 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "move", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7414, "all_caps": false}`
- `Transform / Anchor Point`: [-1.1141, -25.7309, 0.0]
- `Transform / Position`: [244.0791, 27.5, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 03` — 383x90 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "changes", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7413, "all_caps": false}`
- `Text/Animators/Cursor Blink/Selectors/Expression Selector 1 / Amount`:  · expr: `textIndex === textTotal ? 100 : 0;`
- `Text/Animators/Cursor Blink/Properties / Opacity`:  · expr: `var showCursor = effect("Cursor On/Off")(1); var blinkSpeed = effect("Cursor Blink Speed")(1);  var animProp = effect("Animation")(1); var nearestAnimKey = animProp.nearestKey(time); var prevAnimKeyIndex = Math.max(nearestAnimKey.index - (nearestAnimKey.time > time), 1); var blink = Math.sin(Math.PI`
- `Effects/Animation / Slider`: 0.0s=0.0 → 0.801s=100.0 · interp linear
- `Effects/Cursor On/Off / Checkbox`: 0.68s=1.0 → 2.0s=0.0 · interp hold
- `Effects/Cursor Shape / Menu`: 1.0
- `Effects/Cursor Blink Speed / Slider`: 2.0
- `Transform / Anchor Point`: [1.6113, -29.0543, 0.0]
- `Transform / Position`: [-0.2178, 43.0362, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0

## Comp `Text 04` — 504x90 @ 25.0fps, 12.24s

### 0. Text (TextLayer) in 0.0s → out 12.24s
- text doc: `{"text": "everything.", "font": "NHaasGroteskDSPro-75Bd", "font_size": 100.0, "fill_color": [1.0, 1.0, 1.0], "stroke_color": [0.0, 0.0, 0.0], "stroke_width": 2.0, "tracking": 0, "leading": 100.0, "justification": 7413, "all_caps": false}`
- `Transform / Anchor Point`: [1.6113, -27.0905, 0.0]
- `Transform / Position`: [-0.1662, 45.0, 0.0]
- `Transform / X Position`: 0.0
- `Transform / Y Position`: 0.0


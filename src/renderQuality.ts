// Render-quality knob for the 3D canvas.
//
// The composition still outputs 1080x1920, but the WebGL canvas can be
// rasterized at a fraction of that resolution and upscaled. On machines
// without usable GPU acceleration (e.g. Intel HD 2000 + SwiftShader), fill
// rate is the main cost per frame, so lowering this is the biggest speedup.
//
// 1 = native resolution (sharpest, slowest)
// 0.5 = half resolution (good balance)
// 0.35 = draft
export const CANVAS_SCALE = 1.0;

// Shadow maps are the most expensive pass on CPU renderers.
export const SHADOWS = true;

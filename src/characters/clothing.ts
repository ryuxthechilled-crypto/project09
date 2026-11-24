import * as THREE from 'three';
import { TopStyle } from './look';

/**
 * Procedural 2D clothing textures for the R6 torso, sleeves and legs.
 * Patterned textures always go on plain <boxGeometry> overlays (never on drei's
 * RoundedBox, whose bevel vertices stretch UVs).
 */

const SIZE = 256;

function canvas2d(w = SIZE, h = SIZE) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext('2d')! };
}

function toTexture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function shade(hex: string, factor: number): string {
  const col = new THREE.Color(hex);
  if (factor < 1) col.multiplyScalar(factor);
  else col.lerp(new THREE.Color('#FFFFFF'), factor - 1);
  return `#${col.getHexString()}`;
}

const OUTLINE = '#09090B';

function drawPlaid(ctx: CanvasRenderingContext2D, secondary: string) {
  const step = 32;
  ctx.fillStyle = secondary;
  for (let i = 0; i < SIZE; i += step) {
    ctx.globalAlpha = 0.42;
    ctx.fillRect(i, 0, 10, SIZE);
    ctx.fillRect(0, i, SIZE, 10);
    ctx.globalAlpha = 0.75;
    ctx.fillRect(i + 14, 0, 3, SIZE);
    ctx.fillRect(0, i + 14, SIZE, 3);
  }
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#0F172A';
  for (let i = 0; i < SIZE; i += step) {
    ctx.fillRect(i + 20, 0, 4, SIZE);
    ctx.fillRect(0, i + 20, SIZE, 4);
  }
  ctx.globalAlpha = 1;
}

function drawKnit(ctx: CanvasRenderingContext2D, base: string) {
  ctx.strokeStyle = shade(base, 0.86);
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  for (let x = 6; x < SIZE; x += 12) {
    for (let y = 0; y < SIZE; y += 12) {
      ctx.beginPath();
      ctx.moveTo(x - 4, y);
      ctx.lineTo(x, y + 8);
      ctx.lineTo(x + 4, y);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

function drawHem(ctx: CanvasRenderingContext2D, base: string, h = 0.1) {
  ctx.fillStyle = shade(base, 0.82);
  ctx.fillRect(0, SIZE * (1 - h), SIZE, SIZE * h);
}

function drawButtons(ctx: CanvasRenderingContext2D, x: number, ys: number[], color: string, r = 6) {
  ctx.fillStyle = color;
  for (const y of ys) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTie(ctx: CanvasRenderingContext2D, color: string, top: number) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.45, top);
  ctx.lineTo(SIZE * 0.55, top);
  ctx.lineTo(SIZE * 0.53, top + 20);
  ctx.lineTo(SIZE * 0.57, top + 120);
  ctx.lineTo(SIZE * 0.5, top + 140);
  ctx.lineTo(SIZE * 0.43, top + 120);
  ctx.lineTo(SIZE * 0.47, top + 20);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = shade(color, 0.6);
  ctx.lineWidth = 2;
  ctx.stroke();
}

/** Blazer / suit front: open V showing a white shirt and a tie. */
function drawBlazer(ctx: CanvasRenderingContext2D, primary: string, tie: string, crest: boolean) {
  // shirt V
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.28, 0);
  ctx.lineTo(SIZE * 0.72, 0);
  ctx.lineTo(SIZE * 0.5, SIZE * 0.62);
  ctx.closePath();
  ctx.fill();
  drawTie(ctx, tie, 6);
  // lapels
  ctx.fillStyle = shade(primary, 0.78);
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(SIZE * (0.5 + s * 0.22), 0);
    ctx.lineTo(SIZE * (0.5 + s * 0.32), 0);
    ctx.lineTo(SIZE * (0.5 + s * 0.2), SIZE * 0.3);
    ctx.lineTo(SIZE * 0.5, SIZE * 0.62);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = shade(primary, 0.55);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.5, SIZE * 0.62);
  ctx.lineTo(SIZE * 0.5, SIZE);
  ctx.stroke();
  drawButtons(ctx, SIZE * 0.55, [SIZE * 0.72, SIZE * 0.86], shade(primary, 0.45), 6);
  // pockets
  ctx.fillStyle = shade(primary, 0.7);
  ctx.fillRect(SIZE * 0.08, SIZE * 0.74, SIZE * 0.24, 6);
  ctx.fillRect(SIZE * 0.68, SIZE * 0.74, SIZE * 0.24, 6);
  if (crest) {
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.moveTo(SIZE * 0.7, SIZE * 0.36);
    ctx.lineTo(SIZE * 0.86, SIZE * 0.36);
    ctx.lineTo(SIZE * 0.86, SIZE * 0.46);
    ctx.lineTo(SIZE * 0.78, SIZE * 0.54);
    ctx.lineTo(SIZE * 0.7, SIZE * 0.46);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#A16207';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

export type TorsoFace = 'front' | 'back' | 'side';

export function createTopTexture(
  style: TopStyle,
  primary: string,
  secondary: string,
  skin: string,
  face: TorsoFace
): THREE.CanvasTexture {
  const { c, ctx } = canvas2d();
  ctx.fillStyle = primary;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const front = face === 'front';
  const back = face === 'back';

  switch (style) {
    case 'plaid':
      drawPlaid(ctx, secondary);
      if (front) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.fillRect(SIZE * 0.47, 0, SIZE * 0.06, SIZE);
        drawButtons(ctx, SIZE * 0.5, [40, 100, 160, 220], '#F8FAFC', 5);
      }
      break;

    case 'hoodie':
      if (front) {
        ctx.fillStyle = secondary;
        ctx.fillRect(SIZE * 0.33, 0, SIZE * 0.34, SIZE);
        ctx.strokeStyle = OUTLINE;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(SIZE * 0.33, 0);
        ctx.lineTo(SIZE * 0.33, SIZE);
        ctx.moveTo(SIZE * 0.67, 0);
        ctx.lineTo(SIZE * 0.67, SIZE);
        ctx.stroke();
        ctx.strokeRect(SIZE * 0.08, SIZE * 0.58, SIZE * 0.2, SIZE * 0.28);
        ctx.strokeRect(SIZE * 0.72, SIZE * 0.58, SIZE * 0.2, SIZE * 0.28);
      } else if (back) {
        // hood hanging on the back
        ctx.fillStyle = shade(primary, 0.8);
        ctx.beginPath();
        ctx.ellipse(SIZE * 0.5, 0, SIZE * 0.3, SIZE * 0.28, 0, 0, Math.PI);
        ctx.fill();
      }
      drawHem(ctx, primary, 0.08);
      break;

    case 'pullover':
      if (front) {
        // hood collar
        ctx.fillStyle = shade(primary, 0.78);
        ctx.beginPath();
        ctx.moveTo(SIZE * 0.3, 0);
        ctx.lineTo(SIZE * 0.5, SIZE * 0.18);
        ctx.lineTo(SIZE * 0.7, 0);
        ctx.closePath();
        ctx.fill();
        // drawstrings
        ctx.strokeStyle = secondary;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(SIZE * 0.43, SIZE * 0.1);
        ctx.lineTo(SIZE * 0.42, SIZE * 0.36);
        ctx.moveTo(SIZE * 0.57, SIZE * 0.1);
        ctx.lineTo(SIZE * 0.58, SIZE * 0.36);
        ctx.stroke();
        // kangaroo pocket
        ctx.strokeStyle = shade(primary, 0.55);
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(SIZE * 0.22, SIZE * 0.88);
        ctx.lineTo(SIZE * 0.3, SIZE * 0.6);
        ctx.lineTo(SIZE * 0.7, SIZE * 0.6);
        ctx.lineTo(SIZE * 0.78, SIZE * 0.88);
        ctx.stroke();
      } else if (back) {
        ctx.fillStyle = shade(primary, 0.8);
        ctx.beginPath();
        ctx.ellipse(SIZE * 0.5, 0, SIZE * 0.32, SIZE * 0.3, 0, 0, Math.PI);
        ctx.fill();
      }
      drawHem(ctx, primary, 0.1);
      break;

    case 'tshirt':
      if (front || back) {
        ctx.strokeStyle = shade(primary, 0.7);
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(SIZE * 0.5, 0, SIZE * (front ? 0.17 : 0.14), 0, Math.PI);
        ctx.stroke();
      }
      if (front && secondary !== primary) {
        // simple chest logo circle
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.arc(SIZE * 0.5, SIZE * 0.48, SIZE * 0.14, 0, Math.PI * 2);
        ctx.fill();
      }
      drawHem(ctx, primary, 0.05);
      break;

    case 'tank':
      if (front || back) {
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.ellipse(SIZE * 0.5, 0, SIZE * 0.24, SIZE * (front ? 0.28 : 0.18), 0, 0, Math.PI);
        ctx.fill();
        ctx.fillRect(0, 0, SIZE * 0.14, SIZE * 0.24);
        ctx.fillRect(SIZE * 0.86, 0, SIZE * 0.14, SIZE * 0.24);
      } else {
        ctx.fillStyle = skin;
        ctx.fillRect(0, 0, SIZE, SIZE * 0.24);
      }
      drawHem(ctx, primary, 0.05);
      break;

    case 'polo':
      if (front) {
        ctx.fillStyle = secondary;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(SIZE * 0.5, 0);
          ctx.lineTo(SIZE * (0.5 + s * 0.22), 0);
          ctx.lineTo(SIZE * (0.5 + s * 0.18), SIZE * 0.16);
          ctx.lineTo(SIZE * (0.5 + s * 0.02), SIZE * 0.1);
          ctx.closePath();
          ctx.fill();
        }
        ctx.fillStyle = shade(primary, 0.82);
        ctx.fillRect(SIZE * 0.46, SIZE * 0.08, SIZE * 0.08, SIZE * 0.3);
        drawButtons(ctx, SIZE * 0.5, [SIZE * 0.17, SIZE * 0.3], '#F8FAFC', 5);
      } else if (back) {
        ctx.fillStyle = secondary;
        ctx.fillRect(SIZE * 0.28, 0, SIZE * 0.44, SIZE * 0.06);
      }
      drawHem(ctx, primary, 0.05);
      break;

    case 'blouse':
      if (front) {
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.arc(SIZE * 0.5, 0, SIZE * 0.22, 0, Math.PI);
        ctx.fill();
        drawButtons(ctx, SIZE * 0.5, [SIZE * 0.34, SIZE * 0.5, SIZE * 0.66], shade(secondary, 0.85), 5);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.14)';
      ctx.fillRect(0, SIZE * 0.86, SIZE, SIZE * 0.14);
      break;

    case 'sweater':
      drawKnit(ctx, primary);
      ctx.fillStyle = secondary;
      ctx.fillRect(0, SIZE * 0.34, SIZE, SIZE * 0.1);
      ctx.fillRect(0, SIZE * 0.5, SIZE, SIZE * 0.04);
      if (front || back) {
        ctx.strokeStyle = shade(primary, 0.72);
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(SIZE * 0.5, 0, SIZE * 0.16, 0, Math.PI);
        ctx.stroke();
      }
      drawHem(ctx, primary, 0.12);
      break;

    case 'vest':
      // base = shirt (secondary); vest (primary) drawn over it
      ctx.fillStyle = secondary;
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = primary;
      if (front) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(SIZE * 0.3, 0);
        ctx.lineTo(SIZE * 0.5, SIZE * 0.45);
        ctx.lineTo(SIZE * 0.7, 0);
        ctx.lineTo(SIZE, 0);
        ctx.lineTo(SIZE, SIZE);
        ctx.lineTo(0, SIZE);
        ctx.closePath();
        ctx.fill();
        drawKnit(ctx, primary);
        // re-draw the shirt V so knit marks don't cover it
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.moveTo(SIZE * 0.3, 0);
        ctx.lineTo(SIZE * 0.5, SIZE * 0.45);
        ctx.lineTo(SIZE * 0.7, 0);
        ctx.closePath();
        ctx.fill();
        // shirt collar tips
        ctx.fillStyle = shade(secondary, 0.9);
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(SIZE * 0.5, SIZE * 0.02);
          ctx.lineTo(SIZE * (0.5 + s * 0.2), 0);
          ctx.lineTo(SIZE * (0.5 + s * 0.12), SIZE * 0.14);
          ctx.closePath();
          ctx.fill();
        }
        ctx.strokeStyle = shade(primary, 0.7);
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(SIZE * 0.3, 0);
        ctx.lineTo(SIZE * 0.5, SIZE * 0.45);
        ctx.lineTo(SIZE * 0.7, 0);
        ctx.stroke();
      } else if (back) {
        ctx.fillRect(0, SIZE * 0.06, SIZE, SIZE);
        drawKnit(ctx, primary);
      } else {
        // side: shirt under the armhole, vest below
        ctx.fillRect(0, SIZE * 0.3, SIZE, SIZE);
      }
      drawHem(ctx, primary, 0.1);
      break;

    case 'jacket':
      if (front) {
        ctx.fillStyle = secondary;
        ctx.fillRect(SIZE * 0.44, 0, SIZE * 0.12, SIZE);
        ctx.strokeStyle = '#D4D4D8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(SIZE * 0.5, 0);
        ctx.lineTo(SIZE * 0.5, SIZE);
        ctx.stroke();
        // collar
        ctx.fillStyle = shade(primary, 0.75);
        ctx.fillRect(SIZE * 0.26, 0, SIZE * 0.48, SIZE * 0.07);
        // chest stripes
        ctx.fillStyle = secondary;
        ctx.fillRect(SIZE * 0.08, SIZE * 0.24, SIZE * 0.26, 10);
        ctx.fillRect(SIZE * 0.66, SIZE * 0.24, SIZE * 0.26, 10);
        ctx.strokeStyle = OUTLINE;
        ctx.lineWidth = 4;
        ctx.strokeRect(SIZE * 0.1, SIZE * 0.62, SIZE * 0.22, 4);
        ctx.strokeRect(SIZE * 0.68, SIZE * 0.62, SIZE * 0.22, 4);
      } else if (back) {
        ctx.fillStyle = secondary;
        ctx.fillRect(0, SIZE * 0.2, SIZE, 12);
      } else {
        ctx.fillStyle = secondary;
        ctx.fillRect(SIZE * 0.4, 0, SIZE * 0.2, SIZE);
      }
      ctx.fillStyle = secondary;
      ctx.fillRect(0, SIZE * 0.9, SIZE, SIZE * 0.1);
      break;

    case 'uniform':
    case 'suit':
      if (front) drawBlazer(ctx, primary, secondary, style === 'uniform');
      else if (back) {
        ctx.strokeStyle = shade(primary, 0.7);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(SIZE * 0.5, SIZE * 0.55);
        ctx.lineTo(SIZE * 0.5, SIZE);
        ctx.stroke();
        ctx.fillStyle = shade(primary, 0.78);
        ctx.fillRect(SIZE * 0.3, 0, SIZE * 0.4, SIZE * 0.06);
      }
      break;

    case 'dress':
      if (front) {
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.arc(SIZE * 0.5, 0, SIZE * 0.2, 0, Math.PI);
        ctx.fill();
      }
      // waist sash
      ctx.fillStyle = secondary;
      ctx.fillRect(0, SIZE * 0.78, SIZE, SIZE * 0.1);
      if (front) {
        ctx.beginPath();
        ctx.ellipse(SIZE * 0.42, SIZE * 0.83, 18, 12, -0.4, 0, Math.PI * 2);
        ctx.ellipse(SIZE * 0.58, SIZE * 0.83, 18, 12, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
  }

  return toTexture(c);
}

/** Sleeve color per top style (vest sleeves are the shirt underneath). */
export function sleeveColorFor(style: TopStyle, primary: string, secondary: string): string {
  return style === 'vest' ? secondary : primary;
}

export function createSleeveTexture(style: TopStyle, primary: string, secondary: string): THREE.CanvasTexture {
  const { c, ctx } = canvas2d();
  const base = sleeveColorFor(style, primary, secondary);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, SIZE, SIZE);

  switch (style) {
    case 'plaid':
      drawPlaid(ctx, secondary);
      break;
    case 'hoodie':
      ctx.fillStyle = OUTLINE;
      ctx.fillRect(0, SIZE * 0.8, SIZE, 8);
      ctx.fillRect(0, SIZE * 0.92, SIZE, 8);
      break;
    case 'jacket':
      ctx.fillStyle = secondary;
      ctx.fillRect(SIZE * 0.38, 0, SIZE * 0.08, SIZE);
      ctx.fillRect(SIZE * 0.54, 0, SIZE * 0.08, SIZE);
      ctx.fillRect(0, SIZE * 0.88, SIZE, SIZE * 0.12);
      break;
    case 'sweater':
      drawKnit(ctx, base);
      ctx.fillStyle = secondary;
      ctx.fillRect(0, SIZE * 0.4, SIZE, SIZE * 0.1);
      drawHem(ctx, base, 0.14);
      break;
    case 'uniform':
    case 'suit':
      // white shirt cuff peeking out
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, SIZE * 0.9, SIZE, SIZE * 0.1);
      drawButtons(ctx, SIZE * 0.5, [SIZE * 0.82], shade(base, 0.45), 6);
      break;
    case 'pullover':
      drawHem(ctx, base, 0.14);
      break;
    default:
      drawHem(ctx, base, 0.08);
  }
  return toTexture(c);
}

/** Denim texture for jeans (applied to leg overlay boxes). */
export function createJeansTexture(color: string): THREE.CanvasTexture {
  const { c, ctx } = canvas2d();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, SIZE, SIZE);
  let seed = 4242;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  // diagonal twill
  ctx.strokeStyle = shade(color, 1.12);
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1.5;
  for (let i = -SIZE; i < SIZE * 2; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - SIZE * 0.4, SIZE);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 400; i++) ctx.fillRect(rand() * SIZE, rand() * SIZE, 2, 1);
  ctx.globalAlpha = 1;
  // stitched side seam + rolled cuff
  ctx.strokeStyle = '#D9A441';
  ctx.setLineDash([6, 5]);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.88, 0);
  ctx.lineTo(SIZE * 0.88, SIZE);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = shade(color, 1.18);
  ctx.fillRect(0, SIZE * 0.9, SIZE, SIZE * 0.1);
  return toTexture(c);
}

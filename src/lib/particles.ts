export const PARTICLE_COUNTS = { desktop: 6500, tablet: 4200, mobile: 3600 };
export type Screen = keyof typeof PARTICLE_COUNTS;

const SAMPLE_WIDTH = 320;
const POINTER_RADIUS = 96;
const TAU = Math.PI * 2;

type Points = {
  x: Float32Array;
  y: Float32Array;
  shade: Float32Array;
  face: Float32Array;
};

type Candidate = { x: number; y: number; shade: number; face: number; rank: number; mobileRank: number };

function randomSource(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return (seed + 1) / 4294967297;
  };
}

function smooth(start: number, end: number, value: number) {
  const fraction = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return fraction * fraction * (3 - 2 * fraction);
}

function eyeRegion(column: number, row: number, centerX: number, centerY: number, radiusX: number) {
  const distance = ((column - centerX) / radiusX) ** 2 + ((row - centerY) / 18) ** 2;
  return Math.max(0, 1 - distance) ** 2;
}

function pack(candidates: Candidate[], count: number): Points {
  const selected = candidates.slice(0, count);
  return {
    x: Float32Array.from(selected, point => point.x),
    y: Float32Array.from(selected, point => point.y),
    shade: Float32Array.from(selected, point => point.shade),
    face: Float32Array.from(selected, point => point.face),
  };
}

const processed = new Map<string, Promise<{ desktop: Points; mobile: Points }>>();

export function samplePortrait(src: string) {
  const cached = processed.get(src);
  if (cached) return cached;
  const pending = readPortrait(src).catch(error => {
    processed.delete(src);
    throw error;
  });
  processed.set(src, pending);
  return pending;
}

async function readPortrait(src: string) {
  const image = new Image();
  image.src = src;
  await image.decode();

  const buffer = document.createElement("canvas");
  const width = buffer.width = SAMPLE_WIDTH;
  const height = buffer.height = Math.round(width * image.naturalHeight / image.naturalWidth);
  const context = buffer.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas sampling is unavailable");
  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);
  const luma = new Float32Array(width * height);
  for (let index = 0; index < luma.length; index++) {
    const offset = index * 4;
    luma[index] = (0.2126 * data[offset] + 0.7152 * data[offset + 1] + 0.0722 * data[offset + 2]) / 255;
  }

  const random = randomSource(713);
  const shadowRandom = randomSource(714);
  const candidates: Candidate[] = [];
  const neighborhood = 4;
  const vertical = neighborhood * width;
  for (let row = neighborhood; row < height - neighborhood; row++) {
    for (let column = neighborhood; column < width - neighborhood; column++) {
      const index = row * width + column;
      const offset = index * 4;
      const light = luma[index];
      if (data[offset + 3] < 80) continue;
      const matte = light < 0.035 || Math.max(data[offset], data[offset + 1], data[offset + 2]) < 15;
      // Measured in the 320 × 292 offscreen sample, in viewer coordinates. The wider left
      // region also covers the shaded outer corner and the transition into the nose bridge.
      const leftEye = eyeRegion(column, row, 133, 89, 19);
      const rightEye = eyeRegion(column, row, 169, 86, 18);
      const eye = Math.max(leftEye, rightEye);
      if (matte && (eye < 0.25 || light < 0.015)) continue;
      const x = column / width;
      const y = row / height;
      // Ellipses measured on Sakshi's crop: face, then hair and upper shoulders.
      const face = Math.exp(-(((x - 0.505) / 0.126) ** 2 + ((y - 0.335) / 0.202) ** 2));
      const head = Math.exp(-(((x - 0.52) / 0.235) ** 2 + ((y - 0.27) / 0.33) ** 2));
      const edge = Math.min(1, 2.5 * (Math.abs(luma[index + 1] - luma[index - 1]) + Math.abs(luma[index + width] - luma[index - width])));
      const surrounding = (luma[index - neighborhood] + luma[index + neighborhood] + luma[index - vertical] + luma[index + vertical]
        + luma[index - vertical - neighborhood] + luma[index - vertical + neighborhood]
        + luma[index + vertical - neighborhood] + luma[index + vertical + neighborhood]) / 8;
      const contrast = light - surrounding;
      const detail = Math.max(edge, 2.6 * Math.abs(contrast));
      // Allow very dark ocular boundaries only when the surrounding pixels are part of the face.
      if (matte && (surrounding < 0.16 || detail < 0.32)) continue;
      const eyeWeight = (5.1 * leftEye + 2.5 * rightEye) * (0.48 + 1.12 * detail);
      const weight = 0.25 + 3.9 * face + 0.83 * head + edge + 3.2 * face * Math.abs(contrast) + eyeWeight;
      const rank = -Math.log(matte ? shadowRandom() : random()) / weight;
      // Preserve dark features inside the brighter skin instead of brightening both sides of every edge.
      const faceTone = 0.05 + 0.87 * smooth(0.19, 0.78, light + 1.18 * contrast);
      const silhouetteTone = 0.05 + 0.83 * light ** 0.86 + edge * 0.15;
      const tonalBlend = smooth(0.08, 0.72, face);
      const baseShade = (silhouetteTone + (faceTone - silhouetteTone) * tonalBlend) * (1 + 0.15 * face);
      const eyeBoundary = eye * smooth(0.12, 0.72, detail);
      const shade = Math.min(1, Math.max(baseShade, 0.05 + 0.24 * eyeBoundary) * (1 + 0.12 * eyeBoundary));
      const mobileWeight = 0.17 + 1.15 * face + 0.63 * head + 0.23 * leftEye + 0.05 * rightEye;
      candidates.push({ x, y, shade, face, rank, mobileRank: rank / mobileWeight });
    }
  }
  if (candidates.length < PARTICLE_COUNTS.desktop) throw new Error("Portrait has too little visible detail");
  return {
    desktop: pack(candidates.sort((a, b) => a.rank - b.rank), PARTICLE_COUNTS.desktop),
    mobile: pack(candidates.sort((a, b) => a.mobileRank - b.mobileRank), PARTICLE_COUNTS.mobile),
  };
}

type PortraitSize = {
  width: number;
  height: number;
  dpr: number;
  left: number;
  top: number;
  portraitWidth: number;
  portraitHeight: number;
  screen: Screen;
};

export function createPortraitRenderer(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  samples: Awaited<ReturnType<typeof samplePortrait>>,
) {
  const array = () => new Float32Array(PARTICLE_COUNTS.desktop);
  const homeX = array(), homeY = array(), x = array(), y = array();
  const vx = array(), vy = array(), scatterX = array(), scatterY = array();
  const originX = array(), originY = array(), phase = array(), size = array(), delay = array(), shade = array();
  const random = randomSource(1027);
  for (let index = 0; index < x.length; index++) {
    const angle = random() * TAU;
    const speed = 0.23 + random() * 0.58;
    scatterX[index] = Math.cos(angle) * speed;
    scatterY[index] = Math.sin(angle) * speed;
    originX[index] = random();
    originY[index] = random();
    phase[index] = random() * TAU;
  }

  let points = samples.desktop;
  let count = 0, width = 0, height = 0;
  let screen: Screen = "desktop";
  let mode: "waiting" | "forming" | "settled" = "waiting";
  let clock = 0, formation = 0, scatter = 0, displayedScatter = 0;
  let pointerX = -1000, pointerY = -1000;

  function resetPositions() {
    for (let index = 0; index < count; index++) {
      x[index] = mode === "forming" ? originX[index] * width : homeX[index];
      y[index] = mode === "forming" ? originY[index] * height : homeY[index];
      vx[index] = vy[index] = 0;
    }
  }

  function resize(bounds: PortraitSize) {
    ({ width, height, screen } = bounds);
    points = screen === "mobile" ? samples.mobile : samples.desktop;
    count = PARTICLE_COUNTS[screen];
    canvas.dataset.particles = String(count);
    canvas.width = Math.max(1, Math.round(width * bounds.dpr));
    canvas.height = Math.max(1, Math.round(height * bounds.dpr));
    context.setTransform(bounds.dpr, 0, 0, bounds.dpr, 0, 0);
    for (let index = 0; index < count; index++) {
      const pointY = points.y[index];
      homeX[index] = bounds.left + points.x[index] * bounds.portraitWidth;
      homeY[index] = bounds.top + pointY * bounds.portraitHeight;
      const radius = screen === "desktop" ? 1.12 : screen === "tablet" ? 0.98 : 0.86;
      size[index] = radius * (0.55 + originY[index] * 0.37 + points.face[index] * 0.14);
      delay[index] = originX[index] * 0.24 + (1 - points.face[index]) * 0.36;
      const fade = screen === "mobile" ? smooth(0.55, 0.90, pointY) : smooth(0.64, 1, pointY);
      shade[index] = points.shade[index] * (1 - fade * 0.96);
    }
    resetPositions();
  }

  function draw(delta: number, still = false) {
    context.clearRect(0, 0, width, height);
    if (mode === "waiting" || !count) return;

    const dt = Math.min(delta, 0.05);
    const substeps = Math.max(1, Math.ceil(dt * 60));
    const step = dt * 60 / substeps;
    const damping = 0.865 ** step;
    clock += dt;
    formation += dt;
    if (mode === "forming" && formation > (screen === "mobile" ? 1.75 : 2.15)) mode = "settled";
    const forming = mode === "forming";
    const distance = still ? 0 : smooth(0, 1, displayedScatter);
    const opacity = 1 - smooth(0.15, 1, displayedScatter);
    const wavePosition = (clock % 5.2 - 3.7) * 1.23;

    context.fillStyle = "#dfe7f2";
    for (let index = 0; index < count; index++) {
      const age = formation - delay[index] * (screen === "mobile" ? 0.72 : 1);
      if (forming && age <= 0) continue;
      let px = homeX[index] + scatterX[index] * Math.min(width, 850) * distance;
      let py = homeY[index] + scatterY[index] * height * distance;
      let brightness = 0;

      if (!still) {
        const drift = clock * (forming ? 3 : 1.15) + phase[index];
        const curl = forming ? 7 * Math.max(0, 1 - age * 0.8) : 0.48;
        px += Math.sin(drift) * curl;
        py += Math.cos(drift * 0.91) * curl;
        const dx = x[index] - pointerX, dy = y[index] - pointerY;
        const squared = dx * dx + dy * dy;
        if (!forming && distance < 0.1 && squared > 0.01 && squared < POINTER_RADIUS ** 2) {
          const separation = Math.sqrt(squared);
          const strength = (1 - separation / POINTER_RADIUS) ** 2 * 20 / separation;
          px += dx * strength;
          py += dy * strength;
        }
        if (!forming && distance > 0.012) {
          x[index] = px;
          y[index] = py;
          vx[index] = vy[index] = 0;
        } else {
          for (let substep = 0; substep < substeps; substep++) {
            vx[index] = (vx[index] + (px - x[index]) * 0.048 * step) * damping;
            vy[index] = (vy[index] + (py - y[index]) * 0.048 * step) * damping;
            x[index] += vx[index] * step;
            y[index] += vy[index] * step;
          }
        }
        px = x[index];
        py = y[index];
        const diagonal = points.x[index] * 0.62 + points.y[index] * 0.58;
        const shimmer = Math.max(0, 1 - Math.abs(diagonal - wavePosition) * 11);
        brightness = shade[index] * (Math.sin(drift) * 0.036 + shimmer * 0.14);
      }

      if (px < -2 || px > width + 2 || py < -2 || py > height + 2) continue;
      const entrance = forming ? smooth(0, 0.44, age) : 1;
      context.globalAlpha = Math.min(1, (shade[index] + brightness) * entrance * (still ? 1 : opacity));
      const radius = size[index];
      if (index % 197 === 0) context.fillStyle = index % 2 ? "#ff6a3d" : "#e5322d";
      context.fillRect(px - radius, py - radius, radius * 2, radius * 2);
      if (index % 197 === 0) context.fillStyle = "#dfe7f2";
    }
    context.globalAlpha = 1;
    displayedScatter += (scatter - displayedScatter) * Math.min(1, dt * 9);
  }

  return {
    resize,
    draw,
    form() { mode = "forming"; formation = 0; resetPositions(); },
    settle() { mode = "settled"; resetPositions(); },
    setScatter(progress: number) { scatter = displayedScatter = progress; },
    reform() { scatter = 0; },
    setPointer(px: number, py: number) { pointerX = px; pointerY = py; },
  };
}

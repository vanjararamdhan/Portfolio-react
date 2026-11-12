// The WebGL event stream. Loaded lazily (it pulls in three.js) by <StreamField />.
// One instanced point cloud; every particle carries a random seed and the vertex shader computes its
// position for three formations, blending between them as the page scrolls:
//   0 · six partitions (lanes of records flowing left → right) behind the hero
//   1 · ambient drift, dimmed behind dense content
//   2 · convergence into a single stream at the contact section
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector4,
  WebGLRenderer,
} from "three";
import { stream } from "../_lib/motion";

const MAX_BURSTS = 4;

const vertexShader = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uTime;
  uniform float uFormation;
  uniform vec2 uHalf;          // half extents of the visible z=0 plane
  uniform vec2 uMouse;         // world space
  uniform float uMouseActive;
  uniform vec4 uBursts[${MAX_BURSTS}]; // xy world, z start time, w active
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vHot;

  vec3 partitions(vec4 s) {
    float lane = floor(s.x * 6.0);
    float w = uHalf.x * 1.25;
    float speed = 0.35 + s.z * 0.9;
    float x = mod(s.y * 2.0 * w + uTime * speed, 2.0 * w) - w;
    float laneY = mix(-0.62, 0.62, lane / 5.0) * uHalf.y;
    float wave = sin(x * 0.45 + uTime * 0.6 + lane * 1.3) * 0.22;
    return vec3(x, laneY + wave + (s.w - 0.5) * 0.16, (s.z - 0.5) * 1.6);
  }

  vec3 drift(vec4 s) {
    float w = uHalf.x * 1.3;
    float x = mod(s.y * 2.0 * w + uTime * (0.05 + s.z * 0.12), 2.0 * w) - w;
    float y = (s.x * 2.0 - 1.0) * uHalf.y * 1.15 + sin(uTime * 0.2 + s.w * 6.28) * 0.15;
    return vec3(x, y, (s.z - 0.5) * 7.0);
  }

  vec3 converge(vec4 s) {
    float w = uHalf.x * 1.25;
    float x = mod(s.y * 2.0 * w + uTime * (0.6 + s.z * 1.1), 2.0 * w) - w;
    float spread = 0.08 + pow(abs(x) / w, 2.0) * 1.4;
    float y = -0.18 * uHalf.y + sin(x * 0.35 + uTime * 0.5) * 0.25 + (s.w - 0.5) * spread;
    return vec3(x, y, (s.z - 0.5) * spread * 2.0);
  }

  void main() {
    // Each particle starts its morph slightly later than the last, so formations flow into each other.
    float f1 = smoothstep(0.0, 1.0, clamp((uFormation - aSeed.x * 0.35) / 0.65, 0.0, 1.0));
    float f2 = smoothstep(0.0, 1.0, clamp((uFormation - 1.0 - aSeed.x * 0.35) / 0.65, 0.0, 1.0));
    vec3 p = mix(mix(partitions(aSeed), drift(aSeed), f1), converge(aSeed), f2);

    // The cursor bends the stream around itself.
    vec2 d = p.xy - uMouse;
    float dist = length(d) + 1e-4;
    p.xy += (d / dist) * uMouseActive * smoothstep(1.7, 0.0, dist) * 0.7;

    // Click pulses: an expanding ring that shoves particles outward.
    for (int i = 0; i < ${MAX_BURSTS}; i++) {
      vec4 b = uBursts[i];
      if (b.w < 0.5) continue;
      float age = uTime - b.z;
      vec2 db = p.xy - b.xy;
      float r = length(db) + 1e-4;
      float ring = smoothstep(0.9, 0.0, abs(r - age * 5.5)) * exp(-age * 1.8);
      p.xy += (db / r) * ring * 0.9;
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float hot = step(0.93, aSeed.w);
    vHot = hot;
    vAlpha = mix(0.35, 0.95, hot) * (0.55 + aSeed.z * 0.45);
    gl_PointSize = uSize * mix(1.0, 2.4, hot) * uPixelRatio * (10.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uCold;
  uniform vec3 uHotColor;
  uniform float uIntensity;
  varying float vAlpha;
  varying float vHot;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(mix(uCold, uHotColor, vHot), a * a * vAlpha * uIntensity);
  }
`;

export type StreamScene = { dispose: () => void };

export function createStreamScene(canvas: HTMLCanvasElement, opts: { count: number; onFirstFrame: () => void }): StreamScene {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "low-power" });
  const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 10;

  const seeds = new Float32Array(opts.count * 4);
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
  const geometry = new BufferGeometry();
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 4));
  // Positions are computed in the shader; three still needs a position attribute to size the draw.
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(opts.count * 3), 3));

  const bursts = Array.from({ length: MAX_BURSTS }, () => new Vector4(0, 0, 0, 0));
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uFormation: { value: stream.formation },
      uIntensity: { value: 0 },
      uHalf: { value: new Vector2(1, 1) },
      uMouse: { value: new Vector2(99, 99) },
      uMouseActive: { value: 0 },
      uBursts: { value: bursts },
      uSize: { value: 2.4 },
      uPixelRatio: { value: pixelRatio },
      uCold: { value: new Color("#cdbfa6") },
      uHotColor: { value: new Color("#f2a43a") },
    },
  });
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  const half = material.uniforms.uHalf.value as Vector2;
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    half.y = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    half.x = half.y * camera.aspect;
  };
  resize();
  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  };
  window.addEventListener("resize", onResize);

  const start = performance.now();
  const mouse = material.uniforms.uMouse.value as Vector2;
  let raf = 0;
  let first = true;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const u = material.uniforms;
    const t = (performance.now() - start) / 1000;
    u.uTime.value = t;
    // Ease toward the scroll-driven targets so formations glide instead of snapping.
    u.uFormation.value += (stream.formation - u.uFormation.value) * 0.06;
    u.uIntensity.value += (stream.intensity - u.uIntensity.value) * 0.05;
    const tx = stream.pointer.x * half.x;
    const ty = stream.pointer.y * half.y;
    mouse.x += (tx - mouse.x) * 0.12;
    mouse.y += (ty - mouse.y) * 0.12;
    u.uMouseActive.value += ((stream.pointer.active ? 1 : 0) - u.uMouseActive.value) * 0.08;
    stream.bursts.forEach((b, i) => bursts[i].set(b.x * half.x, b.y * half.y, (b.t - start) / 1000, 1));
    for (let i = stream.bursts.length; i < MAX_BURSTS; i++) bursts[i].w = 0;

    renderer.render(scene, camera);
    if (first) {
      first = false;
      opts.onFirstFrame();
    }
  };

  const onVisibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(frame);
  };
  document.addEventListener("visibilitychange", onVisibility);
  raf = requestAnimationFrame(frame);

  return {
    dispose: () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}

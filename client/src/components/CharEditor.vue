<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { IImageChar } from 'src/interfaces/imageFile';

const props = defineProps<{
  modelValue: boolean;
  char: IImageChar | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'change': [];
}>();

const editorCanvas = ref<HTMLCanvasElement | null>(null);
const PAD = 80;
let editorImg: HTMLImageElement | null = null;
let dragging: null | 'xoffset' | 'xadvance' | 'yoffset' = null;

const GUIDES = [
  { key: 'xoffset',  axis: 'v', color: '#2196f3', label: (c: IImageChar) => `xoffset: ${c.xoffset}` },
  { key: 'xadvance', axis: 'v', color: '#ff9800', label: (c: IImageChar) => `xadvance: ${c.xadvance}` },
  { key: 'yoffset',  axis: 'h', color: '#4caf50', label: (c: IImageChar) => `yoffset: ${c.yoffset}` },
] as const;

function guidePos(key: string, char: IImageChar) {
  switch (key) {
    case 'xoffset':  return PAD - char.xoffset;
    case 'xadvance': return PAD + char.xadvance;
    case 'yoffset':  return PAD - char.yoffset;  // inverted: guide up = positive yoffset
    default:         return 0;
  }
}

function applyDrag(key: string, px: number, char: IImageChar) {
  switch (key) {
    case 'xoffset':  char.xoffset  = Math.round(PAD - px); break;
    case 'xadvance': char.xadvance = Math.max(1, Math.round(px - PAD)); break;
    case 'yoffset':  char.yoffset  = Math.round(PAD - px); break;  // inverted
  }
}

function drawEditor() {
  const canvas = editorCanvas.value;
  const char = props.char;
  if (!canvas || !char || !editorImg) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const iw = editorImg.naturalWidth;
  const ih = editorImg.naturalHeight;

  canvas.width  = Math.max(PAD + Math.max(iw, char.xadvance) + PAD, 320);
  canvas.height = Math.max(PAD + ih + PAD, 200);

  // Transparent canvas — checkerboard comes from CSS on the wrapper
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(editorImg, PAD, PAD, iw, ih);

  for (const g of GUIDES) {
    const pos = guidePos(g.key, char);
    ctx.save();
    ctx.strokeStyle = g.color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    if (g.axis === 'v') { ctx.moveTo(pos, 0); ctx.lineTo(pos, canvas.height); }
    else                { ctx.moveTo(0, pos); ctx.lineTo(canvas.width, pos);  }
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.font = 'bold 11px monospace';
    const labelText = g.label(char);
    const tw = ctx.measureText(labelText).width;
    if (g.axis === 'v') {
      ctx.fillStyle = g.color;
      ctx.fillRect(pos + 3, 2, tw + 6, 16);
      ctx.fillStyle = '#fff';
      ctx.fillText(labelText, pos + 6, 14);
    } else {
      ctx.fillStyle = g.color;
      ctx.fillRect(2, pos - 16, tw + 6, 16);
      ctx.fillStyle = '#fff';
      ctx.fillText(labelText, 5, pos - 4);
    }
    ctx.restore();
  }

  ctx.save();
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.arc(PAD, PAD, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function canvasCoords(e: MouseEvent) {
  const canvas = editorCanvas.value!;
  const rect = canvas.getBoundingClientRect();
  return {
    mx: (e.clientX - rect.left) * (canvas.width / rect.width),
    my: (e.clientY - rect.top)  * (canvas.height / rect.height),
  };
}

function onCanvasPointerDown(e: MouseEvent) {
  if (!props.char) return;
  const { mx, my } = canvasCoords(e);
  const HIT = 8;
  for (const g of GUIDES) {
    const pos = guidePos(g.key, props.char);
    const dist = g.axis === 'v' ? Math.abs(mx - pos) : Math.abs(my - pos);
    if (dist < HIT) { dragging = g.key; break; }
  }
  if (dragging) {
    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup',   onWindowMouseUp);
  }
}

function onWindowMouseMove(e: MouseEvent) {
  if (!dragging || !props.char || !editorCanvas.value) return;
  const { mx, my } = canvasCoords(e);
  const g = GUIDES.find((g) => g.key === dragging)!;
  applyDrag(dragging, g.axis === 'v' ? mx : my, props.char);
  drawEditor();
  emit('change');
}

function onWindowMouseUp() {
  dragging = null;
  window.removeEventListener('mousemove', onWindowMouseMove);
  window.removeEventListener('mouseup',   onWindowMouseUp);
}

function onCanvasMouseMove(e: MouseEvent) {
  if (dragging) return;
  const canvas = editorCanvas.value;
  if (!canvas || !props.char) return;
  const { mx, my } = canvasCoords(e);
  const HIT = 8;
  let cursor = 'default';
  for (const g of GUIDES) {
    const pos = guidePos(g.key, props.char);
    const dist = g.axis === 'v' ? Math.abs(mx - pos) : Math.abs(my - pos);
    if (dist < HIT) { cursor = g.axis === 'v' ? 'ew-resize' : 'ns-resize'; break; }
  }
  canvas.style.cursor = cursor;
}

function onShow() {
  nextTick(() => {
    if (!props.char) return;
    editorImg = null;
    const img = new Image();
    img.onload = () => { editorImg = img; drawEditor(); };
    img.src = props.char.image.url;
  });
}

function onHide() {
  dragging = null;
  window.removeEventListener('mousemove', onWindowMouseMove);
  window.removeEventListener('mouseup',   onWindowMouseUp);
  emit('update:modelValue', false);
}
</script>

<template>
  <q-dialog :model-value="modelValue" @show="onShow" @hide="onHide">
    <q-card class="editor-card">

      <!-- Header -->
      <div class="editor-head">
        <div class="editor-head__char">{{ char?.char || '?' }}</div>
        <div class="editor-head__meta">
          <div class="editor-head__filename">{{ char?.image.name }}</div>
          <div class="editor-head__dims" v-if="char">{{ char.width }} × {{ char.height }} px</div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense color="white" v-close-popup />
      </div>

      <!-- Legend: live guide values as chips -->
      <div class="editor-legend" v-if="char">
        <div
          v-for="g in [
            { key: 'xoffset',  color: '#2196f3' },
            { key: 'xadvance', color: '#ff9800' },
            { key: 'yoffset',  color: '#4caf50' },
          ]"
          :key="g.key"
          class="editor-legend__chip"
        >
          <span class="editor-legend__swatch" :style="{ background: g.color }" />
          <span class="editor-legend__key">{{ g.key }}</span>
          <span class="editor-legend__val">{{ (char as any)[g.key] }}</span>
        </div>
      </div>

      <!-- Canvas -->
      <div class="editor-canvas-wrap">
        <canvas
          ref="editorCanvas"
          class="editor-canvas"
          @mousedown="onCanvasPointerDown"
          @mousemove="onCanvasMouseMove"
        />
      </div>

      <!-- Bottom inputs -->
      <div class="editor-footer" v-if="char">
        <q-input
          v-model.number="char.width"
          type="number" dense outlined label="width"
          class="editor-footer__field"
          @update:model-value="drawEditor(); emit('change')"
        />
        <q-input
          v-model.number="char.height"
          type="number" dense outlined label="height"
          class="editor-footer__field"
          @update:model-value="drawEditor(); emit('change')"
        />
        <q-input
          v-model="char.char"
          dense outlined label="char"
          class="editor-footer__field editor-footer__field--char"
          maxlength="2"
        />
      </div>

    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.editor-card {
  width: auto;
  min-width: 340px;
  max-width: 92vw;
  border-radius: 10px !important;
  overflow: hidden;
}

// ── Header ────────────────────────────────────────────────────────────────────
.editor-head {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #1e1e2e;
  color: #fff;
  padding: 10px 14px 10px 12px;

  &__char {
    font-size: 26px;
    font-weight: 700;
    font-family: monospace;
    line-height: 1;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    padding: 5px 12px;
    min-width: 44px;
    text-align: center;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__filename {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
  }

  &__dims {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    font-family: monospace;
  }
}

// ── Legend ────────────────────────────────────────────────────────────────────
.editor-legend {
  display: flex;
  gap: 6px;
  padding: 8px 12px;
  background: #f4f4f6;
  border-bottom: 1px solid #e4e4e8;

  &__chip {
    display: flex;
    align-items: center;
    gap: 5px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 3px 10px 3px 7px;
    font-size: 12px;
    font-family: monospace;
  }

  &__swatch {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__key {
    color: #999;
  }

  &__val {
    font-weight: 700;
    color: #222;
    min-width: 18px;
  }
}

// ── Canvas ────────────────────────────────────────────────────────────────────
.editor-canvas-wrap {
  overflow: auto;
  max-height: 55vh;
  // CSS checkerboard — covers the full wrap regardless of canvas size
  background-color: #ffffff;
  background-image:
    linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
    linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
    linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.editor-canvas {
  display: block;
  image-rendering: pixelated;
  cursor: default;
  // transparent so CSS checkerboard shows through everywhere
}

// ── Footer inputs ─────────────────────────────────────────────────────────────
.editor-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #fafafa;
  border-top: 1px solid #ebebeb;

  &__field {
    width: 82px;

    &--char {
      width: 64px;
    }
  }
}
</style>

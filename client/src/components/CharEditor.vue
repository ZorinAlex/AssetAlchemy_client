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
    case 'xoffset':  return PAD - char.xoffset;   // inverted: guide left = positive xoffset
    case 'xadvance': return PAD + char.xadvance;
    case 'yoffset':  return PAD + char.yoffset;
    default:         return 0;
  }
}

function applyDrag(key: string, px: number, char: IImageChar) {
  switch (key) {
    case 'xoffset':  char.xoffset  = Math.round(PAD - px); break;  // inverted
    case 'xadvance': char.xadvance = Math.max(1, Math.round(px - PAD)); break;
    case 'yoffset':  char.yoffset  = Math.round(px - PAD); break;
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

  // Checkerboard
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const tile = 12;
  ctx.fillStyle = '#d4d4d4';
  for (let r = 0; r < Math.ceil(canvas.height / tile); r++) {
    for (let c = (r % 2); c < Math.ceil(canvas.width / tile); c += 2) {
      ctx.fillRect(c * tile, r * tile, tile, tile);
    }
  }

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
  ctx.fillStyle = '#333';
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
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          Edit char: <strong>{{ char?.char }}</strong>
          <span class="text-caption q-ml-sm text-grey-6">{{ char?.image.name }}</span>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <!-- Legend with live values -->
        <div class="editor-legend q-mb-sm" v-if="char">
          <span
            v-for="g in [
              { key: 'xoffset',  color: '#2196f3' },
              { key: 'xadvance', color: '#ff9800' },
              { key: 'yoffset',  color: '#4caf50' },
            ]"
            :key="g.key"
            class="editor-legend__item"
          >
            <span class="editor-legend__dot" :style="{ background: g.color }" />
            <span class="editor-legend__label">{{ g.key }}:</span>
            <strong>{{ (char as any)[g.key] }}</strong>
          </span>
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

        <!-- Inputs: width / height / char -->
        <div class="editor-values q-mt-sm" v-if="char">
          <div class="editor-values__item">
            <span class="editor-values__label">width:</span>
            <q-input
              v-model.number="char.width"
              type="number"
              dense outlined
              style="width: 72px; margin-left: 4px"
              @update:model-value="drawEditor(); emit('change')"
            />
          </div>
          <div class="editor-values__item">
            <span class="editor-values__label">height:</span>
            <q-input
              v-model.number="char.height"
              type="number"
              dense outlined
              style="width: 72px; margin-left: 4px"
              @update:model-value="drawEditor(); emit('change')"
            />
          </div>
          <div class="editor-values__item">
            <span class="editor-values__label">char:</span>
            <q-input
              v-model="char.char"
              dense outlined
              style="width: 60px; margin-left: 4px"
              maxlength="2"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.editor-card {
  width: auto;
  min-width: 320px;
  max-width: 90vw;
}

.editor-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  &__item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-family: monospace;
  }

  &__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__label {
    color: #555;
  }
}

.editor-canvas-wrap {
  overflow: auto;
  max-height: 55vh;
  border: 1px solid #e0e0e0;
  background: #fff;
}

.editor-canvas {
  display: block;
  image-rendering: pixelated;
  cursor: default;
  max-width: 100%;
}

.editor-values {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;

  &__item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-family: monospace;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__label {
    color: #666;
  }
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IImageChar } from 'src/interfaces/imageFile';

const props = defineProps<{
  images: IImageChar[];
  lineHeight: number;
  fontName: string;
  size: number;   // auto-calculated from max char height, read-only
  base: number;   // baseline distance from line top, editable
}>();

const previewText = ref('1234');
const previewSize = ref(0); // 0 = natural (1:1), >0 = simulate Pixi font size
const previewCanvas = ref<HTMLCanvasElement | null>(null);
const imgCache = new Map<string, HTMLImageElement>();

function loadImage(url: string): Promise<HTMLImageElement> {
  if (imgCache.has(url)) return Promise.resolve(imgCache.get(url)!);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => { imgCache.set(url, img); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

function drawPreview() {
  const canvas = previewCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const chars = previewText.value.split('');

  if (props.images.length === 0) {
    canvas.width = 200;
    canvas.height = Math.max(props.lineHeight, 60);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  // Pixi-like scale: requestedSize / font.size
  const naturalSize = props.size > 0 ? props.size : Math.max(...props.images.map((i) => i.height), 1);
  const s = previewSize.value > 0 ? previewSize.value / naturalSize : 1;

  let totalW = 0;
  for (const ch of chars) {
    const ic = props.images.find((i) => i.char === ch);
    if (!ic) continue;
    totalW += ic.xadvance * s;
  }

  canvas.width  = Math.max(totalW, 10);
  canvas.height = Math.max(props.lineHeight * s, 10);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // glyphY = yoffset + (lineHeight - base)  — base shifts where chars land on the line
  const baseOffset = props.base > 0 ? (props.lineHeight - props.base) * s : 0;

  // Draw characters
  let penX = 0;
  for (const ch of chars) {
    const ic = props.images.find((i) => i.char === ch);
    if (!ic) continue;
    const img = imgCache.get(ic.image.url);
    if (img) ctx.drawImage(
      img,
      penX + ic.xoffset * s,
      ic.yoffset * s + baseOffset,
      ic.width * s,
      ic.height * s,
    );
    penX += ic.xadvance * s;
  }
}

async function renderPreview() {
  await Promise.all(props.images.map((ic) => loadImage(ic.image.url)));
  drawPreview();
}

function downloadPreview() {
  const canvas = previewCanvas.value;
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `${props.fontName || 'font'}_preview.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

watch(previewText,            drawPreview);
watch(previewSize,            drawPreview);
watch(() => props.images,     drawPreview, { deep: true });
watch(() => props.lineHeight, drawPreview);
watch(() => props.base,       drawPreview);

// Auto-init previewSize to font size on first load
watch(() => props.size, (val) => {
  if (previewSize.value === 0 && val > 0) previewSize.value = val;
});

defineExpose({ drawPreview, renderPreview });
</script>

<template>
  <div class="section-head">FONT PREVIEW</div>
  <div class="preview q-pa-sm">
    <div class="row items-center q-gutter-sm q-mb-sm">
      <q-input v-model="previewText" dense outlined label="preview text" style="width: 150px" />
      <q-input
        v-model.number="previewSize"
        type="number"
        dense
        outlined
        label="font size"
        style="width: 90px"
        :placeholder="previewSize === 0 ? '1:1' : ''"
      />
      <div class="size-badge">
        <span class="size-badge__label">size</span>
        <span class="size-badge__val">{{ size || '—' }}</span>
      </div>
      <q-btn flat dense icon="download" :disable="images.length === 0" @click="downloadPreview">
        <q-tooltip>Download preview as PNG</q-tooltip>
      </q-btn>
    </div>
    <div class="preview__bg">
      <canvas ref="previewCanvas" class="preview__canvas" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-head {
  background-color: $primary;
  color: white;
  padding: 5px;
  font-size: 14px;
}

.preview {
  background-color: #fafafa;
}

.preview__bg {
  display: inline-block;
  background: #1a1a2e;
  min-width: 120px;
  min-height: 48px;
}

.preview__canvas {
  display: block;
  image-rendering: pixelated;
}

.size-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #efefef;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;

  &__label {
    color: #888;
  }

  &__val {
    font-weight: 600;
    font-family: monospace;
    color: #333;
  }
}
</style>

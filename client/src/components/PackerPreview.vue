<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue';
import { MaxRectsPacker } from 'maxrects-packer';
import { IImageFile } from 'src/interfaces/imageFile';

const props = defineProps<{
  images: IImageFile[];
  maxSheetWidth: number;
  maxSheetHeight: number;
  padding: number;
  smart: boolean;
  pot: boolean;
  square: boolean;
  allowRotation: boolean;
  tag: boolean;
  border: number;
  scale: number;
}>();

interface PackedRect {
  x: number;
  y: number;
  width: number;
  height: number;
  rot: boolean;
  url: string;
}

interface Sheet {
  width: number;
  height: number;
  rects: PackedRect[];
}

const computing    = ref(false);
const sheets       = ref<Sheet[]>([]);
const currentIdx   = ref(0);
const previewCanvas = ref<HTMLCanvasElement | null>(null);
const imgCache     = new Map<string, HTMLImageElement>();

function loadImage(url: string): Promise<HTMLImageElement> {
  if (imgCache.has(url)) return Promise.resolve(imgCache.get(url)!);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => { imgCache.set(url, img); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

async function computePack() {
  if (props.images.length === 0) {
    sheets.value = [];
    return;
  }

  computing.value = true;

  try {
    // Load all images and get scaled dimensions
    const items = await Promise.all(
      props.images.map(async (imgFile) => {
        const img = await loadImage(imgFile.url);
        return {
          url:    imgFile.url,
          name:   imgFile.name,
          width:  Math.max(1, Math.round(img.naturalWidth  * props.scale)),
          height: Math.max(1, Math.round(img.naturalHeight * props.scale)),
        };
      })
    );

    const packer = new MaxRectsPacker(
      props.maxSheetWidth,
      props.maxSheetHeight,
      props.padding,
      {
        smart:         props.smart,
        pot:           props.pot,
        square:        props.square,
        allowRotation: props.allowRotation,
        tag:           props.tag,
        border:        props.border,
      }
    );

    packer.addArray(items as any);

    sheets.value = packer.bins.map((bin) => ({
      width:  bin.width,
      height: bin.height,
      rects: (bin.rects as any[]).map((r) => {
        // Plain objects don't have Rectangle's getter/setter, so the packer
        // sets rot=true but does NOT auto-swap width/height. We must do it manually:
        // packed area = origH × origW when rotated, but r.width/height = origW × origH.
        const rot = r.rot ?? false;
        return {
          x:      r.x,
          y:      r.y,
          width:  rot ? r.height : r.width,
          height: rot ? r.width  : r.height,
          rot,
          url:    r.url ?? '',
        };
      }),
    }));

    currentIdx.value = 0;
  } finally {
    computing.value = false;
    await nextTick();
    drawSheet();
  }
}

function drawSheet() {
  const canvas = previewCanvas.value;
  if (!canvas || sheets.value.length === 0) return;
  const sheet = sheets.value[currentIdx.value];
  if (!sheet) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const wrap = canvas.parentElement!;
  const maxW = (wrap.clientWidth  || 500) - 16;
  const maxH = (wrap.clientHeight || 400) - 16;

  // Always fit the full sheet without clipping (allow downscale, no upscale)
  const fitScale = Math.min(maxW / sheet.width, maxH / sheet.height, 1);

  canvas.width  = Math.max(Math.round(sheet.width  * fitScale), 1);
  canvas.height = Math.max(Math.round(sheet.height * fitScale), 1);

  // Transparent background — CSS pattern on wrap shows through
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const rect of sheet.rects) {
    const img = imgCache.get(rect.url);
    const dx = rect.x * fitScale;
    const dy = rect.y * fitScale;
    const dw = rect.width  * fitScale;
    const dh = rect.height * fitScale;

    if (img) {
      if (rect.rot) {
        // Pre-rotate on offscreen canvas — server does Jimp rotate(-90) = 90° CW
        // When rot=true: rect.width = origH, rect.height = origW (dims are swapped by packer)
        // dw = origH*f  (packed rect width),  dh = origW*f  (packed rect height)
        const ow = Math.max(Math.round(dw), 1);  // offscreen width  = origH*f
        const oh = Math.max(Math.round(dh), 1);  // offscreen height = origW*f
        const oc = document.createElement('canvas');
        oc.width  = ow;
        oc.height = oh;
        const octx = oc.getContext('2d')!;
        // CW 90°: translate to (ow, 0) = top-right, rotate +PI/2, draw at (0,0,oh,ow)
        octx.translate(ow, 0);
        octx.rotate(Math.PI / 2);
        octx.drawImage(img, 0, 0, oh, ow);
        // Stamp the rotated offscreen onto the main canvas at the packed rect position
        ctx.drawImage(oc, dx, dy, dw, dh);
      } else {
        ctx.drawImage(img, dx, dy, dw, dh);
      }
    } else {
      ctx.fillStyle = 'rgba(100,120,200,0.25)';
      ctx.fillRect(dx, dy, dw, dh);
    }

    // Subtle per-sprite border
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(dx) + 0.5, Math.round(dy) + 0.5, Math.round(dw) - 1, Math.round(dh) - 1);
  }
}

// Debounced repack on any setting change
let timer: ReturnType<typeof setTimeout> | null = null;
function schedule() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(computePack, 250);
}
onUnmounted(() => { if (timer) clearTimeout(timer); });

watch(
  [
    () => props.images,
    () => props.maxSheetWidth,
    () => props.maxSheetHeight,
    () => props.padding,
    () => props.smart,
    () => props.pot,
    () => props.square,
    () => props.allowRotation,
    () => props.tag,
    () => props.border,
    () => props.scale,
  ],
  schedule,
  { deep: true }
);

watch(currentIdx, () => nextTick(drawSheet));
</script>

<template>
  <div class="section-head">PREVIEW</div>
  <div class="pack-preview">

    <!-- Empty state -->
    <div v-if="images.length === 0" class="pack-preview__placeholder">
      <q-icon name="dashboard" size="36px" color="grey-4" />
      <span>upload images to see preview</span>
    </div>

    <!-- Computing -->
    <div v-else-if="computing" class="pack-preview__placeholder">
      <q-spinner color="primary" size="30px" />
      <span class="q-mt-sm">packing…</span>
    </div>

    <!-- Result -->
    <template v-else-if="sheets.length">
      <!-- Stats bar -->
      <div class="pack-preview__bar">
        <div class="pack-preview__info">
          <span class="pack-preview__sheets">
            {{ sheets.length }} sheet{{ sheets.length !== 1 ? 's' : '' }}
          </span>
          <span v-if="sheets[currentIdx]" class="pack-preview__dims">
            {{ sheets[currentIdx].width }} × {{ sheets[currentIdx].height }} px
          </span>
          <span class="pack-preview__sprites text-grey-6">
            {{ sheets[currentIdx]?.rects.length }} sprites
          </span>
        </div>
        <div v-if="sheets.length > 1" class="pack-preview__nav">
          <q-btn flat dense icon="chevron_left"  :disable="currentIdx === 0"                  @click="currentIdx--" />
          <span class="pack-preview__page">{{ currentIdx + 1 }} / {{ sheets.length }}</span>
          <q-btn flat dense icon="chevron_right" :disable="currentIdx === sheets.length - 1"  @click="currentIdx++" />
        </div>
      </div>

      <!-- Canvas -->
      <div class="pack-preview__canvas-wrap">
        <canvas ref="previewCanvas" class="pack-preview__canvas" />
      </div>
    </template>

  </div>
</template>

<style scoped lang="scss">
.section-head {
  display: flex;
  align-items: center;
  background-color: $primary;
  color: white;
  padding: 0 5px;
  font-size: 14px;
  height: 32px;
}

.pack-preview {
  height: 55vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;

  &__placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
    color: #bbb;
  }

  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 10px;
    background: #f0f0f0;
    border-bottom: 1px solid #e0e0e0;
    flex-shrink: 0;
    font-size: 12px;
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__sheets {
    font-weight: 600;
    color: #333;
  }

  &__dims {
    font-family: monospace;
    color: #666;
  }

  &__sprites {
    font-family: monospace;
    font-size: 11px;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  &__page {
    min-width: 44px;
    text-align: center;
    color: #555;
  }

  &__canvas-wrap {
    flex: 1;
    overflow: hidden;
    // Light checkerboard — shows canvas transparency
    background-color: #f8f8f8;
    background-image:
      linear-gradient(45deg, #e8e8e8 25%, transparent 25%),
      linear-gradient(-45deg, #e8e8e8 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #e8e8e8 75%),
      linear-gradient(-45deg, transparent 75%, #e8e8e8 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
  }

  &__canvas {
    display: block;
    image-rendering: pixelated;
    // Sheet boundary outline
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  }
}
</style>

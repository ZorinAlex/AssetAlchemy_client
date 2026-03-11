<template>
  <div class="row spine-row">
    <div class="col-9 column">
      <images-uploader height="120px" @update="handleUpdate" title="SPINE RESOURCES" type="any" />
      <div ref="pixiContainer" class="pixi-container"></div>
    </div>
    <div class="col-3 behavior__panel q-pa-md">
      <div class="q-mb-md">VERSION: {{ version }}</div>
      <q-btn
        @click="loadData"
        color="primary"
        outline
        class="full-width q-mb-md">Load Data
      </q-btn>
      <q-select
        square
        dense
        v-model="animation"
        :options="animations"
        class="q-mb-md"
        @update:model-value="onAnimationSelect"
        label="animation" />
      <q-select
        square
        dense
        v-model="skin"
        :options="skins"
        class="q-mb-md"
        label="skin" />

      <div class="text-weight-bold q-mb-xs">scale: {{ scale }}%</div>
      <q-slider v-model="scale" @update:model-value="setScale" :min="0" :max="100" />

      <div class="row q-mt-md">
        <div class="col-md-4">
          <q-btn @click="play" outline class="q-mr-sm">Play</q-btn>
        </div>
        <div class="col-md-4">
          <q-btn @click="stop" outline class="q-mr-sm">Stop</q-btn>
        </div>
        <div class="col-md-4">
          <q-toggle v-model="loop" label="loop" />
        </div>
      </div>

      <q-separator dark class="q-mt-sm q-mb-sm" />

      <!-- Timeline -->
      <div class="text-caption q-mb-xs">total duration: {{ time.toFixed(2) }}s</div>
      <div class="text-weight-bold row items-center justify-between q-mb-xs">
        <span>frame: {{ currentFrame }} / {{ totalFrames }}</span>
        <span>{{ (timePlay / 100).toFixed(2) }}s</span>
      </div>
      <q-slider v-model="timePlay" @update:model-value="updateAnimation" :min="0" :max="time * 100" />

      <!-- Speed -->
      <div class="text-weight-bold q-mt-sm q-mb-xs">speed: {{ speed.toFixed(1) }}x</div>
      <q-slider
        v-model="speed"
        @update:model-value="setSpeed"
        :min="0.1"
        :max="3"
        :step="0.1"
      />

      <!-- Background color -->
      <div class="text-weight-bold q-mt-sm q-mb-xs">Background color</div>
      <div class="row items-center q-gutter-sm">
        <q-btn flat square padding="none" class="color-swatch" :style="{ background: bgColor }">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="bgColor" @update:model-value="onBgColorChange" no-header-tabs />
          </q-popup-proxy>
        </q-btn>
        <span class="text-caption">{{ bgColor }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import * as PIXI from 'pixi.js';
import { Assets } from 'pixi.js';
import { IImageFile } from 'src/interfaces/imageFile';
import ImagesUploader from 'components/imagesUploader.vue';
import {
  Spine,
  SpineTexture,
  TextureAtlas,
  AtlasAttachmentLoader,
  SkeletonJson,
  SkeletonBinary,
} from '@esotericsoftware/spine-pixi-v7';
import { Notify } from 'quasar';

const pixiContainer = ref<HTMLDivElement | null>(null);
let app: PIXI.Application | null = null;

const images = ref<Array<IImageFile>>([]);
const animations = ref<string[]>([]);
const animation = ref<string>('');
const skins = ref<string[]>([]);
const skin = ref<string>('');
const loop = ref(false);
const version = ref('');
const scale = ref(100);
const time = ref(0);
const timePlay = ref(0);
const speed = ref(1);
const bgColor = ref('#1a1a2e');

const FPS = 30;
const currentFrame = computed(() => Math.round(timePlay.value / 100 * FPS));
const totalFrames = computed(() => Math.round(time.value * FPS));

let spineComponent: Spine | null = null;

// ─── drag ───────────────────────────────────────────────────────

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let dragCleanup: (() => void) | null = null;

function setupDrag() {
  if (dragCleanup) dragCleanup();

  const canvas = app!.view as HTMLCanvasElement;

  const onPointerDown = (e: PointerEvent) => {
    if (!spineComponent) return;
    isDragging = true;
    canvas.setPointerCapture(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    dragOffsetX = (e.clientX - rect.left) * scaleX - spineComponent.x;
    dragOffsetY = (e.clientY - rect.top) * scaleY - spineComponent.y;
    canvas.style.cursor = 'grabbing';
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging || !spineComponent) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    spineComponent.x = (e.clientX - rect.left) * scaleX - dragOffsetX;
    spineComponent.y = (e.clientY - rect.top) * scaleY - dragOffsetY;
  };

  const onPointerUp = () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.style.cursor = 'grab';

  dragCleanup = () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    canvas.style.cursor = '';
    isDragging = false;
  };
}

// ─── helpers ────────────────────────────────────────────────────

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

let resizeObserver: ResizeObserver | null = null;

// ─── controls ───────────────────────────────────────────────────

function onAnimationSelect() {
  if (!spineComponent || !animation.value) return;
  const anim = spineComponent.skeleton.data.findAnimation(animation.value);
  if (anim) time.value = anim.duration;
  timePlay.value = 0;
}

function play() {
  if (!spineComponent) return;
  // Disable first to avoid duplicate ticker registrations
  spineComponent.autoUpdate = false;
  if (skin.value) {
    spineComponent.skeleton.setSkin(null);
    spineComponent.skeleton.setSkinByName(skin.value);
    spineComponent.skeleton.setToSetupPose();
  }
  spineComponent.state.timeScale = speed.value;
  spineComponent.state.setAnimation(0, animation.value, loop.value);
  spineComponent.autoUpdate = true;
}

function stop() {
  if (!spineComponent) return;
  spineComponent.state.clearTracks();
  spineComponent.autoUpdate = false;
}

function updateAnimation() {
  if (!spineComponent) return;
  spineComponent.autoUpdate = false;
  spineComponent.state.timeScale = 1;
  spineComponent.state.setAnimation(0, animation.value, false);
  spineComponent.update(timePlay.value / 100);
}

function setScale() {
  if (spineComponent) {
    spineComponent.scale.set(scale.value / 100);
  }
}

function setSpeed() {
  if (spineComponent) {
    spineComponent.state.timeScale = speed.value;
  }
}

function onBgColorChange(hex: string) {
  if (app) {
    app.renderer.background.color = parseInt(hex.slice(1), 16);
  }
}

// ─── load data ──────────────────────────────────────────────────

async function loadData() {
  const jsonFile = images.value.find((f) => f.name.endsWith('.json'));
  const skelFile = images.value.find((f) => f.name.endsWith('.skel'));
  const skelInput = jsonFile ?? skelFile;
  const atlasFile = images.value.find((f) => f.name.endsWith('.atlas'));
  const imageFiles = images.value.filter((f) => f.type.includes('image'));

  if (!skelInput || !atlasFile || imageFiles.length === 0) {
    Notify.create('Потрібні файли: .json або .skel, .atlas і текстура(и) (png/jpg)');
    return;
  }

  try {
    const atlasText = await readAsText(atlasFile.file);

    // Reset playback state
    timePlay.value = 0;

    // Load all textures in parallel, index by filename (lowercase)
    const textureMap = new Map<string, PIXI.Texture>();
    await Promise.all(
      imageFiles.map(async (f) => {
        const tex = await Assets.load({ src: f.url, loadParser: 'loadTextures' });
        textureMap.set(f.name.toLowerCase(), tex);
      })
    );

    // Build TextureAtlas using new API
    const atlas = new TextureAtlas(atlasText);

    // Match each atlas page to the corresponding uploaded texture by filename
    for (const page of atlas.pages) {
      const pageName = page.name.split('/').pop()?.toLowerCase() ?? '';
      const tex = textureMap.get(pageName) ?? textureMap.values().next().value;
      if (tex) {
        page.setTexture(SpineTexture.from(tex.baseTexture));
      }
    }

    // Build skeleton data — JSON or binary
    const atlasLoader = new AtlasAttachmentLoader(atlas);
    let skeletonData;
    if (jsonFile) {
      const jsonText = await readAsText(jsonFile.file);
      const jsonData = JSON.parse(jsonText);
      version.value = jsonData.skeleton?.spine ?? '';
      skeletonData = new SkeletonJson(atlasLoader).readSkeletonData(jsonData);
    } else {
      const buffer = await readAsArrayBuffer(skelFile!.file);
      skeletonData = new SkeletonBinary(atlasLoader).readSkeletonData(new Uint8Array(buffer));
      version.value = skeletonData.version ?? '';
    }

    animations.value = skeletonData.animations.map((a: { name: string }) => a.name);
    animation.value = animations.value[0] ?? '';
    skins.value = skeletonData.skins.map((s: { name: string }) => s.name);

    // Cleanup previous
    if (spineComponent) {
      spineComponent.state.clearTracks();
      app?.stage.removeChild(spineComponent);
      spineComponent.destroy();
      spineComponent = null;
    }

    // Create and add new Spine object
    spineComponent = new Spine({ skeletonData });
    spineComponent.position.set(100, 100);
    spineComponent.state.timeScale = speed.value;
    scale.value = 100;
    onAnimationSelect();
    app!.stage.addChild(spineComponent);
    setupDrag();
  } catch (e) {
    Notify.create(`Помилка завантаження: ${e}`);
  }
}

// ─── uploader callback ──────────────────────────────────────────

function handleUpdate(data: Array<IImageFile>) {
  images.value = data;
}

// ─── lifecycle ──────────────────────────────────────────────────

onMounted(() => {
  if (pixiContainer.value) {
    app = new PIXI.Application({
      width: pixiContainer.value.offsetWidth,
      height: pixiContainer.value.offsetHeight,
      backgroundColor: 0x1a1a2e,
    });
    globalThis.__PIXI_APP__ = app;
    pixiContainer.value.appendChild(app.view);

    resizeObserver = new ResizeObserver((entries) => {
      if (!app) return;
      const { width, height } = entries[0].contentRect;
      app.renderer.resize(Math.floor(width), Math.floor(height));
    });
    resizeObserver.observe(pixiContainer.value);
  }
});

onBeforeUnmount(() => {
  if (dragCleanup) dragCleanup();
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (app) {
    app.destroy(true, { children: true });
    app = null;
  }
});
</script>

<style scoped>
.spine-row {
  height: calc(100vh - 60px);
}

.pixi-container {
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.pixi-container :deep(canvas) {
  position: absolute;
  top: 0;
  left: 0;
}

.behavior__panel {
  height: calc(100vh - 60px);
  max-height: 100vh;
  overflow-y: scroll;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
}
</style>

<script setup lang="ts">
import ImagesUploader from 'components/imagesUploader.vue';
import FontPreview from 'components/FontPreview.vue';
import CharEditor from 'components/CharEditor.vue';
import { IImageChar } from 'src/interfaces/imageFile';
import { ref, computed, watch } from 'vue';
import { getASCIIData } from 'src/utils/ascii';
import { ESpriteSheet } from 'src/interfaces/enums';
import { api } from 'boot/axios';
import { Notify } from 'quasar';

// ── font settings ─────────────────────────────────────────────────────────────
const loading     = ref(false);
const name        = ref('');
const format      = ref(ESpriteSheet.PNG);
const lineHeight  = ref(0);   // 0 = auto-init to size on first image load
const base        = ref(0);   // 0 = auto-init to size on first image load
const maxSheetWidth  = ref(1024);
const maxSheetHeight = ref(1024);
const quality     = ref(100);
const spaceWidth  = ref(20);

// ── images ────────────────────────────────────────────────────────────────────
const images    = ref<IImageChar[]>([]);
const previewRef = ref<InstanceType<typeof FontPreview> | null>(null);

// Auto-calculated font size (= max char height) — used as metadata in FNT/XML
const size = computed(() =>
  images.value.length > 0 ? Math.max(...images.value.map((i) => i.height)) : 0
);

function loadImageDimensions(url: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => resolve({ w: img.naturalWidth,  h: img.naturalHeight });
    img.onerror = () => resolve({ w: 64, h: 64 });
    img.src = url;
  });
}

async function handleUpdate(data: any[]) {
  const newImages: IImageChar[] = [];

  for (const imageFile of data) {
    // Preserve edits for images already in the list
    const existing = images.value.find((ic) => ic.image.name === imageFile.name);
    if (existing) {
      newImages.push({ ...existing, image: imageFile });
      continue;
    }

    const filename = imageFile.name.split('.')[0];
    const char = getASCIIData(filename)?.Char ?? filename.charAt(0);
    const { w, h } = await loadImageDimensions(imageFile.url);
    newImages.push({
      image: imageFile,
      char,
      width:    w,
      height:   h,
      xoffset:  0,
      yoffset:  0,
      xadvance: w,
    });
  }

  images.value = newImages;

  // Auto-init lineHeight and base to size (max char height) on first load
  if (newImages.length > 0) {
    const maxH = Math.max(...newImages.map((i) => i.height));
    if (lineHeight.value === 0) lineHeight.value = maxH;
    if (base.value === 0)       base.value       = maxH;
  }

  previewRef.value?.renderPreview();
}

// ── character editor ──────────────────────────────────────────────────────────
const editorOpen = ref(false);
const editorChar = ref<IImageChar | null>(null);

function openEditor(ic: IImageChar) {
  editorChar.value = ic;
  editorOpen.value = true;
}

// When editor closes — ensure preview is up-to-date (async reload into cache)
watch(editorOpen, (open) => {
  if (!open) previewRef.value?.renderPreview();
});

// ── pack ──────────────────────────────────────────────────────────────────────
async function pack() {
  const formData = new FormData();
  const data: object[] = [];
  loading.value = true;

  images.value.forEach((imageData) => {
    formData.append('files', imageData.image.file);
    data.push({
      filename: imageData.image.name,
      char:     imageData.char,
      width:    imageData.width,
      height:   imageData.height,
      xoffset:  imageData.xoffset,
      yoffset:  imageData.yoffset,
      xadvance: imageData.xadvance,
    });
  });

  formData.append('name',           name.value.trim() || 'unnamed');
  formData.append('format',         format.value);
  formData.append('size',           size.value.toString());
  formData.append('lineHeight',     lineHeight.value.toString());
  formData.append('base',           base.value.toString());
  formData.append('data',           JSON.stringify(data));
  formData.append('maxSheetWidth',  maxSheetWidth.value.toString());
  formData.append('maxSheetHeight', maxSheetHeight.value.toString());
  formData.append('quality',        quality.value.toString());
  formData.append('spaceWidth',     spaceWidth.value.toString());

  try {
    const response = await api.post('/packer/bfont', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = name.value + '.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error('Error uploading files:', error);
    Notify.create(`Font creation error: ${error.message}`);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <images-uploader height="25vh" @update="handleUpdate" title="IMAGES FOR FONT" />

  <div class="row no-wrap">
    <!-- Preview (1/2) -->
    <div class="col-6">
      <font-preview
        ref="previewRef"
        :images="images"
        :line-height="lineHeight"
        :font-name="name"
        :size="size"
        :base="base"
      />
    </div>

    <!-- Charmap (1/2) -->
    <div class="col-6">
      <div class="section-head">
        IMAGES TO CHAR MAP
        <span class="section-head__hint">— click a row to edit</span>
      </div>
      <div class="charmap">
        <table class="charmap__table">
          <thead>
            <tr>
              <th>img</th>
              <th>char</th>
              <th>width</th>
              <th>height</th>
              <th>xoffset</th>
              <th>yoffset</th>
              <th>xadvance</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="image of images"
              :key="image.image.id"
              class="charmap__row"
              @click="openEditor(image)"
            >
              <td><img :src="image.image.url" class="charmap__thumb" /></td>
              <td class="charmap__val">{{ image.char }}</td>
              <td class="charmap__val">{{ image.width }}</td>
              <td class="charmap__val">{{ image.height }}</td>
              <td class="charmap__val">{{ image.xoffset }}</td>
              <td class="charmap__val">{{ image.yoffset }}</td>
              <td class="charmap__val">{{ image.xadvance }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Character editor dialog -->
  <char-editor
    v-model="editorOpen"
    :char="editorChar"
    @change="previewRef?.drawPreview()"
  />

  <!-- Font settings -->
  <div class="row q-mt-sm q-px-sm">
    <div class="col-md-3 col-sm-6 q-pr-md">
      <q-input v-model="name"   label="font name" />
      <q-select v-model="format" :options="Object.values(ESpriteSheet)" label="format" />
      <q-input :model-value="size || '—'" label="size (auto)" readonly />
    </div>
    <div class="col-md-3 col-sm-6 q-pr-md">
      <q-input v-model.number="lineHeight" type="number" label="line height" />
      <q-input v-model.number="base"       type="number" label="base" />
      <q-input v-model.number="spaceWidth" type="number" label="space width" />
    </div>
    <div class="col-md-3 col-sm-6 q-pr-md">
      <q-input v-model.number="maxSheetWidth"  type="number" label="max width" />
      <q-input v-model.number="maxSheetHeight" type="number" label="max height" />
    </div>
    <div class="col-md-3 col-sm-6">
      <q-input v-model.number="quality" type="number" label="quality" />
      <q-btn
        class="q-mt-sm full-width"
        label="pack"
        color="primary"
        outline
        :disable="images.length === 0"
        :loading="loading"
        @click="pack"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-head {
  background-color: $primary;
  color: white;
  padding: 5px;
  font-size: 14px;

  &__hint {
    font-size: 11px;
    opacity: 0.75;
    font-weight: normal;
  }
}

// ── Charmap ──────────────────────────────────────────────────────────────────
.charmap {
  width: 100%;
  background-color: #fafafa;
  overflow: auto;
  max-height: 28vh;
}

.charmap__table {
  width: 100%;
  border-collapse: collapse;

  th {
    padding: 4px 10px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #555;
    border-bottom: 1px solid #e0e0e0;
    white-space: nowrap;
    position: sticky;
    top: 0;
    background: #fafafa;
    z-index: 1;
  }

  td {
    padding: 2px 8px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
  }
}

.charmap__row {
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #edf5ff; }
}

.charmap__thumb {
  width: 32px;
  height: 32px;
  object-fit: contain;
  display: block;
}

.charmap__val {
  font-size: 13px;
  font-family: monospace;
  color: #333;
}
</style>

<script setup lang="ts">
import ImagesUploader from 'components/imagesUploader.vue';
import PackerPreview from 'components/PackerPreview.vue';
import { ref } from 'vue';
import { ESpriteSheet } from 'src/interfaces/enums';
import { IImageFile } from 'src/interfaces/imageFile';
import { api } from 'boot/axios';
import { Notify } from 'quasar';

const name           = ref('');
const format         = ref(ESpriteSheet.PNG);
const maxSheetWidth  = ref(1024);
const maxSheetHeight = ref(1024);
const padding        = ref(0);
const smart          = ref(true);
const pot            = ref(false);
const square         = ref(false);
const allowRotation  = ref(true);
const tag            = ref(false);
const border         = ref(0);
const scale          = ref(1);
const quality        = ref(100);
const loading        = ref(false);
const images         = ref<IImageFile[]>([]);

function handleUpdate(data: IImageFile[]) {
  images.value = data;
}

async function pack() {
  loading.value = true;
  const formData = new FormData();
  images.value.forEach((file) => formData.append('files', file.file));
  formData.append('name',           name.value.trim() || 'spritesheet');
  formData.append('format',         format.value);
  formData.append('maxSheetWidth',  maxSheetWidth.value.toString());
  formData.append('maxSheetHeight', maxSheetHeight.value.toString());
  formData.append('padding',        padding.value.toString());
  formData.append('smart',          smart.value.toString());
  formData.append('pot',            pot.value.toString());
  formData.append('square',         square.value.toString());
  formData.append('allowRotation',  allowRotation.value.toString());
  formData.append('tag',            tag.value.toString());
  formData.append('border',         border.value.toString());
  formData.append('scale',          scale.value.toString());
  formData.append('quality',        quality.value.toString());

  try {
    const response = await api.post('/packer/pack', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = (name.value.trim() || 'spritesheet') + '.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error('Pack error:', error);
    Notify.create(`Pack error: ${error.message}`);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <!-- Uploader + Preview side by side -->
  <div class="row no-wrap">
    <div class="col-6">
      <images-uploader height="55vh" @update="handleUpdate" title="IMAGES FOR PACK" />
    </div>
    <div class="col-6">
      <packer-preview
        :images="images"
        :max-sheet-width="maxSheetWidth"
        :max-sheet-height="maxSheetHeight"
        :padding="padding"
        :smart="smart"
        :pot="pot"
        :square="square"
        :allow-rotation="allowRotation"
        :tag="tag"
        :border="border"
        :scale="scale"
      />
    </div>
  </div>

  <!-- Settings -->
  <div class="row q-mt-sm q-px-sm">
    <div class="col-md-3 col-sm-6 q-pr-md">
      <q-input v-model="name" label="sprite sheet name" />
      <q-select v-model="format" :options="Object.values(ESpriteSheet)" label="format" />
    </div>

    <div class="col-md-3 col-sm-6 q-pr-md">
      <q-input v-model.number="maxSheetWidth"  type="number" label="max width">
        <q-tooltip anchor="top middle" self="bottom middle">Max sprite sheet width</q-tooltip>
      </q-input>
      <q-input v-model.number="maxSheetHeight" type="number" label="max height">
        <q-tooltip anchor="top middle" self="bottom middle">Max sprite sheet height</q-tooltip>
      </q-input>
    </div>

    <div class="col-md-3 col-sm-6 q-pr-md">
      <div class="row">
        <div class="col q-pr-sm">
          <q-input v-model.number="scale"   type="number" label="scale">
            <q-tooltip anchor="top middle" self="bottom middle">Images scale</q-tooltip>
          </q-input>
        </div>
        <div class="col">
          <q-input v-model.number="quality" type="number" label="quality">
            <q-tooltip anchor="top middle" self="bottom middle">Images quality</q-tooltip>
          </q-input>
        </div>
      </div>
      <div class="row">
        <div class="col q-pr-sm">
          <q-input v-model.number="padding" type="number" label="padding">
            <q-tooltip anchor="top middle" self="bottom middle">Padding between images</q-tooltip>
          </q-input>
        </div>
        <div class="col">
          <q-input v-model.number="border"  type="number" label="border">
            <q-tooltip anchor="top middle" self="bottom middle">Atlas edge spacing</q-tooltip>
          </q-input>
        </div>
      </div>
    </div>

    <div class="col-md-3 col-sm-6">
      <div class="row q-gutter-xs">
        <q-toggle v-model="smart"         label="smart">
          <q-tooltip anchor="top middle" self="bottom middle">Pack with smallest possible size</q-tooltip>
        </q-toggle>
        <q-toggle v-model="allowRotation" label="allow rotate">
          <q-tooltip anchor="top middle" self="bottom middle">Allow 90° rotation while packing</q-tooltip>
        </q-toggle>
        <q-toggle v-model="pot"           label="pot">
          <q-tooltip anchor="top middle" self="bottom middle">Round up to power of 2</q-tooltip>
        </q-toggle>
        <q-toggle v-model="square"        label="square">
          <q-tooltip anchor="top middle" self="bottom middle">Bin size always square</q-tooltip>
        </q-toggle>
        <q-toggle v-model="tag"           label="tag">
          <q-tooltip anchor="top middle" self="bottom middle">Tag-based group packing</q-tooltip>
        </q-toggle>
      </div>
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
</style>

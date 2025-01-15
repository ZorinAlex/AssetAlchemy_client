<script setup lang="ts">

import ImagesUploader from 'components/imagesUploader.vue';
import { ref } from 'vue';
import { ESpriteSheet } from 'src/interfaces/enums';
import { IImageFile } from 'src/interfaces/imageFile';
import { api } from 'boot/axios';
import { Notify } from 'quasar';

const name: string = ref('');
const format: string = ref(ESpriteSheet.PNG);
const maxSheetWidth: number = ref(1024);
const maxSheetHeight: number = ref(1024);
const padding: number = ref(0);
const smart: boolean = ref(true);
const pot: boolean = ref(false);
const square: boolean = ref(false);
const allowRotation: boolean = ref(true);
const tag: boolean = ref(false);
const border: number = ref(0);
const scale: number = ref(1);
const quality: number = ref(100);

const loading: boolean = ref(false);

let images: Array<IImageFile> = ref([])

async function pack(){
  loading.value = true;
  const formData = new FormData();
  images.value.forEach((file) => {
    formData.append('files', file.file);
  });
  formData.append('name', name.value);
  formData.append('format', format.value);
  formData.append('maxSheetWidth', maxSheetWidth.value);
  formData.append('maxSheetHeight', maxSheetHeight.value);
  formData.append('padding', padding.value);
  formData.append('smart', smart.value);
  formData.append('pot', pot.value);
  formData.append('square', square.value);
  formData.append('allowRotation', allowRotation.value);
  formData.append('tag', tag.value);
  formData.append('border', border.value);
  formData.append('scale', scale.value);
  formData.append('quality', quality.value);

  try {
    const response = await api.post('/packer/pack', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name.value + '.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    loading.value = false;
  } catch (error) {
    console.error('Error uploading files:', error);
    loading.value = false;
    Notify.create(`Pack error: ${error.message}`);
  }
}

function handleUpdate(data) {
  images.value = data;
}

</script>

<template>
  <images-uploader height="70vh" @update="handleUpdate" title="IMAGES FOR PACK"/>
  <div class="row">
    <div class="col-md-3 col-sm-6 q-pr-md">
      <q-input
        v-model="name"
        label="sprite sheet name"
      />
      <q-select
        v-model="format"
        :options="Object.values(ESpriteSheet)"
        label="format"
      />
    </div>
    <div class="col-md-3 col-sm-6 q-pr-md">
      <q-input
        v-model.number="maxSheetWidth"
        type="number"
        label="max width"
      >
        <q-tooltip anchor="top middle" self="bottom middle">
          Max sprite sheet width
        </q-tooltip>
      </q-input>
      <q-input
        v-model.number="maxSheetHeight"
        type="number"
        label="max height"
      >
        <q-tooltip anchor="top middle" self="bottom middle">
          Max sprite sheet height
        </q-tooltip>
      </q-input>
    </div>
    <div class="col-md-3 col-sm-6 q-pr-md">
      <div class="row">
        <div class="col q-pr-md">
          <q-input
            v-model.number="scale"
            type="number"
            label="images scale"
          >
            <q-tooltip anchor="top middle" self="bottom middle">
              Images scale
            </q-tooltip>
          </q-input>
        </div>
        <div class="col">
          <q-input
            v-model.number="quality"
            type="number"
            label="images quality"
          >
            <q-tooltip anchor="top middle" self="bottom middle">
              Images quality
            </q-tooltip>
          </q-input>
        </div>
      </div>
      <div class="row">
        <div class="col q-pr-md">
          <q-input
            v-model.number="padding"
            type="number"
            label="padding"
          >
            <q-tooltip anchor="top middle" self="bottom middle">
              padding between images
            </q-tooltip>
          </q-input>
        </div>
        <div class="col">
          <q-input
            v-model.number="border"
            type="number"
            label="border"
          >
            <q-tooltip anchor="top middle" self="bottom middle">
              atlas edge spacing
            </q-tooltip>
          </q-input>
        </div>
      </div>
    </div>
    <div class="col-md-3 col-sm-6">
      <div class="row">
        <q-toggle v-model="smart" label="smart">
          <q-tooltip anchor="top middle" self="bottom middle">
            packing with smallest possible size
          </q-tooltip>
        </q-toggle>
        <q-toggle v-model="allowRotation" label="allow rotate">
          <q-tooltip anchor="top middle" self="bottom middle">
            allow 90-degree rotation while packing
          </q-tooltip>
        </q-toggle>
        <q-toggle v-model="pot" label="pot">
          <q-tooltip anchor="top middle" self="bottom middle">
            bin size round up to smallest power of 2
          </q-tooltip>
        </q-toggle>
        <q-toggle v-model="square" label="square">
          <q-tooltip anchor="top middle" self="bottom middle">
            bin size shall always be square
          </q-tooltip>
        </q-toggle>
        <q-toggle v-model="tag" label="tag">
          <q-tooltip anchor="top middle" self="bottom middle">
            allow tag based group packing
          </q-tooltip>
        </q-toggle>
      </div>
      <div class="row q-px-sm">
        <q-btn
          label="pack"
          color="primary"
          outline
          :disable="images.length === 0"
          :loading="loading"
          style="width: 95%"
          @click="pack"
        />
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>

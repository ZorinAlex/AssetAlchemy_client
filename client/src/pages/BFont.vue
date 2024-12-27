<script setup lang="ts">
import ImagesUploader from 'components/imagesUploader.vue';
import { IImageChar, IImageFile } from 'src/interfaces/imageFile';
import {forEach} from 'lodash';
import { ref } from 'vue';
import { asciiTable } from 'src/utils/ascii';
import { ESpriteSheet } from 'src/interfaces/enums';
import axios from 'axios';

const name: string = ref('');
const format: string = ref(ESpriteSheet.PNG);
const size: number = ref(25);
const lineHeight: number = ref(25);
const maxSheetWidth: number = ref(1024);
const maxSheetHeight: number = ref(1024);
const scale: number = ref(1);
const quality: number = ref(100);

let images: Array<IImageChar> = ref([])

function handleUpdate(data) {
  images.value = [];
  forEach(data, (imageFile)=>{
    const filename = imageFile.name.split('.')[0];
    const firstLetter = Array.from(filename)[0];
    const dataImage: IImageChar = {
      image: imageFile,
      char: null
    }
    if(asciiTable.has(firstLetter)){
      dataImage.char = asciiTable.get(firstLetter).Char
    }
    if(filename.includes('dot')){
      dataImage.char = asciiTable.get('.').Char
    }
    if(filename.includes('com')){
      dataImage.char = asciiTable.get(',').Char
    }
    images.value.push(dataImage)
  })
}

async function pack(){
  const formData = new FormData();
  const data = []
  images.value.forEach((imageData) => {
    formData.append('files', imageData.image.file);
    data.push({filename: imageData.image.name, char: imageData.char});
  });
  formData.append('name', name.value);
  formData.append('format', format.value);
  formData.append('size', size.value);
  formData.append('lineHeight', lineHeight.value);
  formData.append('data', JSON.stringify(data))
  formData.append('maxSheetWidth', maxSheetWidth.value);
  formData.append('maxSheetHeight', maxSheetHeight.value);
  formData.append('scale', scale.value);
  formData.append('quality', quality.value);
  try {
    const response = await axios.post('http://localhost:3100/packer/bfont', formData, {
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
  } catch (error) {
    console.error('Error uploading files:', error);
  }
}
</script>

<template>
  <images-uploader height="25vh" @update="handleUpdate" title="images for font"/>
  <div class="bg-grey-9 charmap__head">Image to char map</div>
  <div class="charmap">
    <div v-for="image of images" class="charmap__item">
      <q-input  v-model="image.char" label="char">
        <template v-slot:prepend>
            <q-img :src="image.image.url" fit="contain" class="charmap__image"/>
        </template>
      </q-input>
    </div>
  </div>
  <div class="row">
    <div class="col-md-3 col-sm-6">
      <q-input
        filled
        v-model="name"
        label="font name"
      />
      <q-select
        filled
        v-model="format"
        :options="Object.values(ESpriteSheet)"
        label="format"
      />
    </div>
    <div class="col-md-3 col-sm-6">
      <q-input
        v-model.number="size"
        type="number"
        label="size"
        filled
      >
      </q-input>
      <q-input
        v-model.number="lineHeight"
        type="number"
        label="line height"
        filled
      >
      </q-input>
    </div>
    <div class="col-md-3 col-sm-6">
      <q-input
        v-model.number="maxSheetWidth"
        type="number"
        label="max width"
        filled
      >
      </q-input>
      <q-input
        v-model.number="maxSheetHeight"
        type="number"
        label="max height"
        filled
      >
      </q-input>
    </div>
    <div class="col-md-3 col-sm-6">
      <q-input
        v-model.number="scale"
        type="number"
        label="scale"
        filled
      >
      </q-input>
      <q-input
        v-model.number="quality"
        type="number"
        label="quality"
        filled
      >
      </q-input>
    </div>
  </div>
  <div class="row q-pa-sm flex justify-end">
    <q-btn
      label="pack"
      color="primary"
      outline
      :disable="images.length === 0"
      @click="pack"
      style="width: 200px"
    />
  </div>
</template>

<style scoped lang="scss">
.charmap {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  padding: 5px;
  background-color: #dcdcdc;
  overflow-y: scroll;
  position: relative;
  align-content: flex-start;
  height: 20vh;
}

.charmap__head {
  color: white;
  padding: 5px;
  font-size: 16px;
}

.charmap__item {
  display: flex;
  flex-direction: row;
}

.charmap__image {
  width: 30px;
  height: 30px;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, toRaw } from 'vue';
import ImageFile from "components/imageFile.vue";
import {IImageFile} from "src/interfaces/imageFile";

function onDrop(e) {
  setInactive();
  [...e.dataTransfer.files].forEach(file=> addImageFile(file))
}

const events = ['dragenter', 'dragover', 'dragleave', 'drop']
const emit = defineEmits(['update']);
let active = ref(false)
let files: Array<IImageFile> = ref([])
let fileInput = ref(null);

function addBtn(){
  fileInput.value.click()
}

function cleanBtn(){
  files.value = [];
  emit('update', toRaw(files.value));
}

function fromInput(e){
  [...e.target.files].forEach(file=> addImageFile(file))
}

function addImageFile(file: File){
  const fileIndex = files.value.findIndex(f => f.name === file.name);
  if(file.type.includes('image') && fileIndex<0){
    files.value.push({
      name: file.name,
      type: file.type,
      id: new Date().getTime().toString(),
      url: URL.createObjectURL(file),
      file: file
    })
    emit('update', toRaw(files.value));
  }
}

function removeImage(name){
  const fileIndex = files.value.findIndex(f => f.name === name);
  if(fileIndex>=0){
    files.value.splice(fileIndex,1);
    emit('update', toRaw(files.value));
  }
}

function setActive() {
  active.value = true
}

function setInactive() {
  active.value = false
}

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, (e)=>e.preventDefault())
  })
})

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, (e)=>e.preventDefault())
  })
})

</script>

<template>
<div class="images-uploader">
  <div class="images-uploader__head bg-grey-9">
    <div class="images-uploader__head_text">Images for pack: {{files.length}}</div>
    <q-space></q-space>
    <q-btn flat dense icon="add" class="text-white" @click="addBtn"/>
    <q-btn flat dense icon="clear_all" class="text-white" @click="cleanBtn"/>
    <input type="file" name="" ref="fileInput" style="display: none" accept="image/*" multiple @input.prevent="fromInput"/>
  </div>
  <div
    class="images-uploader__body"
    :class="{ 'images-uploader__body--active': active }"
    ref="dropzone"
    @drop.prevent="onDrop"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
  >
    <div class="images-uploader__body__label">Drag`n Drop Images Here</div>
    <image-file v-for="fileImage of files" :file="fileImage" :key="fileImage.id" @remove="removeImage"></image-file>
  </div>
</div>
</template>

<style scoped>
  .images-uploader__head{
    display: flex;
    flex-direction: row;
  }
  .images-uploader__head_text{
    color: white;
    padding: 5px;
    font-size: 16px;
  }
  .images-uploader__body{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 70vh;
    padding: 10px;
    background-color: #dcdcdc;
    overflow-y:scroll;
    position: relative;
    align-content: flex-start;
  }
  .images-uploader__body--active{
    background-color: #f3f3f3;
  }
  .images-uploader__body__label{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    font-size: 40px;
    font-weight: bold;
    color: #afafaf;
    user-select: none;
  }
</style>

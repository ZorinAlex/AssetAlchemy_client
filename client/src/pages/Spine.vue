<template>
  <div class="row">
    <div class="col-9">
      <images-uploader height="120px" @update="handleUpdate" title="spine resources" type="any" />

      <div ref="pixiContainer" class="pixi-container">
      </div>
      <div class="row q-px-lg">

      </div>
    </div>
    <div class="col-3 behavior__panel q-pa-md" :key="panelkey">
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
      <div>scale: {{ scale }}%</div>
      <q-slider v-model="scale" @update:model-value="setScale" :min="0" :max="100" />
      <div class="row">
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
      <div class="q-mb-md">
        duration: {{time.toFixed(2)}}s
      </div>
      <q-slider v-model="timePlay" @update:model-value="updateAnimation" :min="0" :max="time*100" />
    </div>
  </div>

</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as PIXI from 'pixi.js';
import { IImageFile } from 'src/interfaces/imageFile';
import ImagesUploader from 'components/imagesUploader.vue';
import { find, forEach, map } from 'lodash';

import { Assets } from 'pixi.js';
import { Spine, TextureAtlas } from 'pixi-spine';
import * as runtime_41 from '@pixi-spine/runtime-4.1';
import * as runtime_40 from '@pixi-spine/runtime-4.0';
import * as runtime_38 from '@pixi-spine/runtime-3.8';
import * as runtime_37 from '@pixi-spine/runtime-3.7';
import { Notify } from 'quasar';

let currentRuntime = runtime_37

const pixiContainer = ref<HTMLDivElement | null>(null);
let app: PIXI.Application | null = null;
let images: Array<IImageFile> = ref([]);
let panelkey = ref(0);
const animations = ref([]);
const animation = ref();
const skins = ref([]);
const skin = ref();
const loop = ref(false);
const version = ref('');
const scale = ref(100);
const time = ref(0);

const timePlay = ref(0);

let spineJson, spineAtlas, spineTexture, spineComponent;

const file = ref();

const onResize = () => {
  if (app && pixiContainer.value) {
    app.renderer.resize(pixiContainer.value.offsetWidth, pixiContainer.value.offsetHeight);
    if (spineComponent) {
      spineComponent.position.set(app.screen.width / 2, app.screen.height / 2);
    }
  }
};

function onAnimationSelect(){
  if(!spineComponent) return;
  const anim = spineComponent.spineData.findAnimation(animation.value);
  time.value = anim.duration;
}


function play() {
  if (skin.value && spineComponent) {
    spineComponent.skeleton.setSkin(null);
    spineComponent.skeleton.setSkinByName(skin.value);
    spineComponent.skeleton.setToSetupPose();
  }
  spineComponent.state.setAnimation(0, animation.value, loop.value);
  spineComponent.autoUpdate = true;
}

function stop(){
  if(!spineComponent) return;
  spineComponent.state.clearTracks()
}

function updateAnimation(){
  let time = timePlay.value/100;
  spineComponent.state.setAnimation(0, animation.value, loop.value);
  spineComponent.autoUpdate = false;
  spineComponent.update(time)
}

function setScale() {
  if (spineComponent) {
    spineComponent.scale.set(scale.value / 100);
  }
}

async function loadData() {
  for (let i = 0; i < images.value.length; i++) {
    if (images.value[i].name.includes('json')) {
      handleJson(images.value[i]);
    } else if (images.value[i].name.includes('atlas')) {
      handleAtlas(images.value[i]);
    } else if (images.value[i].type.includes('image')) {
      spineTexture = await Assets.load({ src: images.value[i].url, loadParser: 'loadTextures' });
    }
  }

  const spineAtlasParser = new TextureAtlas(spineAtlas, (line, callback) => {
    callback(spineTexture);
  });

  // Create a Spine loader
  const spineAtlasLoader = new currentRuntime.AtlasAttachmentLoader(spineAtlasParser);
  const spineJsonLoader = new currentRuntime.SkeletonJson(spineAtlasLoader);

  // Load the Skeleton data
  const skeletonData = spineJsonLoader.readSkeletonData(spineJson);

  // Create the Spine animation

  if(spineComponent){
    spineComponent.state.clearTracks();
    app.stage.removeChild(spineComponent);
  }
  spineComponent = new Spine(skeletonData);
  spineComponent.position.set(app.screen.width / 2, app.screen.height / 2);
  scale.value = 100;
  onAnimationSelect();
  app.stage.addChild(spineComponent);
}

function handleJson(data: IImageFile) {
  const reader = new FileReader();
  reader.onload = (e) => {
    spineJson = JSON.parse(e.target.result);
    if (spineJson.animations) {
      animations.value = Object.keys(spineJson.animations);
      animation.value = animations.value[0];
    }
    if (spineJson.skins) {
      skins.value = map(spineJson.skins, skin => skin.name);
    }
    version.value = spineJson.skeleton?.spine;
    setRuntime();
  };
  reader.readAsText(data.file);
}

function setRuntime(){
  const ver = extractVersion(version.value);
  switch (ver){
    case '3.7':
      currentRuntime = runtime_37
      break;
    case '3.8':
      currentRuntime = runtime_38
      break;
    case '4.0':
      currentRuntime = runtime_40
      break;
    case '4.1':
      currentRuntime = runtime_41
      break;
    default:
        Notify.create(`Unsupported version: ${version.value}`);
  }
}

function extractVersion(inputString) {
  const match = inputString.match(/^(\d+\.\d+)/);
  return match ? match[1] : null;
}

function handleAtlas(data: IImageFile) {
  const reader = new FileReader();
  reader.onload = (e) => {
    spineAtlas = e.target.result;
  };
  reader.readAsText(data.file);
}

function handleUpdate(data) {
  images.value = data;
}

onMounted(() => {
  if (pixiContainer.value) {
    app = new PIXI.Application({
      width: pixiContainer.value.offsetWidth,
      height: 600,
      backgroundColor: 0xffffff,
    });
    globalThis.__PIXI_APP__ = app;
    pixiContainer.value.appendChild(app.view);

    // Add resize event listener
    window.addEventListener('resize', onResize);
  }
});

onBeforeUnmount(() => {
  if (app) {
    app.destroy(true, { children: true });
    app = null;
  }
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped>
.pixi-container {
  width: 100%;
  height: 600px;
  position: relative;
}

.behavior__panel {
  height: calc(100vh - 50px);
  max-height: 100vh;
  overflow-y: scroll;
}

.file-buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>

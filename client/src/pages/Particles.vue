<template>
  <div class="row">
      <div class="col-9">
        <images-uploader height="120px" @update="handleUpdate" title="IMAGES FOR PARTICLES"/>
        <div ref="pixiContainer" class="pixi-container">
          <div class="particles-counter">PARTICLES: {{particleCount}}</div>
        </div>
        <div class="row q-px-lg">
          <div class="col-md-2 col-sm-6 q-pr-md">
            <q-input
              v-model.number="lifetimeMin"
              type="number"
              label="lifetime min"
              square
              @change="particleEmitter.minLifetime = lifetimeMin"
            ></q-input>
            <q-input
              v-model.number="lifetimeMax"
              type="number"
              label="lifetime max"
              square
              @change="particleEmitter.maxLifetime = lifetimeMax"
            ></q-input>
          </div>
          <div class="col-md-2 col-sm-6 q-pr-md">
            <q-input
              v-model.number="posX"
              type="number"
              label="position X"
              square
              @change="particleEmitter.updateSpawnPos(posX, posY)"
            ></q-input>
            <q-input
              v-model.number="posY"
              type="number"
              label="position Y"
              square
              @change="particleEmitter.updateSpawnPos(posX, posY)"
            ></q-input>
          </div>
          <div class="col-md-2 col-sm-6 q-pr-md">
            <q-input
              v-model.number="frequency"
              type="number"
              label="frequency"
              square
              @change="particleEmitter.frequency = frequency"
            ></q-input>
            <q-input
              v-model.number="spawnChance"
              type="number"
              label="spawn chance"
              square
              @change="particleEmitter.spawnChance = spawnChance"
            ></q-input>
          </div>
          <div class="col-md-2 col-sm-6 q-pr-md">
            <q-input
              v-model.number="particlesPerWave"
              type="number"
              label="particles per wave"
              square
              @change="particleEmitter.particlesPerWave = particlesPerWave"
            ></q-input>
            <q-input
              v-model.number="emitterLifetime"
              type="number"
              label="emitter lifetime"
              square
              @change="particleEmitter.emitterLifetime = emitterLifetime"
            ></q-input>
          </div>
          <div class="col-md-2 col-sm-6">
            <q-input
              v-model.number="maxParticles"
              type="number"
              label="max particles"
              square
              @change="particleEmitter.maxParticles = maxParticles"
            ></q-input>
            <q-toggle
              class="q-pt-sm"
              v-model="addAtBack"
              label="add at back"
              @update:model-value="particleEmitter.addAtBack= addAtBack"
            />

          </div>
          <div class="col-md-2 col-sm-6 file-buttons q-pl-md">
            <q-btn label="get json" color="primary" outline class="full-width" @click="downloadJson"/>
            <q-file
              v-model="file"
              class="full-width"
              outlined
              label="LOAD"
              accept=".json"
              @update:model-value="onJsonFileUploaded"
            ><template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            </q-file>
          </div>
        </div>

      </div>
      <div class="col-3 behavior__panel" :key="panelkey">
        <color @update="updateBehavior" :data="getBehaviourData(EBehaviours.COLOR)"/>
        <color-static @update="updateBehavior" :data="getBehaviourData(EBehaviours.COLOR_STATIC)"/>
        <alpha @update="updateBehavior" :data="getBehaviourData(EBehaviours.ALPHA)"/>
        <alpha-static @update="updateBehavior" :data="getBehaviourData(EBehaviours.ALPHA_STATIC)"/>
        <scale @update="updateBehavior" :data="getBehaviourData(EBehaviours.SCALE)"/>
        <scale-static @update="updateBehavior" :data="getBehaviourData(EBehaviours.SCALE_STATIC)"/>
        <rotation @update="updateBehavior" :data="getBehaviourData(EBehaviours.ROTATION)"/>
        <rotation-static @update="updateBehavior" :data="getBehaviourData(EBehaviours.ROTATION_STATIC)"/>
        <rotation-no @update="updateBehavior" :data="getBehaviourData(EBehaviours.ROTATION_NO)"/>
        <move-speed @update="updateBehavior" :data="getBehaviourData(EBehaviours.MOVE_SPEED)"/>
        <move-speed-static @update="updateBehavior" :data="getBehaviourData(EBehaviours.MOVE_SPEED_STATIC)"/>
        <move-acceleration @update="updateBehavior" :data="getBehaviourData(EBehaviours.MOVE_ACCELERATION)"/>
        <move-path @update="updateBehavior" :data="getBehaviourData(EBehaviours.MOVE_PATH)"/>
        <blend-mode @update="updateBehavior" :data="getBehaviourData(EBehaviours.BLEND_MODE)"/>
        <spawn-burst @update="updateBehavior" :data="getBehaviourData(EBehaviours.SPAWN_BURST)"/>
        <spawn-shape @update="updateBehavior" :data="getBehaviourData(EBehaviours.SPAWN_SHAPE)"/>
        <texture-single :textures="images" @update="updateBehavior" :data="getBehaviourData(EBehaviours.TEXTURE_SINGLE)"/>
        <texture-random :textures="images" @update="updateBehavior" :data="getBehaviourData(EBehaviours.TEXTURE_RANDOM)"/>
        <texture-ordered :textures="images" @update="updateBehavior" :data="getBehaviourData(EBehaviours.TEXTURE_ORDERED)"/>
        <animated-single :textures="images" @update="updateBehavior" :data="getBehaviourData(EBehaviours.ANIMATED_SINGLE)"/>
        <animated-random :textures="images" @update="updateBehavior" :data="getBehaviourData(EBehaviours.ANIMATED_RANDOM)"/>
      </div>
  </div>

</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as PIXI from 'pixi.js';
import { Emitter } from '@pixi/particle-emitter';
import Color from 'components/particleBehaviour/color.vue';
import { IBehaviorUpdate, IImageFile } from 'src/interfaces/imageFile';
import ColorStatic from 'components/particleBehaviour/colorStatic.vue';
import Alpha from 'components/particleBehaviour/alpha.vue';
import AlphaStatic from 'components/particleBehaviour/alphaStatic.vue';
import Scale from 'components/particleBehaviour/scale.vue';
import ScaleStatic from 'components/particleBehaviour/scaleStatic.vue';
import Rotation from 'components/particleBehaviour/rotation.vue';
import RotationStatic from 'components/particleBehaviour/rotationStatic.vue';
import RotationNo from 'components/particleBehaviour/rotationNo.vue';
import MoveSpeed from 'components/particleBehaviour/moveSpeed.vue';
import MoveSpeedStatic from 'components/particleBehaviour/moveSpeedStatic.vue';
import MoveAcceleration from 'components/particleBehaviour/moveAcceleration.vue';
import MovePath from 'components/particleBehaviour/movePath.vue';
import BlendMode from 'components/particleBehaviour/blendMode.vue';
import SpawnBurst from 'components/particleBehaviour/spawnBurst.vue';
import SpawnShape from 'components/particleBehaviour/spawnShape.vue';
import ImagesUploader from 'components/imagesUploader.vue';
import TextureSingle from 'components/particleBehaviour/textureSingle.vue';
import TextureRandom from 'components/particleBehaviour/textureRandom.vue';
import TextureOrdered from 'components/particleBehaviour/textureOrdered.vue';
import AnimatedSingle from 'components/particleBehaviour/animatedSingle.vue';
import AnimatedRandom from 'components/particleBehaviour/animatedRandom.vue';
import { EBehaviours, getTextureFromImage } from 'src/utils/particlesUtils';
import { find, forEach, map } from 'lodash';

const pixiContainer = ref<HTMLDivElement | null>(null);
let app: PIXI.Application | null = null;
let particleEmitter: Emitter | null = null;
let images: Array<IImageFile> = ref([])
let defImage = 'src/assets/particle.png'
let particleCount = ref(0)
let panelkey = ref(0);

let particleBehaviors: Array<any> = [
  {
    type: 'alpha',
    config: {
      alpha: {
        list: [
          {
            value: 0.8,
            time: 0,
          },
          {
            value: 0.1,
            time: 1,
          },
        ],
      },
    },
  },
  {
    type: 'scale',
    config: {
      scale: {
        list: [
          {
            value: 1,
            time: 0,
          },
          {
            value: 0.3,
            time: 1,
          },
        ],
      },
    },
  },
  {
    type: 'color',
    config: {
      color: {
        list: [
          {
            value: '#fb1010',
            time: 0,
          },
          {
            value: '#f5b830',
            time: 1,
          },
        ],
      },
    },
  },
  {
    type: 'moveSpeed',
    config: {
      speed: {
        list: [
          {
            value: 200,
            time: 0,
          },
          {
            value: 100,
            time: 1,
          },
        ],
        isStepped: false,
      },
    },
  },
  {
    type: 'rotationStatic',
    config: {
      min: 0,
      max: 360,
    },
  },
  {
    type: 'spawnShape',
    config: {
      type: 'circle',
      data: {
        x: 0,
        y: 0,
        radius: 0,
      },
    },
  },
  {
    type: 'textureSingle',
    config: {
      texture: getTextureFromImage({url: defImage, name: defImage}),
    },
  },
];

const lifetimeMin: number = ref(0.5);
const lifetimeMax: number = ref(0.8);

const frequency: number = ref(0.001);
const spawnChance: number = ref(1);
const particlesPerWave: number = ref(50);
const emitterLifetime: number = ref(-1);
const maxParticles: number = ref(1000);
const addAtBack: boolean = ref(true);
const posX: number = ref(0);
const posY: number = ref(0);

const file = ref()

const onResize = () => {
  if (app && pixiContainer.value) {
    app.renderer.resize(pixiContainer.value.offsetWidth, pixiContainer.value.offsetHeight);
    particleEmitter.updateOwnerPos(app.screen.width / 2, app.screen.height / 2);
  }
};

function getConfig() {
  const particleConfig = {
    lifetime: {
      min: lifetimeMin.value,
      max: lifetimeMax.value,
    },
    frequency: frequency.value,
    spawnChance: spawnChance.value,
    particlesPerWave: particlesPerWave.value,
    emitterLifetime: emitterLifetime.value,
    maxParticles: maxParticles.value,
    pos: {
      x: posX.value,
      y: posY.value,
    },
    addAtBack: addAtBack.value,
    behaviors: particleBehaviors,
  };
  return particleConfig;
}

function updateBehavior(data: IBehaviorUpdate) {
  const behaviourIndex = particleBehaviors.findIndex(behavior => behavior.type === data.behavior.type);
  if (data.active) {
    if (behaviourIndex >= 0) {
      particleBehaviors[behaviourIndex] = data.behavior;
    } else {
      particleBehaviors.push(data.behavior);
    }
  } else {
    if (behaviourIndex >= 0) {
      particleBehaviors.splice(behaviourIndex, 1);
    }
  }
  const particleConfig = getConfig();
  particleEmitter?.destroy();
  try {
    particleEmitter = new Emitter(app.stage, particleConfig);
    particleEmitter.updateOwnerPos(app.screen.width / 2, app.screen.height / 2);
  }catch (e) {
    console.error(e);
  }
}

function handleUpdate(data) {
  images.value = data;
}

function downloadJson(){
  const data = JSON.stringify(getConfig())
  const blob = new Blob([data], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = 'particles.json';
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function onJsonFileUploaded(file){
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const json = JSON.parse(event.target.result);
      lifetimeMin.value = json.lifetime.min;
      lifetimeMax.value = json.lifetime.max;

      frequency.value = json.frequency;
      spawnChance.value = json.spawnChance;
      particlesPerWave.value = json.particlesPerWave;
      emitterLifetime.value = json.emitterLifetime;
      maxParticles.value = json.maxParticles;
      addAtBack.value = json.addAtBack;
      posX.value = json.pos.x;
      posY.value = json.pos.y;
      parseBehaviors(json.behaviors);
      try {
        const particleConfig = getConfig();
        particleEmitter?.destroy();
        particleEmitter = new Emitter(app.stage, particleConfig);
        particleEmitter.updateOwnerPos(app.screen.width / 2, app.screen.height / 2);
      }catch (e) {
        console.error(e);
      }
    } catch (error) {
      console.error(error);
    }
  };

  reader.readAsText(file);
}

function getTextureFromImagesFiles(name){
  if(name === defImage){
    return getTextureFromImage({url: defImage, name: defImage})
  }
  const image = find(images.value, i=> i.name === name);
  if(image){
    return getTextureFromImage(image)
  }else{
    console.error(`cannot find texture for ${name}`)
  }
}

function parseBehaviors(behaviors){
  particleBehaviors = []
  forEach(behaviors, behavior=>{
    switch (behavior.type){
      case EBehaviours.TEXTURE_SINGLE:
        behavior.config.texture = getTextureFromImagesFiles(behavior.config.texture)
        break;
      case EBehaviours.TEXTURE_ORDERED:
      case EBehaviours.TEXTURE_RANDOM:
        behavior.config.textures = map(behavior.config.textures, texture=>getTextureFromImagesFiles(texture))
        break;
      case EBehaviours.ANIMATED_SINGLE:
        behavior.config.anim.textures = map(behavior.config.anim.textures, texture=>getTextureFromImagesFiles(texture))
        break;
      case EBehaviours.ANIMATED_RANDOM:
        forEach(behavior.config.anims, anim=>{
          anim.textures = map(anim.textures, texture=>getTextureFromImagesFiles(texture))
        })
        break;
    }
    particleBehaviors.push(behavior)
  })
  panelkey.value+=1;
}

function getBehaviourData(name: EBehaviours){
  const data = find(particleBehaviors, beh=>beh.type === name)
  return data
}

onMounted(() => {
  if (pixiContainer.value) {
    app = new PIXI.Application({
      width: pixiContainer.value.offsetWidth,
      height: 500,
      backgroundColor: 0xffffff,
    });
    globalThis.__PIXI_APP__ = app;
    pixiContainer.value.appendChild(app.view);

    let elapsed = Date.now();
    const particleConfig = getConfig();
    particleEmitter = new Emitter(app.stage, particleConfig);

    if (app) {
      particleEmitter.updateOwnerPos(app.screen.width / 2, app.screen.height / 2);
    }

    // Start the particle emitter
    particleEmitter.emit = true;

    // Update particles
    const update = () => {
      let now = Date.now();
      try{
        particleEmitter.update((now - elapsed) * 0.001);
      }catch (e) {
        console.error(e);
      }
      particleCount.value = particleEmitter.particleCount
      elapsed = now;
    };

    app.ticker.add(update);
    // Add resize event listener
    window.addEventListener('resize', onResize);
    update();
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
  height: 500px;
  position: relative;
}
.behavior__panel{
  height: calc(100vh - 50px);
  max-height: 100vh;
  overflow-y: scroll;
}
.particles-counter{
  position: absolute;
  top: 0;
  left: 0
}
.file-buttons{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
<style>
.expand__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
</style>

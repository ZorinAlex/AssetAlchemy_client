<script setup lang="ts">
import { ref } from 'vue';
import { EBehaviours, getBehaviour, getTextureFromImage } from 'src/utils/particlesUtils';
import { Texture } from 'pixi.js';

const emit = defineEmits(['update']);

const props = defineProps({
  textures: { type: Array },
  data: { type: Object, required: false }
});

const images = ref([]);
const framerate = ref(25);
const loop  =ref(true);

const active = ref(!!props.data)

function update() {
  const imagesWithUrl = images.value.filter(val => val.url);
  if(imagesWithUrl.length === 0) return
  const behavior = getBehaviour(EBehaviours.ANIMATED_SINGLE, {
    anim:{
      textures: imagesWithUrl.map(im =>getTextureFromImage(im)),
      loop: loop.value,
      framerate: framerate.value
    }
  });
  emit('update', { behavior, active: active.value });
}

function updateSelection(index, data) {
  images.value[index] = data;
  update();
}

function add() {
  images.value.push('');
}

function remove(index) {
  images.value.splice(index, 1);
  update();
}
</script>

<template>
  <div>
    <q-expansion-item
      expand-separator
      dense
      header-class="q-px-sm"
    >
      <template v-slot:header>
        <div class="expand__header">
          <div class="text-bold">ANIMATED SINGLE</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
        <q-toggle
          v-model="loop"
          label="loop"
          @update:model-value="update()"
          class="q-mr-lg"
        />
        <q-input
          v-model.number="framerate"
          type="number"
          label="framerate"
          square
          dense
          @change="update"
        ></q-input>
        <q-select
          v-for="(texture, index) in images"
          square
          dense
          :options="props.textures"
          option-value="url"
          option-label="name"
          :model-value="texture.name"
          @update:modelValue="(i)=>{updateSelection(index, i)}"
          label="texture">
          <template v-slot:after>
            <q-btn dense flat filled icon="delete" :disable="index === 0" @click="remove(index)" />
          </template>
        </q-select>
        <div class="q-my-sm flex">
          <q-btn color="primary" label="add texture" size="sm"  style="margin: auto" @click="add" />
        </div>
      </q-card>
    </q-expansion-item>

  </div>

</template>

<style scoped>

</style>

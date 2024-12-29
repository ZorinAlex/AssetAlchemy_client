<script setup lang="ts">
import { ref, watch } from 'vue';
import { EBehaviours, getBehaviour, getTextureFromImage } from 'src/utils/particlesUtils';
import { forEach } from 'lodash';

const emit = defineEmits(['update']);
const props = defineProps({
  data: { type: Object, required: false },
  textures: { type: Array },
})

const active = ref(!!props.data)
const images = ref([]);

watch(() => props.data, (newData)=>{
  images.value = []
  forEach(newData.config.textures, texture=>{
    images.value.push({name: texture.filename, url: texture.url})
  })
}, {deep: true})

function update() {
  const imagesWithUrl = images.value.filter(val => val.url);
  if(imagesWithUrl.length === 0) return
  const behavior = getBehaviour(EBehaviours.TEXTURE_ORDERED, {
    textures: imagesWithUrl.map(texture => getTextureFromImage(texture)),
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
          <div class="text-bold">TEXTURE ORDERED</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
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
          <q-btn color="primary" label="add texture" size="sm" style="margin: auto" @click="add" />
        </div>
      </q-card>
    </q-expansion-item>

  </div>

</template>

<style scoped>

</style>

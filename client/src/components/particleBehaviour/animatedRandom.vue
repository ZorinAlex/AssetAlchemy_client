<script setup lang="ts">
import { ref, toRaw, watch } from 'vue';
import { EBehaviours, getBehaviour, getTextureFromImage } from 'src/utils/particlesUtils';
import { forEach, map } from 'lodash';

const emit = defineEmits(['update']);
const props = defineProps({
  textures: { type: Array },
  data: { type: Object, required: false }
});

const anims = ref([{
  images: [],
  framerate: 25,
  loop: true
}]);

const active = ref(!!props.data);

watch(() => props.data, (newData)=>{
  anims.value = []
  forEach(newData.config.anims, anim=>{
    anims.value.push({
      images: map(anim.textures, texture => {return {name: texture.filename, url: texture.url}}),
      framerate: anim.framerate,
      loop: anim.loop
    })
  })
}, {deep: true})

function update(check: boolean = false) {
  const animations = [];
  forEach(toRaw(anims.value), anim=>{
    const images = anim.images.filter(im=>im.url);
    if(images.length>0){
      const textures = images.map(im=> getTextureFromImage(im));
      animations.push({
        framerate: anim.framerate,
        loop: anim.loop,
        textures: textures
      })
    }
  })

  if(animations.length === 0 && check) return

  const behavior = getBehaviour(EBehaviours.ANIMATED_RANDOM, {
    anims: animations
  });
  emit('update', { behavior, active: active.value });
}

function addAnim(){
  anims.value.push(
    {
      images: [],
      framerate: 25,
      loop: true
    }
  )
}

function updateAnim(type: EUpdateDataType, data: any, index: number, imageIndex?: number){
  const anim = anims.value[index];
  switch (type){
    case EUpdateDataType.FRAMERATE:
      anim.framerate = data;
      break
    case EUpdateDataType.LOOP:
      anim.loop = data;
      break
    case EUpdateDataType.IMAGE_ADD:
      anim.images.push('');
      break
    case EUpdateDataType.IMAGE_UPD:
      anim.images[imageIndex] = data;
      break
    case EUpdateDataType.IMAGE_REM:
      anim.images.splice(imageIndex, 1);
  }
  update(true)
}

function deleteAnim(index){
  anims.value.splice(index, 1)
}

enum EUpdateDataType{
  FRAMERATE = 'framerate',
  LOOP = 'loop',
  IMAGE_ADD = 'image_add',
  IMAGE_UPD = 'image_update',
  IMAGE_REM = 'image_remove'
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
          <div class="text-bold">ANIMATED RANDOM</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
        <div v-for="(anim, index) in anims" :key="index" class="border-bottom_list__item">
          <div class="row">
            <q-input
              class="col-5"
              :model-value.number="anim.framerate"
              type="number"
              label="framerate"
              square
              dense
              @change="d=>updateAnim(EUpdateDataType.FRAMERATE, d, index, )"
            />
            <q-toggle
              :model-value="anim.loop"
              label="loop"
              @update:model-value="d=>updateAnim(EUpdateDataType.LOOP, d, index)"
              class="col-5"
            />
            <div class="col-2 flex">
              <q-btn
                icon="delete"
                dense
                text-color="grey-9"
                flat
                class="q-ml-sm"
                :disable = "anims.length === 1"
                @click="deleteAnim(index)"
              />
            </div>

          </div>

          <q-select
            v-for="(texture, imageIndex) in anim.images"
            square
            dense
            :options="props.textures"
            option-value="url"
            option-label="name"
            :model-value="texture.name"
            @update:modelValue="d=>updateAnim(EUpdateDataType.IMAGE_UPD, d, index, imageIndex)"
            label="texture">
            <template v-slot:after>
              <q-btn dense flat filled icon="delete" @click="updateAnim(EUpdateDataType.IMAGE_REM, null, index, imageIndex)" />
            </template>
          </q-select>
          <div class="q-my-sm flex">
            <q-btn size="sm" color="primary" label="add texture" style="margin: auto" @click="updateAnim(EUpdateDataType.IMAGE_ADD, d, index, imageIndex)" />
          </div>
        </div>

        <div class="q-my-sm flex">
          <q-btn size="sm" color="primary" label="add animation" style="margin: auto" @click="addAnim" />
        </div>
      </q-card>
    </q-expansion-item>

  </div>

</template>

<style lang="scss" scoped>

</style>

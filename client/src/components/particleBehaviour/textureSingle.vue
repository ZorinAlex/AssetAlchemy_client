<script setup lang="ts">
import { ref } from 'vue';
import { EBehaviours, getBehaviour, getTextureFromImage } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const texture = ref();
const active = ref(true)

const props = defineProps({
  textures: { type: Array},
})

function update(){
  if(!texture?.value?.url) return
  const behavior = getBehaviour(EBehaviours.TEXTURE_SINGLE, {
    texture: getTextureFromImage(texture.value),
  })
  emit('update', {behavior, active: active.value})
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
          <div class="text-bold">TEXTURE SINGLE</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
              <q-select
                square
                dense
                v-model="texture"
                :options="props.textures"
                option-value="url"
                option-label="name"
                @update:modelValue="update"
                label="texture" />
      </q-card>
    </q-expansion-item>

  </div>

</template>

<style scoped>

</style>

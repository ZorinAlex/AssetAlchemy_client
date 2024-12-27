<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { allBlendModes, EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const blendMode = ref('multiply');
const active = ref(true)

function update(){
  const behavior = getBehaviour(EBehaviours.BLEND_MODE, {
    blendMode: blendMode.value,
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
          <div class="text-bold">BLEND MODE</div>
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
                v-model="blendMode"
                :options="allBlendModes"
                @update:modelValue="update"
                label="mode" />
      </q-card>
    </q-expansion-item>

  </div>

</template>

<style scoped>

</style>

<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const value = ref(0);
const active = ref(true)

function update(){
  const behavior = getBehaviour(EBehaviours.ROTATION_NO, {
    rotation: value.value,
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
          <div class="text-bold">NO ROTATION</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
            <div >
              <q-input
                v-model.number="value"
                type="number"
                label="rotation"
                square
                dense
                @change="update"
              ></q-input>
            </div>
      </q-card>
    </q-expansion-item>

  </div>

</template>

<style scoped>

</style>

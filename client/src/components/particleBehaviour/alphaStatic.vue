<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const alpha = ref(1);
const active = ref(true)

function update(){
  const behavior = getBehaviour(EBehaviours.ALPHA_STATIC, {
    alpha: toRaw(alpha.value)
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
          <div class="text-bold">ALPHA STATIC</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
            <div class="flex column" >
              <q-input
                v-model.number="alpha"
                type="number"
                label="alpha"
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

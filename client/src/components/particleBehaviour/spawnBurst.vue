<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const spacing = ref(90);
const start = ref(0);
const distance = ref(40);


const active = ref(true)

function update(){
  const behavior = getBehaviour(EBehaviours.SPAWN_BURST, {
    spacing: spacing.value,
    start: start.value,
    distance: distance.value,
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
          <div class="text-bold">SPAWN BURST</div>
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
                  v-model.number="spacing"
                  type="number"
                  label="spacing"
                  square
                  dense
                  @change="update"
                ></q-input>
                <q-input
                  v-model.number="start"
                  type="number"
                  label="start"
                  square
                  dense
                  @change="update"
                ></q-input>

                <q-input
                  v-model.number="distance"
                  type="number"
                  label="distance"
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

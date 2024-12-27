<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const accelX = ref(0);
const accelY = ref(2000);
const minStart = ref(30);
const maxStart  = ref(600);
const rotate  = ref(true);

const active = ref(true)

function update(){
  const behavior = getBehaviour(EBehaviours.MOVE_ACCELERATION, {
    accel: {x: accelX.value, y: accelY.value},
    minStart: minStart.value,
    maxStart: maxStart.value,
    rotate: rotate.value,
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
          <div class="text-bold">MOVE ACCELERATION</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
            <div >
              <div class="col q-mr-md">
                <q-input
                  v-model.number="accelX"
                  type="number"
                  label="acceleration x"
                  square
                  dense
                  @change="update"
                ></q-input>
                <q-input
                  v-model.number="accelY"
                  type="number"
                  label="acceleration y"
                  square
                  dense
                  @change="update"
                ></q-input>
              </div>
              <div class="col q-mr-md">
                <q-input
                  v-model.number="minStart"
                  type="number"
                  label="min start"
                  square
                  dense
                  @change="update"
                ></q-input>
                <q-input
                  v-model.number="maxStart"
                  type="number"
                  label="max start"
                  square
                  dense
                  @change="update"
                ></q-input>
              </div>
              <q-toggle
                v-model="rotate"
                label="rotate"
                @update:model-value="update()"
              />

            </div>
      </q-card>
    </q-expansion-item>

  </div>

</template>

<style scoped>

</style>

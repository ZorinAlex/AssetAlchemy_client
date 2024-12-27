<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const valueMinStart = ref(0);
const valueMaxStart = ref(180);
const valueMinSpeed = ref(30);
const valueMaxSpeed  = ref(45);
const accel  = ref(20);


const active = ref(true)

function update(){
  const behavior = getBehaviour(EBehaviours.ROTATION, {
    minStart: valueMinStart.value,
    maxStart: valueMaxStart.value,
    minSpeed: valueMinSpeed.value,
    maxSpeed: valueMaxSpeed.value,
    accel: accel.value
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
          <div class="text-bold">ROTATION</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
            <div class=" " >
              <div class="col q-mr-md">
                <q-input
                  v-model.number="valueMinStart"
                  type="number"
                  label="min start"
                  square
                  dense
                  @change="update"
                ></q-input>
                <q-input
                  v-model.number="valueMaxStart"
                  type="number"
                  label="max start"
                  square
                  dense
                  @change="update"
                ></q-input>
              </div>
              <div class="col q-mr-md">
                <q-input
                  v-model.number="valueMinSpeed"
                  type="number"
                  label="min speed"
                  square
                  dense
                  @change="update"
                ></q-input>
                <q-input
                  v-model.number="valueMaxSpeed"
                  type="number"
                  label="max speed"
                  square
                  dense
                  @change="update"
                ></q-input>
              </div>

              <q-input
                v-model.number="accel"
                type="number"
                label="acceleration"
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

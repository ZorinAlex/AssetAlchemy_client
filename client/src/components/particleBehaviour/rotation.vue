<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const props = defineProps({
  data: { type: Object, required: false }
})

const active = ref(!!props.data)
const valueMinStart = ref(props.data?.config?.minStart || 0);
const valueMaxStart = ref(props.data?.config?.maxStart || 180);
const valueMinSpeed = ref(props.data?.config?.minSpeed || 30);
const valueMaxSpeed  = ref(props.data?.config?.maxSpeed || 45);
const accel  = ref(props.data?.config?.accel || 20);

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

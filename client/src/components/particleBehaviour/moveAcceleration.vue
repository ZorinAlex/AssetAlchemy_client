<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const props = defineProps({
  data: { type: Object, required: false }
})

const active = ref(!!props.data)

const accelX = ref(props.data?.config?.accel?.x || 0);
const accelY = ref(props.data?.config?.accel?.y || 1000);
const minStart = ref(props.data?.config?.minStart || 30);
const maxStart  = ref(props.data?.config?.maxStart || 600);
const rotate  = ref(props.data?.config?.rotate || true);

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

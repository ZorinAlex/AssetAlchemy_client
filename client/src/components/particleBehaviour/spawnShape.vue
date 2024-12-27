<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { allBlendModes, EBehaviours, EShape, getBehaviour } from 'src/utils/particlesUtils';

const emit = defineEmits(['update']);

const x = ref(0);
const y = ref(0);
const width = ref(40);
const height = ref(40);
const radius = ref(20);
const minR = ref(10)
const affectRotation = ref(true)
const shapes = Object.values(EShape);
const shape = ref(EShape.CIRCLE);

const active = ref(true);

function update() {
  let config = {
    data: null,
    type: shape.value
  }
  switch (shape.value){
    case EShape.CIRCLE:
      config.data = {x: x.value, y: y.value, radius: radius.value}
      break
    case EShape.RECT:
      config.data = {x: x.value, y: y.value, w: width.value, h: height.value}
      break
    case EShape.TORUS:
      config.data = {x: x.value, y: y.value, radius: radius.value, innerRadius: minR.value, affectRotation: affectRotation.value}
      break
  }
  const behavior = getBehaviour(EBehaviours.SPAWN_SHAPE, config);
  emit('update', { behavior, active: active.value });
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
          <div class="text-bold">SPAWN SHAPE</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
        <div class="column">
          <q-select
            square
            dense
            v-model="shape"
            :options="shapes"
            @update:modelValue="update"
            label="shape" />
          <div>
            <div v-if="shape === EShape.RECT">
              <q-input
                v-model.number="x"
                type="number"
                label="x"
                square
                dense
                @change="update"
              ></q-input>
              <q-input
                v-model.number="y"
                type="number"
                label="y"
                square
                dense
                @change="update"
              ></q-input>
              <q-input
                v-model.number="width"
                type="number"
                label="width"
                square
                dense
                @change="update"
              ></q-input>
              <q-input
                v-model.number="height"
                type="number"
                label="height"
                square
                dense
                @change="update"
              ></q-input>
            </div>
            <div v-if="shape === EShape.CIRCLE">
              <q-input
                v-model.number="x"
                type="number"
                label="x"
                square
                dense
                @change="update"
              ></q-input>
              <q-input
                v-model.number="y"
                type="number"
                label="y"
                square
                dense
                @change="update"
              ></q-input>
              <q-input
                v-model.number="radius"
                type="number"
                label="radius"
                square
                dense
                @change="update"
              ></q-input>
            </div>
            <div v-if="shape === EShape.TORUS">
              <q-input
                v-model.number="x"
                type="number"
                label="x"
                square
                dense
                @change="update"
              ></q-input>
              <q-input
                v-model.number="y"
                type="number"
                label="y"
                square
                dense
                @change="update"
              ></q-input>
              <q-input
                v-model.number="radius"
                type="number"
                label="radius"
                square
                dense
                @change="update"
              ></q-input>
              <q-input
                v-model.number="minR"
                type="number"
                label="min radius"
                square
                dense
                @change="update"
              ></q-input>
              <q-toggle
                v-model="affectRotation"
                label="affect rotation"
                @update:model-value="update()"
              />
            </div>
          </div>
        </div>

      </q-card>
    </q-expansion-item>

  </div>

</template>

<style scoped>

</style>

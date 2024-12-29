<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const props = defineProps({
  data: { type: Object, required: false }
})

const active = ref(!!props.data)
const valueMin = ref(props.data?.config?.min || 0);
const valueMax = ref(props.data?.config?.max || 180);

function update(){
  const behavior = getBehaviour(EBehaviours.ROTATION_STATIC, {
    min: valueMin.value,
    max: valueMax.value
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
          <div class="text-bold">ROTATION STATIC</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
            <div class="" >
              <q-input
                v-model.number="valueMin"
                type="number"
                label="min rotation"
                square
                dense
                @change="update"
              ></q-input>
              <q-input
                v-model.number="valueMax"
                type="number"
                label="max rotation"
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

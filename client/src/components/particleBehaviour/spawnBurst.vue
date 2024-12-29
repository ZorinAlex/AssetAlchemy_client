<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const props = defineProps({
  data: { type: Object, required: false }
})

const active = ref(!!props.data)
const spacing = ref(props.data?.config?.spacing || 90);
const start = ref(props.data?.config?.start || 0);
const distance = ref(props.data?.config?.distance || 40);


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

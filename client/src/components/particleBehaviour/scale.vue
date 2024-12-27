<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const list = ref([
  { value: 1, time: 0 },
  { value: 0.5, time: 1 },
]);

const minMult = ref(0.5)
const isStepped = ref(true)

const active = ref(true)

function checkLastTime(){
  const last = list.value.at(-1)
  if(last.time<1){
    last.time = 1
  }
}

function remove(index: number){
  list.value.splice(index, 1);
  update()
}

function add(){
  const last = list.value.at(-1)
  list.value.push({value: last.value, time: last.time + 0.5})
  update()
}

function update(){
  checkLastTime()
  const behavior = getBehaviour(EBehaviours.SCALE, {
    scale: {
      list: toRaw(list.value),
      isStepped: isStepped.value
    },
    minMult: minMult.value
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
          <div class="text-bold">SCALE</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
        <div class="q-mb-sm row">
          <q-input
            v-model.number="minMult"
            type="number"
            label="min multiplier"
            square
            dense
            @change="update"
            class="col-6"
          />
          <q-toggle
            v-model="isStepped"
            label="stepped"
            @update:model-value="update()"
            class="col-6"
          />

        </div>
        <div class="wrap">
          <div v-for="(item, index) in list" :key="index">
            <div class="q-pb-sm">
              <div class="flex column" >
                <q-input
                  v-model.number="item.value"
                  type="number"
                  label="value"
                  square
                  dense
                  @change="update"
                >
                </q-input>
                <q-input
                  v-model.number="item.time"
                  type="number"
                  label="time"
                  square
                  dense
                  @change="update"
                >
                  <template v-slot:after>
                    <q-btn dense flat filled icon="delete" :disable="index === 0 || index === list.length-1" @click="remove(index)"/>
                  </template>
                </q-input>
              </div>
            </div>

          </div>
          <div class="flex">
            <q-btn color="primary" label="add scale" size="sm" style="margin: auto" @click="add"/>
          </div>
        </div>

      </q-card>
    </q-expansion-item>

  </div>

</template>

<style scoped>

</style>

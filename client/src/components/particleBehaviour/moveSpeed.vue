<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const list = ref([
  { value: 10, time: 0 },
  { value: 100, time: 1 },
]);

const minMult = ref(0.5)

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
  const behavior = getBehaviour(EBehaviours.MOVE_SPEED, {
    speed: {
      list: toRaw(list.value)
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
          <div class="text-bold">MOVE SPEED</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
        <div class="q-mb-sm">
          <q-input
            v-model.number="minMult"
            type="number"
            label="min multiplier"
            square
            dense
            @change="update"
          ></q-input>
        </div>
        <div class="">
          <div v-for="(item, index) in list" :key="index" class="q-mb-sm">
            <div>
              <div>
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
          <div class="flex q-mb-sm">
            <q-btn color="primary" label="add speed" size="sm" style="margin: auto" @click="add"/>
          </div>
        </div>

      </q-card>
    </q-expansion-item>

  </div>

</template>

<style scoped>
.list-item{
  width: 130px;
  margin: 0 15px 15px 0 ;
  display: flex;
}
</style>

<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const list = ref([
  { value: 1, time: 0 },
  { value: 0, time: 1 },
]);

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
  const behavior = getBehaviour(EBehaviours.ALPHA, {
    alpha: {
      list: toRaw(list.value)
    }
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
          <div class="text-bold">ALPHA</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
        <div v-for="(item, index) in list" :key="index">
            <div class="q-mb-sm" >
              <q-input
                v-model.number="item.value"
                type="number"
                label="alpha"
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
        <div class="flex q-my-sm">
          <q-btn color="primary" label="add alpha" size="sm" style="margin: auto" @click="add"/>
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

<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const list = ref([
  { value: '#ff0000', time: 0 },
  { value: '#ffc400', time: 1 },
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
  const behavior = getBehaviour(EBehaviours.COLOR, {
    color: {
      list: toRaw(list.value)
    }
  })
  emit('update', {behavior, active: active.value})
}
</script>

<template>
  <div class="q-pa-none">
    <q-expansion-item
      expand-separator
      dense
      header-class="q-px-sm"
    >
      <template v-slot:header>
        <div class="expand__header">
          <div class="text-bold">COLOR</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
        <div v-for="(item, index) in list" :key="index">
          <div class="color_item">
            <div :style="{ backgroundColor: item.value }" class="color-box"></div>
            <div>
              <q-input
                v-model="item.value"
                square
                dense
              >
                <template v-slot:append >
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color v-model="item.value" @change="update"/>
                    </q-popup-proxy>
                  </q-icon>
                </template>
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
          <q-btn color="primary" size="sm" label="add color" style="margin: auto" @click="add"/>
        </div>
      </q-card>
    </q-expansion-item>

  </div>

</template>

<style scoped>
.color_item{
  position: relative;
  padding-left: 5px;
  margin-bottom: 10px
}
.color-box{
  width: 4px;
  height: 80px;
  margin-right: 4px;
  position: absolute;
  top: 0;
  left: -2px;
}
</style>

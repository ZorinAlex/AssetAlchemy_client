<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const def = [
  { value: 10, time: 0 },
  { value: 100, time: 5 },
];

const props = defineProps({
  data: { type: Object, required: false }
})

const active = ref(!!props.data)
const minMult = ref(props.data?.config?.minMult || 1)
const path = ref(props.data?.config?.path || "round(sin(x) * 2)")
const list = ref(props.data?.config?.speed?.list || def)

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
  const behavior = getBehaviour(EBehaviours.MOVE_PATH, {
    speed: {
      list: toRaw(list.value)
    },
    minMult: minMult.value,
    path: path.value
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
          <div class="text-bold">MOVE PATH</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm ">
        <div class="row q-mb-sm">
          <q-input
            class="q-mr-md"
            v-model.number="minMult"
            type="number"
            label="min multiplier"
            square
            dense
            @change="update"
          ></q-input>
          <q-input
            v-model="path"
            type="text"
            label="path"
            square
            dense
            @change="update"
          ></q-input>
        </div>
        <div>
          <div v-for="(item, index) in list" :key="index" class="q-mb-sm">
            <div class="">
              <div class="" >
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
            <q-btn color="primary" size="sm" label="add move" style="margin: auto" @click="add"/>
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

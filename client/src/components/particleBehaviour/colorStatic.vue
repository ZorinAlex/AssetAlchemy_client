<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { EBehaviours, getBehaviour } from 'src/utils/particlesUtils';
const emit = defineEmits(['update'])

const props = defineProps({
  data: { type: Object, required: false }
})

const color = ref(props.data?.config?.color);
const active = ref(!!props.data)

function update(){
  const behavior = getBehaviour(EBehaviours.COLOR_STATIC, {
    color: toRaw(color.value)
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
          <div class="text-bold">COLOR STATIC</div>
          <q-toggle
            v-model="active"
            label="active"
            @update:model-value="update()"
          />
        </div>
      </template>
      <q-card class="q-px-sm">
        <div class="color_item">
          <div :style="{ backgroundColor: color }" class="color-box"></div>
          <div>
            <q-input
              v-model="color"
              square
              dense
            >
              <template v-slot:append >
                <q-icon name="colorize" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-color v-model="color" @change="update"/>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
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
  height: 40px;
  margin-right: 4px;
  position: absolute;
  top: 0;
  left: -2px;
}
</style>

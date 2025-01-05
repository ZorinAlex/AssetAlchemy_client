<script setup lang="ts">
  const props = defineProps({
    file: { type: Object, required: true }
  })
  const emit = defineEmits(['remove'])

  function remove(){
    emit('remove', props.file.name)
  }

  function getImageUrl(file: File): string{
    if(file.type.includes('image')){
      return file.url
    }else if(file.type.includes('json')){
      return 'JSON.png'
    }else if(file.name.includes('spine')){
      return 'SPINE.png'
    }else if(file.name.includes('atlas')){
      return 'ATLAS.png'
    }else{
      return 'FILE.png'
    }
  }
</script>

<template>
  <div class="image-file">
    <q-img
      :src="getImageUrl(file)"
      class="image-file__image"
      fit="contain"
    >
      <div class="image-file__text">
        {{ file.name }}
      </div>
    </q-img>
    <q-btn
      class="image-file__button"
      @click="remove"
      round
      color="black"
      icon="delete"
      size="xs"/>
  </div>
</template>

<style scoped>
  .image-file{
    display: flex;
    width: 90px;
    height: 90px;
    margin: 0 10px 10px 0;
    border-radius: 50%;
    position: relative;
  }

  .image-file__text{
    position: absolute;
    height: 20px;
    width: 100%;
    padding:0 3px;
    overflow: hidden;
    bottom: 0;
  }

  .image-file__image{
    height: 90px;
    max-width: 90px;
    border-radius: 5px
  }
  .image-file__button{
    position: absolute;
    top: 0;
    right: 0;
  }
</style>

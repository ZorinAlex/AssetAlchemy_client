<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated dark>
      <q-toolbar>
        <q-img
          src="../assets/aa_logo.png"
          style="width: 80px"
        />
        <q-toolbar-title class="header__title">
          AssetAlchemy
        </q-toolbar-title>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      width="250"
    >
      <q-list>
        <q-item to="/spritesheet" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="view_quilt" />
          </q-item-section>

          <q-item-section class="menu__item_text">
            Sprite sheet
          </q-item-section>
        </q-item>
        <q-item to="/bitmapfont" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="text_fields" />
          </q-item-section>

          <q-item-section class="menu__item_text">
            Bitmap font
          </q-item-section>
        </q-item>
        <q-item to="/particles" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="blur_on" />
          </q-item-section>

          <q-item-section class="menu__item_text">
            Particle system
          </q-item-section>
        </q-item>
        <q-item to="/spine" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="videocam" />
          </q-item-section>

          <q-item-section class="menu__item_text">
            Spine viewer
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';

defineOptions({
  name: 'MainLayout'
});


const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
.header__title{
  font-family: "Black And White Picture", serif;
  font-weight: 400;
  font-style: normal;
  font-size: 30px;
}
.menu__item_text{
  font-family: "Macondo", serif;
  font-weight: 400;
  font-size: 20px;
  font-style: normal;
}
</style>

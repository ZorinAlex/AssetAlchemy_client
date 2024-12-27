<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated dark>
      <q-toolbar>
        <q-img
          src="../assets/AALogo.png"
          style="width: 25px"
        />
        <q-toolbar-title>
          Asset Alchemy
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
    >
      <q-list>
        <q-item to="/spritesheet" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="view_quilt" />
          </q-item-section>

          <q-item-section>
            Sprite sheet
          </q-item-section>
        </q-item>
        <q-item to="/bitmapfont" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="text_fields" />
          </q-item-section>

          <q-item-section>
            Bitmap font
          </q-item-section>
        </q-item>
        <q-item to="/particles" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="blur_on" />
          </q-item-section>

          <q-item-section>
            Particle system
          </q-item-section>
        </q-item>
        <q-item to="/particles" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="videocam" />
          </q-item-section>

          <q-item-section>
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

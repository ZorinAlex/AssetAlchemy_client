<template>
  <q-layout view="hHh Lpr lff">
    <q-header class="aa-header">
      <q-toolbar style="align-items: stretch; padding-right: 0;">
        <q-img
          src="../assets/aa_logo.png"
          style="width: 80px; cursor: pointer"
          @click="goHome"
        />
        <q-toolbar-title class="header__title cursor-pointer" @click="goHome">
          AssetAlchemy
        </q-toolbar-title>

        <!-- Desktop nav links (md and above) -->
        <div class="gt-sm nav-links">
          <q-btn flat no-caps square to="/spritesheet" label="Sprite sheet" class="nav-btn" :class="{ 'nav-btn--active': route.path === '/spritesheet' }" />
          <q-btn flat no-caps square to="/bitmapfont" label="Bitmap font" class="nav-btn" :class="{ 'nav-btn--active': route.path === '/bitmapfont' }" />
          <q-btn flat no-caps square to="/particles" label="Particle system" class="nav-btn" :class="{ 'nav-btn--active': route.path === '/particles' }" />
          <q-btn flat no-caps square to="/spine" label="Spine viewer" class="nav-btn" :class="{ 'nav-btn--active': route.path === '/spine' }" />
        </div>

        <!-- Mobile burger (sm and below) -->
        <q-btn
          class="lt-md"
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
      v-if="$q.screen.lt.md"
      v-model="leftDrawerOpen"
      width="250"
      dark
      class="aa-drawer"
    >
      <q-list padding>
        <q-item to="/spritesheet" clickable v-ripple class="aa-menu-item" active-class="aa-menu-item--active">
          <q-item-section avatar>
            <q-icon name="view_quilt" />
          </q-item-section>
          <q-item-section class="menu__item_text">
            Sprite sheet
          </q-item-section>
        </q-item>

        <q-item to="/bitmapfont" clickable v-ripple class="aa-menu-item" active-class="aa-menu-item--active">
          <q-item-section avatar>
            <q-icon name="text_fields" />
          </q-item-section>
          <q-item-section class="menu__item_text">
            Bitmap font
          </q-item-section>
        </q-item>

        <q-item to="/particles" clickable v-ripple class="aa-menu-item" active-class="aa-menu-item--active">
          <q-item-section avatar>
            <q-icon name="blur_on" />
          </q-item-section>
          <q-item-section class="menu__item_text">
            Particle system
          </q-item-section>
        </q-item>

        <q-item to="/spine" clickable v-ripple class="aa-menu-item" active-class="aa-menu-item--active">
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
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const route = useRoute();
const router = useRouter();

function goHome() {
  router.push('/');
}

defineOptions({
  name: 'MainLayout'
});

onMounted(() => {
  if (route.path === '/') {
    leftDrawerOpen.value = false;
  }
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
/* ─── HEADER ────────────────────────────────────────────────── */
.aa-header {
  background: linear-gradient(90deg, #0d2535 0%, #0f3049 100%);
  border-bottom: 1px solid rgba(9, 120, 151, 0.4);
}

.header__title {
  font-family: "Black And White Picture", serif;
  font-weight: 400;
  font-style: normal;
  font-size: 30px;
  display: flex;
  align-items: center;
}

/* ─── DESKTOP NAV ───────────────────────────────────────────── */
.nav-links {
  display: flex;
  align-self: stretch;
  align-items: stretch;
  gap: 0;
}

.nav-btn {
  color: rgba(255, 255, 255, 0.7);
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  border-radius: 0 !important;
  padding: 0 16px;
  height: 100%;
  transition: background 0.2s, color 0.2s;
}

.nav-btn:hover {
  color: rgba(255, 255, 255, 0.95);
  background: rgba(9, 120, 151, 0.15) !important;
}

.nav-btn--active {
  color: #fff !important;
  background: rgba(9, 120, 151, 0.2) !important;
  box-shadow: inset 0 -3px 0 #097897 !important;
}

/* ─── DRAWER ────────────────────────────────────────────────── */
.aa-drawer {
  background: linear-gradient(180deg, #0f172a 0%, #0a1929 100%) !important;
  border-right: 1px solid rgba(9, 120, 151, 0.2) !important;
}

.aa-menu-item {
  border-radius: 8px;
  margin: 3px 8px;
  padding-left: 12px;
  color: rgba(255, 255, 255, 0.65);
  transition: background 0.2s, color 0.2s;
  border-left: 3px solid transparent;
}

.aa-menu-item:hover {
  background: rgba(9, 120, 151, 0.12) !important;
  color: rgba(255, 255, 255, 0.9);
}

.aa-menu-item--active {
  background: rgba(9, 120, 151, 0.18) !important;
  color: #fff !important;
  border-left: 3px solid #097897;
}

.menu__item_text {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.02em;
}
</style>

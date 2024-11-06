import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/spritesheet',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Packer.vue') }],
  },
  {
    path: '/bitmapfont',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/BFont.vue') }],
  },
  {
    path: '/particles',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Particles.vue') }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

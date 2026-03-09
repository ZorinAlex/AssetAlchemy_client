<template>
  <div>

    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero__inner">
        <h1 class="hero__title">Welcome to <span class="hero__accent">AssetAlchemy</span></h1>
        <p class="hero__sub">
          Discover the ultimate tool for managing and enhancing your creative assets for 2D game development
          with <span class="hero__em">Pixi.js</span> and <span class="hero__em">Phaser.js</span>.
        </p>
        <div class="hero__note">
          Currently free and in alpha — your feedback, issue reports, and proposals are invaluable for shaping the app's future.
        </div>
      </div>
    </section>

    <!-- ─── FEATURES ─────────────────────────────────────────── -->
    <section id="features" class="page-section">
      <div class="section-wrap">
        <h2 class="section-title">What is <span class="text-[#097897]">AssetAlchemy?</span></h2>
        <p class="section-sub">
          AssetAlchemy is your go-to solution for creating and managing digital assets. With an intuitive interface and
          powerful features, it provides:
        </p>
        <div class="features-grid">
          <router-link v-for="f in features" :key="f.to" :to="f.to" class="feature-card">
            <q-img :src="f.img" :alt="f.title" class="feature-card__img" />
            <div class="feature-card__body">
              <div class="feature-card__line" :style="{ background: f.color }"></div>
              <h3 class="feature-card__title">{{ f.title }}</h3>
              <p class="feature-card__desc">{{ f.desc }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ─── AUDIENCE ─────────────────────────────────────────── -->
    <section class="page-section page-section--muted">
      <div class="section-wrap">
        <h2 class="section-title">Who is This App For?</h2>
        <p class="section-sub">
          Whether you're looking to streamline your asset pipeline or explore new creative tools,
          AssetAlchemy is here to assist you. 🛠️✨
        </p>
        <div class="audience-grid">
          <div v-for="a in audience" :key="a.title" class="audience-card" :style="{ background: a.gradient }">
            <div class="audience-card__icon">{{ a.icon }}</div>
            <h3 class="audience-card__title">{{ a.title }}</h3>
            <p class="audience-card__desc">{{ a.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── HOW TO USE ────────────────────────────────────────── -->
    <section class="page-section page-section--dark">
      <div class="section-wrap">
        <h2 class="section-title section-title--light">
          How to Use the <span class="text-[#4fc3f7]">App</span>
        </h2>
        <q-list class="howto-list" dark>

          <q-expansion-item dark expand-separator label="Spritesheet" header-class="howto-header">
            <q-card dark class="howto-card">
              <q-card-section class="text-grey-4 leading-relaxed">
                <p class="mb-4">Drag and drop images into the app <span class="text-yellow-400">(note: images shouldn't exceed max width/height parameters)</span> or use the "+" button to add files.</p>
                <p class="mb-4">Add a spritesheet name, adjust export parameters if needed, and press the Pack button. Your spritesheet and JSON file will be downloaded as a ZIP file.</p>
                <p class="font-bold text-white mb-2">Parameters:</p>
                <ul class="list-disc pl-6 space-y-1">
                  <li>Spritesheet Name: Name of the exported spritesheet.</li>
                  <li>Format: Image output format.</li>
                  <li>Max Width/Height: Maximum spritesheet image size. If exceeded, multiple spritesheets will be created.</li>
                  <li>Scale: Scale factor for images.</li>
                  <li>Padding: Spacing between images on the spritesheet.</li>
                  <li>Quality: Export quality (%).</li>
                  <li>Border: Atlas edge spacing.</li>
                  <li>Smart Packing: Ensures the smallest possible size.</li>
                  <li>Power of Two (POT): Rounds bin size to the nearest power of 2.</li>
                  <li>Square Bin Size: Ensures bins are square-shaped.</li>
                  <li>Allow Rotation: Allows 90-degree rotation while packing.</li>
                  <li>Tag-based Grouping: Enables group packing based on tags.</li>
                </ul>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item dark expand-separator label="Bitmap Font" header-class="howto-header">
            <q-card dark class="howto-card">
              <q-card-section class="text-grey-4 leading-relaxed">
                <p class="mb-4">Drag and drop images into the app <span class="text-yellow-400">(note: images shouldn't exceed max width/height parameters)</span> or use the "+" button to add files.</p>
                <p class="mb-4">Map each image to a char value in the "IMAGES TO CHAR MAP" section.</p>
                <p class="mb-4">Add a font name, adjust export parameters if needed, and press the Pack button. Your font spritesheet and XML file will be downloaded as a ZIP file.</p>
                <p class="font-bold text-white mb-2">Parameters:</p>
                <ul class="list-disc pl-6 space-y-1">
                  <li>Font Name: Name of the font.</li>
                  <li>Format: Image output format.</li>
                  <li>Max Width/Height: Maximum spritesheet image size. If exceeded, multiple spritesheets will be created.</li>
                  <li>Size: Font size.</li>
                  <li>Line height: Font line height.</li>
                  <li>Scale: Scale factor for images.</li>
                  <li>Quality: Export quality (%).</li>
                </ul>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item dark expand-separator label="Particles" header-class="howto-header">
            <q-card dark class="howto-card">
              <q-card-section class="text-grey-4 leading-relaxed">
                <p class="mb-4">Drag and drop images or use the "+" button to add files. You can then use these images as textures for particles or particle animations.</p>
                <p class="mb-4">This constructor was created for the Pixi particles module
                  <a class="text-yellow-400 underline" href="https://github.com/pixijs-userland/particle-emitter#readme" target="_blank">Github</a>
                  — it uses all possible options. For the meaning of each option, read the module
                  <a class="text-yellow-400 underline" href="https://particle-emitter.pixijs.io/docs/" target="_blank">documentation</a>.
                </p>
                <p class="mb-4">For Pixi v8 use <a class="text-yellow-400 underline" href="https://github.com/andriibarvynko/particle-emitter" target="_blank">this fork</a>.</p>
                <p class="font-bold text-white mb-1">Save</p>
                <p class="mb-4">Download the JSON config by pressing "GET JSON" to use in your Pixi app.</p>
                <p class="font-bold text-white mb-1">Open</p>
                <p>Upload a previously saved JSON using "LOAD". <span class="text-yellow-400">Note: images used as textures must be added to "IMAGES FOR PARTICLES" before loading.</span></p>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item dark expand-separator label="Spine Viewer" header-class="howto-header">
            <q-card dark class="howto-card">
              <q-card-section class="text-grey-4 leading-relaxed">
                <p class="mb-4">Drag and drop files or use the "+" button. Provide the ATLAS, JSON, and spritesheet image files from your Spine export.</p>
                <p class="mb-4">Press "LOAD BUTTON" to load the data. If the files are valid, the detected Spine version will appear above.</p>
                <p class="font-bold text-yellow-400 mb-4">Supported runtimes: 3.7, 3.8, 4.0, 4.1</p>
                <p class="mb-4">Select an animation, choose a skin if provided, and play/stop.</p>
                <p>Adjust scale as needed and step through frames with the horizontal slider.</p>
              </q-card-section>
            </q-card>
          </q-expansion-item>

        </q-list>
      </div>
    </section>

    <!-- ─── DONATIONS ─────────────────────────────────────────── -->
    <section class="donations">
      <div class="section-wrap text-center">
        <h2 class="section-title section-title--light">
          Support Us with <span class="text-yellow-300">Donations</span>
        </h2>
        <p class="section-sub section-sub--light">
          Your contributions help us maintain and improve AssetAlchemy. Whether big or small, every donation is greatly
          appreciated and keeps our app thriving. 🙌
        </p>
        <div class="donations-grid">
          <div v-for="d in donations" :key="d.name" class="donation-card">
            <div class="donation-card__header">
              <span class="donation-card__symbol" :style="{ color: d.color }">{{ d.symbol }}</span>
              <p class="donation-card__name">{{ d.name }}</p>
            </div>
            <div class="donation-card__address-row">
              <p class="donation-card__address">{{ d.address }}</p>
              <q-btn
                flat
                round
                dense
                :icon="copied === d.name ? 'check' : 'content_copy'"
                :color="copied === d.name ? 'positive' : 'grey-5'"
                size="sm"
                @click="copyAddress(d)"
              >
                <q-tooltip>{{ copied === d.name ? 'Copied!' : 'Copy address' }}</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
        <p class="mt-10 text-white/50 text-sm">
          Thank you for supporting AssetAlchemy! Your generosity makes everything possible. 💖
        </p>
      </div>
    </section>

    <!-- ─── CONTACT ───────────────────────────────────────────── -->
    <section class="page-section page-section--dark">
      <div class="section-wrap text-center">
        <h2 class="section-title section-title--light">Contact <span class="text-[#4fc3f7]">Us</span></h2>
        <p class="section-sub section-sub--light">
          If you have any questions, feedback, or collaboration ideas, feel free to reach out! We'd love to hear from you. 😊
        </p>
        <div class="contact-links">
          <a href="mailto:zorinuk@gmail.com" class="contact-link">
            <q-icon name="email" size="22px" class="q-mr-sm" />zorinuk@gmail.com
          </a>
          <a href="https://t.me/boberlize" target="_blank" class="contact-link">
            <q-icon name="send" size="22px" class="q-mr-sm" />@boberlize
          </a>
        </div>
        <p class="mt-10 text-gray-500 text-sm">We're here to help. Reach out anytime! 🚀</p>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import imgSpritesheet from '../assets/images/spritesheet.webp';
import imgFont from '../assets/images/font.webp';
import imgParticles from '../assets/images/particles.webp';
import imgSpine from '../assets/images/spine.webp';

const features = [
  {
    to: '/spritesheet',
    img: imgSpritesheet,
    title: 'Create Spritesheets from Images',
    desc: 'Combine multiple images into a single, optimized spritesheet for efficient game development.',
    color: '#097897',
  },
  {
    to: '/bitmapfont',
    img: imgFont,
    title: 'Create Bitmap Fonts from Images',
    desc: 'Transform your images into stunning bitmap fonts for use in games and applications.',
    color: '#8b5cf6',
  },
  {
    to: '/particles',
    img: imgParticles,
    title: 'Create Particle Systems',
    desc: 'Design and customize particle effects using Pixi.js to enhance your visual projects.',
    color: '#f59e0b',
  },
  {
    to: '/spine',
    img: imgSpine,
    title: 'Spine Viewer',
    desc: 'Preview and interact with Spine animations directly within the app.',
    color: '#10b981',
  },
];

const audience = [
  {
    icon: '🎮',
    title: 'Game Developers',
    desc: 'Optimize and manage assets for your games with ease.',
    gradient: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
  },
  {
    icon: '🎨',
    title: 'Designers',
    desc: 'Create stunning visual effects and fonts for various projects.',
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
  },
  {
    icon: '🛠️',
    title: 'Hobbyists',
    desc: 'Explore creative possibilities and experiment with asset creation.',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
  },
];

const copied = ref('');

function copyAddress(d: { name: string; address: string }) {
  const done = () => {
    copied.value = d.name;
    setTimeout(() => { copied.value = ''; }, 2000);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(d.address).then(done).catch(() => fallbackCopy(d, done));
  } else {
    fallbackCopy(d, done);
  }
}

function fallbackCopy(d: { address: string }, done: () => void) {
  const el = document.createElement('textarea');
  el.value = d.address;
  el.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  document.body.appendChild(el);
  el.focus();
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  done();
}

const donations = [
  {
    symbol: '₿',
    name: 'Bitcoin',
    address: 'bc1qzw3zz48nke8ncvyakdmwhzjww2rv6zgqhakaf6',
    color: '#f59e0b',
  },
  {
    symbol: 'Ξ',
    name: 'Ethereum',
    address: '0x700d693E39f0BafB0cc3476D968732B926b2a769',
    color: '#a78bfa',
  },
  {
    symbol: '◎',
    name: 'Solana',
    address: '4HjmoPvFwmhTkGrNjwiLTWTNVMowibL4ti3H6bFhhRTP',
    color: '#67e8f9',
  },
];
</script>

<style lang="scss">

/* ─── HERO ─────────────────────────────────────────────────── */
.hero {
  background: linear-gradient(135deg, #0f172a 0%, #0d2137 60%, #071424 100%);
  position: relative;
  padding: 100px 24px 90px;
  color: white;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(9, 120, 151, 0.18) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 50%);
    pointer-events: none;
  }
}

.hero__inner {
  position: relative;
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.hero__badge {
  display: inline-block;
  background: rgba(9, 120, 151, 0.2);
  border: 1px solid rgba(9, 120, 151, 0.45);
  color: #7dd3fc;
  padding: 4px 16px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.hero__title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 20px;
  color: #fff;
  letter-spacing: -0.01em;
}

.hero__accent {
  color: #4fc3f7;
}

.hero__sub {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.75;
  margin-bottom: 20px;
}

.hero__em {
  color: #7dd3fc;
  font-style: normal;
  font-weight: 500;
}

.hero__note {
  display: inline-block;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid #097897;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  padding: 10px 18px;
  margin-bottom: 40px;
  text-align: left;
  border-radius: 0 6px 6px 0;
}

.hero__cta {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ─── SHARED ────────────────────────────────────────────────── */
.page-section {
  padding: 80px 24px;
  background: #fff;

  &--muted { background: #f8fafc; }
  &--dark {
    background: linear-gradient(135deg, #0f172a 0%, #0d2137 60%, #071424 100%);
    color: white;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 50%, rgba(9, 120, 151, 0.18) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 50%);
      pointer-events: none;
    }

    .section-wrap { position: relative; }
  }
}

.section-wrap {
  max-width: 1100px;
  margin: 0 auto;
}

.section-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  color: #0f172a;

  &--light { color: #fff; }
}

.section-sub {
  text-align: center;
  color: #64748b;
  max-width: 620px;
  margin: 0 auto 52px;
  line-height: 1.75;
  font-size: 1rem;

  &--light { color: rgba(255, 255, 255, 0.62); }
}

/* ─── FEATURES ──────────────────────────────────────────────── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.feature-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  text-decoration: none;
  color: inherit;
  display: block;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }
}

.feature-card__img {
  width: 100%;
  height: 160px;
  display: block;
}

.feature-card__body {
  padding: 18px 20px 22px;
  position: relative;
}

.feature-card__line {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
}

.feature-card__title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 8px;
  margin-top: 4px;
  color: #0f172a;
  text-wrap: balance;
  line-height: 1.4;
}

.feature-card__desc {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* ─── AUDIENCE ──────────────────────────────────────────────── */
.audience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.audience-card {
  border-radius: 12px;
  padding: 36px 24px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;

  &:hover { transform: translateY(-4px); }
}

.audience-card__icon {
  font-size: 3rem;
  margin-bottom: 14px;
  line-height: 1;
}

.audience-card__title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.audience-card__desc {
  font-size: 0.875rem;
  opacity: 0.85;
  line-height: 1.6;
}

/* ─── HOW TO USE ────────────────────────────────────────────── */
.howto-list {
  max-width: 820px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.howto-header {
  font-size: 1.05rem !important;
  font-weight: 600 !important;
  padding: 4px 16px !important;
}

.howto-card {
  background: rgba(255, 255, 255, 0.04) !important;
}

/* ─── DONATIONS ─────────────────────────────────────────────── */
.donations {
  background: linear-gradient(135deg, #1e3a8a 0%, #4c1d95 100%);
  padding: 80px 24px;
  color: white;
}

.donations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
}

.donation-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 24px;
  text-align: left;
  transition: background 0.2s;

  &:hover { background: rgba(255, 255, 255, 0.13); }
}

.donation-card__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.donation-card__symbol {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}

.donation-card__name {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.donation-card__address-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 10px;
}

.donation-card__address {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
  word-break: break-all;
  margin: 0;
  flex: 1;
}

/* ─── CONTACT ───────────────────────────────────────────────── */
.contact-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 32px 0;
}

.contact-link {
  color: #4fc3f7;
  text-decoration: none;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  transition: color 0.15s;

  &:hover {
    color: #7dd3fc;
    text-decoration: underline;
  }
}
</style>

<template>
  <div class="m-auto ">
    <div class="container m-auto">
      <section class="info mt-4 text-gray-800 p-6">
        <div class="info__header text-2xl font-bold mb-4 text-center">
          Welcome to <span class="text-blue-500">AssetAlchemy</span>
        </div>
        <div class="info__content text-base leading-relaxed">
          <p class="mb-4">
            Discover the ultimate tool for managing and enhancing your creative assets for 2D game development
            (e.g., <span class="font-medium text-[#097897]">Pixi.js</span>, <span class="font-medium text-[#097897]">Phaser.js</span>).
          </p>
          <p class="mb-4">
            Whether you’re a <span class="font-medium">🎮 game developer</span>, <span
            class="font-medium">🎨 designer</span>,
            or <span class="font-medium">🛠️ hobbyist</span>, AssetAlchemy is here to streamline your workflow and bring
            your projects to life. 💡
          </p>
          <p class="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-md shadow-inner text-white">
            <span class="font-semibold text-yellow-300">Currently free and in its alpha stage</span>, your feedback,
            issue reports,
            and proposals are invaluable for shaping the app’s future.
          </p>
          <p class="text-center text-sm font-semibold text-[#097897]">
            Your support through <span class="text-[#62b6d7]">donations</span> is greatly appreciated! ❤️
          </p>
        </div>
      </section>
    </div>


    <section class="info mt-6 text-gray-800 p-6">
      <div class="info__header text-2xl font-bold mb-8 text-center">
        What is <span class="text-blue-500">AssetAlchemy?</span>
      </div>
      <div class="info__content text-base leading-relaxed text-center max-w-4xl mx-auto">
        <p class="mb-8">
          AssetAlchemy is your go-to solution for creating and managing digital assets. With an intuitive interface and
          powerful features, AssetAlchemy provides:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Feature 1 -->
          <router-link to="/spritesheet"
                       class="feature-item bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <q-img src="../assets/images/spritesheet.webp" alt="Spritesheets" class="w-full h-40 object-cover"/>
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2">Create Spritesheets from Images</h3>
              <p class="text-sm text-gray-600">
                Combine multiple images into a single, optimized spritesheet for efficient game development.
              </p>
            </div>
          </router-link>
          <!-- Feature 2 -->
          <router-link to="/bitmapfont"
                       class="feature-item bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <q-img src="../assets/images/font.webp" alt="Bitmap Fonts" class="w-full h-40 object-cover"/>
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2">Create Bitmap Fonts from Images</h3>
              <p class="text-sm text-gray-600">
                Transform your images into stunning bitmap fonts for use in games and applications.
              </p>
            </div>
          </router-link>
          <!-- Feature 3 -->
          <router-link to="/particles"
                       class="feature-item bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <q-img src="../assets/images/particles.webp" alt="Particle Systems" class="w-full h-40 object-cover"/>
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2">Create Particle Systems</h3>
              <p class="text-sm text-gray-600">
                Design and customize particle effects using Pixi.js to enhance your visual projects.
              </p>
            </div>
          </router-link>
          <!-- Feature 4 -->
          <router-link to="/spine"
                       class="feature-item bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <q-img src="../assets/images/spine.webp" alt="Spine Viewer" class="w-full h-40 object-cover"/>
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2">Spine Viewer</h3>
              <p class="text-sm text-gray-600">
                Preview and interact with Spine animations directly within the app.
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <section class="info mt-6 text-gray-800 p-6 mb-8">
      <div class="info__header text-2xl font-bold mb-8 text-center">
        Who is This App For?
      </div>
      <div class="info__content text-base leading-relaxed text-center max-w-4xl mx-auto">
        <p class="mb-8">
          Whether you’re looking to streamline your asset pipeline or explore new creative tools, AssetAlchemy is here
          to assist you. 🛠️✨
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Audience 1 -->
          <div
            class="feature-item bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105">
            <div class="icon text-5xl mb-4">🎮</div>
            <h3 class="text-lg font-semibold mb-2">Game Developers</h3>
            <p class="text-sm text-center">
              Optimize and manage assets for your games with ease.
            </p>
          </div>
          <!-- Audience 2 -->
          <div
            class="feature-item bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105">
            <div class="icon text-5xl mb-4">🎨</div>
            <h3 class="text-lg font-semibold mb-2">Designers</h3>
            <p class="text-sm text-center">
              Create stunning visual effects and fonts for various projects.
            </p>
          </div>
          <!-- Audience 3 -->
          <div
            class="feature-item bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105">
            <div class="icon text-5xl mb-4">🛠️</div>
            <h3 class="text-lg font-semibold mb-2">Hobbyists</h3>
            <p class="text-sm text-center">
              Explore creative possibilities and experiment with asset creation.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="info bg-gray-900 text-white p-8 shadow-lg pt-20 p-8">
      <div class="info__header text-3xl font-bold mb-8 text-center">
        How to Use the <span class="text-blue-400">App</span>
      </div>
      <div class="info__content max-w-4xl mx-auto" id="howToUseApp">

        <div class="mb-4 border-b border-gray-700">
          <div class="flex justify-between" @click="panels.spritesheets=!panels.spritesheets">
            <div class="text-xl font-semibold py-4">
              Spritesheet
            </div>
            <div>
              <q-icon v-if="!panels.spritesheets" name="expand_more" size="25px" class="p-2"/>
              <q-icon v-else name="expand_less" size="25px" class="p-2"/>
            </div>
          </div>
          <div v-show="panels.spritesheets" class="text-gray-300 leading-relaxed pb-5">
            <p class="mb-4">Drag and drop images into the app <span class="text-yellow-400">(note: images shouldn’t exceed max width/height parameters)</span>
              or use the "+" button to add files.</p>
            <p class="mb-4">Add a spritesheet name, adjust export parameters if needed, and press the Pack button. Your
              spritesheet and JSON file will be downloaded as a ZIP file.</p>
            <p class="font-bold">Parameters:</p>
            <ul class="list-disc pl-6">
              <li>Spritesheet Name: Name of the exported spritesheet.</li>
              <li>Format: Image output format.</li>
              <li>Max Width/Height: Maximum spritesheet image size. If exceeded, multiple spritesheets will be
                created.
              </li>
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
          </div>
        </div>

        <div class="mb-4 border-b border-gray-700">
          <div class="flex justify-between" @click="panels.bitmapFonts=!panels.bitmapFonts">
            <div class="text-xl font-semibold py-4">
              Bitmap Font
            </div>
            <div>
              <q-icon v-if="!panels.bitmapFonts" name="expand_more" size="25px" class="p-2"/>
              <q-icon v-else name="expand_less" size="25px" class="p-2"/>
            </div>
          </div>
          <div v-show="panels.bitmapFonts" class="text-gray-300 leading-relaxed pb-5">
            <p class="mb-4">Drag and drop images into the app drag and drop section <span class="text-yellow-400">(note: images shouldn’t exceed max width/height parameters)</span>
              or use the "+" button to add files.</p>
            <p class="mb-4">Map each image to char value in "IMAGES TO CHAR MAP" section</p>
            <p class="mb-4">Add a font name, adjust export parameters if needed, and press the Pack button. Your font
              spritesheet and XML file will be downloaded as a ZIP file.</p>
            <p class="font-bold">Parameters:</p>
            <ul class="list-disc pl-6">
              <li>Font Name: Name of the font.</li>
              <li>Format: Image output format.</li>
              <li>Max Width/Height: Maximum spritesheet image size. If exceeded, multiple spritesheets will be
                created.
              </li>
              <li>Size: Font size.</li>
              <li>Line height: Font line height.</li>
              <li>Scale: Scale factor for images.</li>
              <li>Quality: Export quality (%).</li>
            </ul>
          </div>
        </div>

        <div class="mb-4 border-b border-gray-700">
          <div class="flex justify-between" @click="panels.particles=!panels.particles">
            <div class="text-xl font-semibold py-4">
              Particles
            </div>
            <div>
              <q-icon v-if="!panels.particles" name="expand_more" size="25px" class="p-2"/>
              <q-icon v-else name="expand_less" size="25px" class="p-2"/>
            </div>
          </div>
          <div v-show="panels.particles" class="text-gray-300 leading-relaxed pb-5">
            <p class="mb-4">Drag and drop images into the app drag and drop section or use the "+" button to add files.
              Now you able to add this images as a textures for particle or particle animation</p>
            <p class="mb-4">This constructor created for Pixi particles module <a class="text-yellow-400 underline"
                                                                                  href="https://github.com/pixijs-userland/particle-emitter#readme">Github</a>
              its uses all possible options for this pixi module, regarding meaning of each option read module
              <a class="text-yellow-400 underline" href="https://particle-emitter.pixijs.io/docs/">documentation</a></p>
            <p>for pixi v8 version use <a class="text-yellow-500 underline" href="https://github.com/andriibarvynko/particle-emitter">Github</a></p>
            <p class="font-bold">Save</p>
            <p class="mb-4">As a result you can download JSON file by pressing "GET JSON" button, with all options for
              use this particle system in your Pixi app</p>
            <p class="font-bold">Open</p>
            <p class="mb-4">You can upload json file created before by using "LOAD" button. <span
              class="text-yellow-400">note: images used as textures in loaded json file should be added to "IMAGES FOR PARTICLES" section before load file</span>
            </p>
          </div>
        </div>

        <div class="mb-4 border-b border-gray-700">
          <div class="flex justify-between" @click="panels.spineViewer=!panels.spineViewer">
            <div class="text-xl font-semibold py-4">
              Spine viewer
            </div>
            <div>
              <q-icon v-if="!panels.spineViewer" name="expand_more" size="25px" class="p-2"/>
              <q-icon v-else name="expand_less" size="25px" class="p-2"/>
            </div>
          </div>
          <div v-show="panels.spineViewer" class="text-gray-300 leading-relaxed pb-5">
            <p class="mb-4">Drag and drop files into the app or use the "+" button to add files. Its should be ATLAS,
              JSON and spritesheet image files from spine export</p>
            <p class="mb-4">Press "LOAD BUTTON" to load data from files provided, if files provided correct you will see
              spine version above</p>
            <p class="font-bold text-yellow-400">Spine runtimes allowed: 3.7, 3.8, 4.0, 4.1</p>
            <p class="mb-4">Now you able to select animation, select skin if provided and play/stop</p>
            <p class="mb-4">Also you able to set scale if needed and check animation frame by frame with horizontal
              sliders</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gradient-to-r from-blue-500 to-purple-600 pt-20 p-8 text-white shadow-lg m-0">
      <div class="info__header text-3xl font-bold mb-8 text-center">
        Support Us with <span class="text-yellow-300">Donations</span>
      </div>
      <div class="info__content max-w-3xl mx-auto text-center">
        <p class="mb-8 text-lg leading-relaxed">
          Your contributions help us maintain and improve AssetAlchemy. Whether big or small, every donation is greatly
          appreciated and keeps our app thriving. 🙌
        </p>
        <h3 class="text-2xl font-semibold text-white mb-6">
          Donation Methods:
        </h3>
        <div class="space-y-6 text-left">
          <!-- Bitcoin -->
          <div class="donation-method flex items-center">
            <span class="text-yellow-300 text-2xl font-bold mr-4">₿</span>
            <div>
              <p class="text-xl font-bold mb-1">Bitcoin:</p>
              <p class="text-lg underline decoration-yellow-300 decoration-2">
                bc1qzw3zz48nke8ncvyakdmwhzjww2rv6zgqhakaf6
              </p>
            </div>
          </div>
          <!-- Ethereum -->
          <div class="donation-method flex items-center">
            <span class="text-purple-300 text-2xl font-bold mr-4">Ξ</span>
            <div>
              <p class="text-xl font-bold mb-1">Ethereum:</p>
              <p class="text-lg underline decoration-purple-300 decoration-2">
                0x700d693E39f0BafB0cc3476D968732B926b2a769
              </p>
            </div>
          </div>
          <!-- Solana -->
          <div class="donation-method flex items-center">
            <span class="text-blue-300 text-2xl font-bold mr-4">◎</span>
            <div>
              <p class="text-xl font-bold mb-1">Solana:</p>
              <p class="text-lg underline decoration-blue-300 decoration-2">
                4HjmoPvFwmhTkGrNjwiLTWTNVMowibL4ti3H6bFhhRTP
              </p>
            </div>
          </div>
        </div>
        <p class="mt-8 text-gray-200 text-sm">
          Thank you for supporting AssetAlchemy! Your generosity makes everything possible. 💖
        </p>
      </div>
    </section>

    <section class="info bg-gray-900 text-white p-8 shadow-lg pt-20">
      <div class="info__header text-3xl font-bold mb-8 text-center">
        Contact <span class="text-blue-400">Us</span>
      </div>
      <div class="info__content max-w-3xl mx-auto text-center">
        <p class="mb-8 text-lg leading-relaxed">
          If you have any questions, feedback, or collaboration ideas, feel free to reach out! We'd love to hear from
          you. 😊
        </p>
        <div class="flex flex-col items-center space-y-6 text-lg">
          <!-- Email Contact -->
          <div class="flex items-center space-x-4">
            E-mail: <a href="mailto:zorinuk@gmail.com" class="text-lg text-blue-300 underline">
            zorinuk@gmail.com
          </a>
          </div>
          <!-- Telegram Contact -->
          <div class="flex items-center space-x-4">
            Telegram: <a href="https://t.me/boberlize" target="_blank" class="text-blue-300 underline">
            @boberlize
          </a>
          </div>
        </div>
        <p class="mt-8 text-gray-400 text-sm">
          We're here to help and answer your questions. Reach out to us anytime! 🚀
        </p>
      </div>
    </section>


  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const panels = ref({ spritesheets: false, bitmapFonts: false, particles: false, spineViewer: false });
</script>

<style lang="scss">
.info {
  .info__header {
    font-size: 24px;
    margin-bottom: 10px;
  }
}

</style>

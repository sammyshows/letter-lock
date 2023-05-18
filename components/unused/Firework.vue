<template>
  <div class="fixed h-full w-full">
    <div
        v-for="(num, fireworkIndex) in 3"
        :key="'firework-container-' + fireworkIndex"
        class="absolute"
        :style="fireworkPositions[fireworkIndex]"
    >
      <div
          :class="[ 'firework-' + num ]"
          class="relative h-2 w-2"
          :key="'firework-' + fireworkIndex"
      >
        <svg
            v-for="number in 51"
            :key="'particle-' + fireworkIndex + '-' + number"
            class="particle"
            :class="{ 'particle-animate': true }"
            viewBox="0 0 10 10"
            :style="particleStyle(fireworkIndex, number)"
        >
          <circle :fill="colors[fireworkIndex]" cx="5" cy="5" r="4"></circle>
        </svg>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Fireworks",

  data() {
    return {
      animate: false,
      colors: [
        "#ff9054", // Light Pink
        "#22ff32", // Light Orange
        "#FFF176", // Light Yellow
        "#214aff", // Light Lime
        "#ffbb2e", // Light Green
        "#79f37c", // Light Teal
      ],
      fireworkPositions: [
        { top: '20%', left: '20%' },
        { top: '75%', right: '15%' },
        { top: '15%', right: '10%' },
        { top: '45%', left: '15%' },
        { top: '40%', right: '20%' },
        { top: '80%', left: '25%' }
      ],
    };
  },

  methods: {
    particleStyle(fireworkIndex, index) {
      const radians = [0, 0, 0.7853981633974483, 1.5707963267948966, 2.356194490192345, 3.141592653589793, 3.9269908169872414, 4.71238898038469, 5.497787143782138, 0, 0.5711986642890533, 1.1423973285781066, 1.71359599286716, 2.284794657156213, 2.855993321445266, 3.42719198573432, 3.998390650023373, 4.569589314312426, 5.14078797860148, 5.711986642890532, 0, 0.4487989505128276, 0.8975979010256552, 1.3463968515384828, 1.7951958020513104, 2.2439947525641384, 2.6927937030769655, 3.141592653589793, 3.5903916041026207, 4.039190554615448, 4.487989505128277, 4.9367884556411035, 5.385587406153931, 5.834386356666759, 0, 0.36959913571644626, 0.7391982714328925, 1.1087974071493387, 1.478396542865785, 1.8479956785822311, 2.2175948142986774, 2.587193950015124, 2.95679308573157, 3.3263922214480166, 3.6959913571644623, 4.065590492880909, 4.435189628597355, 4.804788764313802, 5.174387900030248, 5.543987035746693, 5.91358617146314]
      const distances = [0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.61, 0.61, 0.61, 0.61, 0.61, 0.61, 0.61, 0.61, 0.61, 0.61, 0.61, 0.61, 0.61, 0.61, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85, 0.85]
      const distance = distances[index] * 135;
      const radian = radians[index];
      const angle = (radian * 180) / Math.PI;
      const translateX = distance * Math.cos(radian);
      const translateY = distance * Math.sin(radian);
      const animationDelay = `${fireworkIndex * 0.3}s`;

      return {
        '--angle': angle + 'deg',
        '--translateX': translateX + 'px',
        '--translateY': translateY + 'px',
        '--animation-delay': animationDelay,
      };
    },
  },
};
</script>

<style scoped>
.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  opacity: 0;
  will-change: opacity, transform;
}

.particle-animate {
  animation: explode 1.5s ease-out infinite;
  animation-delay: var(--animation-delay);
}

@keyframes explode {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(0);
  }
  33% {
    opacity: 1;
    transform: translate(0, 0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translate(var(--translateX) / 0.8, var(--translateY) / 0.8) scale(1);
  }
  90% {
    transform: translate(var(--translateX), var(--translateY)) scale(0.5);
  }
  100% {
    opacity: 0;
    transform: translate(calc(var(--translateX) * 1.03) , calc(var(--translateY) + 3px)) scale(0);
  }
}
</style>

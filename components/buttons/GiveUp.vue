<template>
  <div @click="$emit('giveUp'); playSound('click')" class="flex self-center py-1 px-6 xs:py-2 xs:px-8 rounded-full bg-gradient-to-br from-red-300 to-red-500 focus:from-red-400 focus:to-red-600 sm:py-3 sm:px-8 lg:py-4 lg:px-10">
    <div class="relative mr-3 flex justify-center drop-shadow sm:mr-4 lg:mr-6">
      <IconsHeart class="-rotate-12 h-8 w-8 drop-shadow-xl sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
      <div class="absolute w-full h-full top-0 flex justify-center items-center text-red-600 text-sm font-medium sm:text-lg lg:text-xl">-1</div>
    </div>
    <button class="text-white font-medium shadow-sm drop-shadow sm:text-3xl lg:text-4xl" style="touch-action: manipulation;">Give Up</button>
  </div>
</template>
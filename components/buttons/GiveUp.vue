<template>
  <div @click="$emit('giveUp')" class="flex self-center py-2 px-6 rounded-full bg-gradient-to-br from-red-300 to-red-500 focus:from-red-400 focus:to-red-600">
    <div class="relative mr-3 flex justify-center drop-shadow">
      <IconsHeart class="-rotate-12 h-8 w-8 drop-shadow-xl" />
      <div class="absolute w-full h-full top-0 flex justify-center items-center text-red-600 text-sm font-medium">-1</div>
    </div>
    <button class="text-sm text-white font-medium shadow-sm drop-shadow">Give Up</button>
  </div>
</template>
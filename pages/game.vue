  <template>
    <div :class="[ getResponsiveValue(platform === 'ios' ? 'topPadding2' : 'topPadding1') ]" class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-700 via-blue-500 to-blue-600">
      <img v-if="isMobile" src="@/assets/images/background.png" alt="background" class="h-full w-full absolute top-0 left-0">
      <img v-else src="@/assets/images/background-large.png" alt="background" class="h-full w-full absolute top-0 left-0">

      <div class="w-full flex justify-between px-4 z-10">
        <IconsArrowLeft @click="showLoseLifeModal = true; playSound('click')" class="h-10 w-10 sm:w-20 sm:h-20 sm:ml-3 sm:mt-2" style="touch-action: manipulation;" />

        <div class="relative h-6 w-6 xs:h-7 xs:w-7 drop-shadow opacity-50 sm:h-14 sm:w-14">
          <IconsHeart class="h-6 h-6 xs:h-7 xs:w-7 text-red-400 sm:h-14 sm:w-14" />
          <span class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-xs sm:text-3xl font-medium">{{ lives }}</span>
        </div>
      </div>
      <div class="flex flex-col grow z-10">
        <div :class="{ 'slide-down': levelCompleted }" class="flex justify-center items-center text-3xl mt-1 mb-3 font-bold tracking-widest text-center sm:text-5xl lg:text-7xl" style="font-family: 'Luckiest Guy';">LEVEL <span class="ml-3 text-4xl sm:text-6xl lg:ml-7 lg:text-8xl">{{ currentLevelId }}</span></div>

        <div class="flex justify-center">
          <div :class="{ 'slide-down-and-grow': levelCompleted }" class="relative flex justify-center items-end">
            <IconsLock :style="{ filter: lockDropShadow, transitionDuration: lockTransitionDuration }" class="lock-size mx-auto text-ll-orange sm:h-32 sm:w-32 lg:h-44 lg:w-44"></IconsLock>
            <div :style="{ maxHeight: lockBoltHeight, backgroundColor: lockBoltColor }" class="lock-bolt"></div>
            <div :class="[ platform === 'ios' ? 'pb-1' : 'pb-2' ]" class="moves-text absolute font-medium sm:text-5xl sm:pb-4 lg:text-7xl lg:pb-5">{{ remainingMoves }}</div>
          </div>

          <div v-if="settings.testMode && replayingLevel" :class="{ 'slide-down-and-grow': levelCompleted }" class="relative flex justify-center items-end ml-2">
            <IconsLock class="h-12 w-12 mx-auto text-purple-400 duration-700"></IconsLock>
            <div class="lock-bolt"></div>
            <div class="absolute pb-0.5 text-lg font-medium">{{ remainingMoves - bestRemainingMoves }}</div>
          </div>
        </div>

        <div class="flex flex-col justify-center grow p-4">
          <div class="relative">
            <div :class="{ 'hide-board': !displayBoard }" class="board-size absolute bg-gray-100 sm:p-4 sm:rounded-2xl lg:p-5 lg:rounded-3xl"></div>
            <div :class="{ 'slide-right': !displayBoard }" class="board-size sm:p-4 lg:p-5">
              <div
                ref="gameBoard"
                :class="[ gridCSS ]"
                class="grid mx-auto w-full h-full"
                :style="gridCols"
              >
                <div
                  class="left-shadow"
                  v-for="(tile, index) in sortableTiles"
                  :key="tile.id"
                  :data-index="index"
                >
                  <div
                    :class="[
                        { 'empty-tile': !tile.letter, 'glow': showCollideEffect },
                        tile.isPartOfWord ? 'z-20 bg-amber-400' : 'bg-gray-200',
                        levelCompleted ? animationClasses[index] : '',
                        borderRadiusClasses ? borderRadiusClasses[index] : ''
                    ]"
                    class="tile w-full h-full relative text-blue-700 font-medium text-3xl flex justify-center items-center sm:text-5xl lg:text-6xl"
                  >
                    {{ tile.letter }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="validWords <= 3" class="mt-6 duration-1000" :class="{ 'opacity-0': !displayBoard }">
            <p v-for="word in validWords" :class="{ 'line-through opacity-40': wordsFormed.includes(word) }" class="text-2xl text-center decoration-slate-200 duration-500 sm:text-4xl lg:text-5xl">{{ word }}</p>
          </div>

          <div v-else class="grow flex flex-col justify-center gap-y-1 mt-2 font-medium tracking-wide duration-1000 xs:gap-y-2 sm:gap-y-4 lg:mt-2 lg:gap-y-6" :class="{ 'opacity-0': !displayBoard }">
            <div class="flex justify-center gap-x-8">
              <p v-for="word in validWords.slice(0,1).concat(validWords.slice(2,3))" :key="word" :class="{ 'line-through opacity-40': wordsFormed.includes(word) }" class="text-2xl text-center decoration-slate-200 duration-500 sm:text-4xl lg:text-5xl" style="min-width: 25%;">{{ word }}</p>
            </div>
            <div class="flex justify-center gap-x-8">
              <p v-for="word in validWords.slice(1,2).concat(validWords.slice(3,4))" :key="word" :class="{ 'line-through opacity-40': wordsFormed.includes(word) }" class="text-2xl text-center decoration-slate-200 duration-500 sm:text-4xl lg:text-5xl" style="min-width: 25%;">{{ word }}</p>
            </div>
            <div class="flex justify-center gap-x-8">
              <p v-for="word in validWords.slice(4)" :class="{ 'line-through opacity-40': wordsFormed.includes(word) }" :key="word" class="text-2xl text-center decoration-slate-200 duration-500 sm:text-4xl lg:text-5xl" style="min-width: 25%;">{{ word }}</p>
            </div>
          </div>
        </div>
        <div class="grow"></div>
      </div>
      
      <div class="ripple-container">
        <div :class="{ 'ripple': showCollideEffect }"></div>
      </div>

      <!-- LEVEL COMPLETE MODAL -->
      <LevelCompleteModal v-if="showLevelCompleteModal || hideLevelCompleteModal"
                :showLevelCompleteModal="showLevelCompleteModal"
                :hideLevelCompleteModal="hideLevelCompleteModal"
                @nextLevel="nextLevel"
                @resetLevel="resetLevel" />

      <!-- LOSE LIFE MODAL -->
      <LoseLifeModal v-if="showLoseLifeModal || hideLoseLifeModal"
                :showLoseLifeModal="showLoseLifeModal"
                :hideLoseLifeModal="hideLoseLifeModal"
                @close="closeLoseLifeModal" />

      <!-- FAILED MODAL -->
      <FailedModal v-if="showFailedModal || hideFailedModal"
                :showFailedModal="showFailedModal"
                :hideFailedModal="hideFailedModal"
                :allowExtraMoves="!extraMovesUsed"
                @close="closeFailedModal" />

      <div v-if="showLoseLifeModal" @click="closeLoseLifeModal(false)" class="h-screen w-full bg-transparent absolute z-10"></div>
      <div :class="[ showFailedModal || showLevelCompleteModal || showLoseLifeModal ? 'opacity-1' : 'opacity-0' ]" class="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md duration-700 pointer-events-none z-10"></div>
    </div>
  </template>

  <script setup>
  import _ from 'lodash'
  import Sortable from "sortablejs";
  import { App } from '@capacitor/app';
  import { Capacitor } from "@capacitor/core"
  import { storeToRefs } from "pinia"
  import { useGameStore } from "@/stores/game";

const gameStore = useGameStore()

let { event, currentLevelId, bestRemainingMoves, replayingLevel, settings, lives } = storeToRefs(gameStore)
lives = ref(JSON.parse(JSON.stringify(lives.value.count)))
currentLevelId = ref(JSON.parse(JSON.stringify(currentLevelId.value)))

const platform = ref(Capacitor.getPlatform());
const router = useRouter();

const getResponsiveValue = (variableName) => {
  const values = {
    topPadding1: {
      'xs': 'pt-3',
      '': 'pt-8',
      'sm': 'pt-8',
      'md': 'pt-8',
      'lg': 'pt-8'
    },
    topPadding2: {
      'xs': 'pt-3',
      '': 'pt-12',
      'sm': 'pt-12',
      'md': 'pt-12',
      'lg': 'pt-12'
    },
    lockBoltHeight: {
      '': '0.60rem',
      'sm': '0.60rem',
      'md': '0.96rem',
      'lg': '1.536rem'
    },
    lockBoltColor1: {
      'xs': 'rgb(42,101,229)',
      '': 'rgb(31,99,227)',
      'sm': 'rgb(31,99,227)',
      'md': 'rgb(31,99,227)',
      'lg': 'rgb(39, 97, 227)'
    },
    lockBoltColor2: {
      '': 'rgb(50, 120, 239)',
      'sm': 'rgb(50, 120, 239)',
      'md': 'rgb(50, 120, 239)',
      'lg': 'rgb(52, 120, 240)'
    },
    gridGap1: {
      'xs': 'gap-1.5',
      '': 'gap-2',
      'sm': 'gap-2',
      'md': 'gap-3',
      'lg': 'gap-4'
    },
    gridGap2: { // just the number because it's dynamically changed when set based on gridSize
      'xs': 4,
      '': 5,
      'sm': 6,
      'md': 7,
      'lg': 8
    },
    gridGap3: {
      '': 'gap-1',
      'sm': 'gap-2',
      'md': 'gap-2',
      'lg': 'gap-2'
    }
  };

  const currentScreenWidth = window.innerWidth;
  const currentScreenHeight = window.innerHeight;
  const pixelRatio = window.devicePixelRatio;
  let screen = '';
  let extraSmallOptions = ['gridGap1', 'gridGap2', 'topPadding1', 'topPadding2']

  if (currentScreenWidth >= 1536) screen = '2xl';
  else if (currentScreenWidth >= 1280) screen = 'xl';
  else if (currentScreenWidth >= 1024) screen = 'lg';
  else if (currentScreenWidth >= 768) screen = 'md';
  else if (currentScreenWidth >= 640) screen = 'sm';
  else if (extraSmallOptions.includes(variableName) && currentScreenWidth < 320) screen = 'xs';
  if (extraSmallOptions.includes(variableName) && pixelRatio === 2 && currentScreenWidth < 380 && currentScreenHeight < 700) screen = 'xs'; // special case for iPhone SE, iPhone 8, iPhone 7, iPhone 6s, iPhone 6 etc.

  return values[variableName][screen];
}

let sortable;
let gameBoard = ref(null);
let backButtonListenerHandle = ref(null);
let tiles = ref([]); // copy of the tiles used internally for monitoring the state/position of tiles. This is manually kept up to date with tile swaps via our code.
let sortableTiles = ref([]); // copy used for sortable. Changes are not made to this array by sortable so tiles could be swapped and this array wouldn't reflect it.
let gridSize = ref(3);
let remainingMoves = ref(0);
let extraMovesUsed = ref(false);
let validWords = ref([]);
let wordsFormed = ref([]);
let levelCompleted = ref(false);
let levelFailed = ref(false);
let showLevelCompleteModal = ref(false);
let hideLevelCompleteModal = ref(false);
let showLoseLifeModal = ref(false);
let hideLoseLifeModal = ref(false);
let showFailedModal = ref(false);
let hideFailedModal = ref(false);
let animationClasses = ref(null);
let borderRadiusClasses = ref(null);
let initialTilePosition = ref(null);
let showCollideEffect = ref(false);
let displayBoard = ref(true);
let lockDropShadow = ref('drop-shadow(0 0 0 rgb(251, 163, 69))');
let lockTransitionDuration = ref('700ms'); // also gets sets back to 700ms at end of failLevel()
let colors = ref(["#ff9054", "#22ff32", "#FFF176", "#214aff", "#ffbb2e", "#79f37c"]);

let gridCSS = ref(getResponsiveValue('gridGap1'));
let lockBoltHeight = ref(getResponsiveValue('lockBoltHeight'));
let lockBoltColor = ref(getResponsiveValue('lockBoltColor1'));

const gridCols = computed(() => {
  return {
    gridTemplateColumns: `repeat(${gridSize.value}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${gridSize.value}, minmax(0, 1fr)`,
  }
});

const isMobile = computed(() => window.innerWidth <= 640);

onMounted(() => {
  playTrack('game')
  gameStore.insertLog(1, currentLevelId.value)

  backButtonListenerHandle = App.addListener('backButton', onBackButton);

  getLevelConfig();
  createSortable();
  checkWords();
  setAnimationClasses();
  borderRadiusClasses.value = Array(tiles.value.length).fill('rounded-bl-12pc rounded-tr-12pc rounded-br-12pc rounded-tl-12pc');
});

onUnmounted(() => {
  if (backButtonListenerHandle.value)
    backButtonListenerHandle.value.remove()
});

watch(levelCompleted, (newValue) => {
  // levelCompleted (newValue)
  sortable.option("disabled", newValue);
});

watch(levelFailed, (newValue) => {
  // levelFailed (newValue)
  sortable.option("disabled", newValue);
});

watch(event, async (newAdEvent) => {
  await closeFailedModal(false);
  await delay(100);
  addMoves(newAdEvent.quantity); // after modal is closed add the moves, visible to the user
  extraMovesUsed.value = true;
}, { deep: true });

const getLevelConfig = () => {
  tiles.value = _.cloneDeep(gameStore.currentLevelTiles)
  sortableTiles.value = _.cloneDeep(gameStore.currentLevelTiles)
  gridSize.value = gameStore.gridSize
  remainingMoves.value = gameStore.maxMoves
  validWords.value = gameStore.currentLevelValidWords
}

const onBackButton = () => {
  if (showLoseLifeModal.value)
    closeLoseLifeModal(false)
  else if (!showLevelCompleteModal.value && !hideLevelCompleteModal.value && !showFailedModal.value && !hideFailedModal.value && !levelCompleted.value && !levelFailed.value)
    showLoseLifeModal.value = true
}

const failLevel = async () => {
  if (settings.showAnimations) {
    levelFailed.value = true // disables sortable tile swapping
    await delay(800);
  }

  showFailedModal.value = true
  playTrack('failed')
}

const completeLevel = async () => {
  playSound('levelComplete')
  await gameStore.saveLevelProgress(true, remainingMoves.value, extraMovesUsed.value)

  gameStore.insertLog(2, currentLevelId.value); // Level completed

  if (!settings.value.showAnimations)
    return showLevelCompleteModal.value = true

  levelCompleted.value = true;
  displayBoard.value = false;

  await delay(2300);
  // looks complicated, but it's just a simple calculation to get the correct grid gap for different grid sizes. Otherwise, 5x5 spreads the letters out too far on animation.
  gridCSS.value = 'gap-' + (getResponsiveValue('gridGap2') + 3 - gridSize.value) + ' duration-700 ease-in-out'
  playSound('whoosh')

  await delay(800);
  gridCSS.value = getResponsiveValue('gridGap3') + ' duration-100 ease-in'
  setBorderRadiusClasses();

  await delay(75);
  showCollideEffect.value = true;

  await delay(50);
  playSound('boom')
  vibrateLight()

  await delay(875);
  lockBoltColor.value = getResponsiveValue('lockBoltColor2')

  await delay(1500);
  lockBoltHeight.value = "0";

  await delay(75);
  lockDropShadow.value = "drop-shadow(0 0 40px rgb(251, 163, 69))";
  playSound('metalDong')

  await delay(50);
  vibrateLight()

  let intervalID;
  const totalRemainingMoves = remainingMoves.value
  intervalID = setInterval(async () => {
    if (remainingMoves.value > 0) {
      remainingMoves.value -= 1;
      vibrateLight()
    } else {
      clearInterval(intervalID);
      showLevelCompleteModal.value = true
    }
  }, totalRemainingMoves > 1 ? (1000 / totalRemainingMoves) : 500);
}

const createSortable = () => {
  // If there is an existing sortable instance, destroy it first
  if (sortable)
    sortable.destroy()

  sortable = Sortable.create(gameBoard.value, {
    swap: true,
    swapClass: "highlight",
    dragClass: "dragging",
    animation: 150,
    onStart: handleDragStart,
    onUpdate: handleUpdate,
    onMove: (event) => {
      const distanceThreshold = event.dragged.clientWidth * 1.5;

      // Calculate the distance from the starting position
      const distanceX = Math.abs(event.originalEvent.clientX - initialTilePosition.value.left);
      const distanceY = Math.abs(event.originalEvent.clientY - initialTilePosition.value.top);

      // Log the distances
      // console.log("Distance X:", distanceX);
      // console.log("Distance Y:", distanceY);
      // console.log("Threshold:", distanceThreshold);

      // If the distance is too large, cancel the drag
      if (distanceX > distanceThreshold || distanceY > distanceThreshold)
        return false

      // Save the old and new indices for swapping
      const oldIndex = parseInt(event.dragged.dataset.index, 10);
      const newIndex = parseInt(event.related.dataset.index, 10);

      // Calculate row and column for both oldIndex and newIndex
      const oldIndexRow = Math.floor(oldIndex / gridSize.value);
      const oldIndexCol = oldIndex % gridSize.value;
      const newIndexRow = Math.floor(newIndex / gridSize.value);
      const newIndexCol = newIndex % gridSize.value;

      // Check if the tiles are horizontally or vertically adjacent
      const isAdjacent =
        (Math.abs(newIndexRow - oldIndexRow) === 1 && newIndexCol === oldIndexCol) || // vertically adjacent
        (Math.abs(newIndexCol - oldIndexCol) === 1 && newIndexRow === oldIndexRow); // horizontally adjacent

      // console.log('IS ADJACENT', isAdjacent)
      if (!isAdjacent)
        return false

      handleOnMove(event);
    }
  });
}

const nextLevel = async () => {
  hideLevelCompleteModal.value = true // 25/03/23 - the complete modal only shows if one of these two are true. That might cause issues if there's a split second where they're both false.
  showLevelCompleteModal.value = false

  await delay(700)
  await gameStore.setCurrentLevel(currentLevelId.value + 1)
  router.push({ path: '/', query: { levelUp: true } })
}

const resetLevel = async () => {
  if (showFailedModal.value)
    hideFailedModal.value = true
  else if (showLevelCompleteModal.value)
    hideLevelCompleteModal.value = true

  await delay(1000)
  gameStore.resetLevel()
  router.push('/')
}

const handleOnMove = async (event) => {
  playSound('tileSwap')

  // Save the old and new indices for swapping
  const oldIndex = parseInt(event.dragged.dataset.index, 10);
  const newIndex = parseInt(event.related.dataset.index, 10);

  // Calculate row and column for both oldIndex and newIndex
  const oldIndexRow = Math.floor(oldIndex / gridSize.value);
  const oldIndexCol = oldIndex % gridSize.value;
  const newIndexRow = Math.floor(newIndex / gridSize.value);
  const newIndexCol = newIndex % gridSize.value;

  // Check if the tiles are horizontally or vertically adjacent
  const isAdjacent =
    (Math.abs(newIndexRow - oldIndexRow) === 1 && newIndexCol === oldIndexCol) || // vertically adjacent
    (Math.abs(newIndexCol - oldIndexCol) === 1 && newIndexRow === oldIndexRow); // horizontally adjacent

  if (isAdjacent) {
    // Deduct 1 from the remaining moves, if not the same character
    if (tiles.value[oldIndex].letter !== tiles.value[newIndex].letter) {
      remainingMoves.value -= 1
      vibrateLight()
    } else {
      vibrateMedium()
    }

    // Schedule a swap after the current frame
    requestAnimationFrame(() => {
      // Swap the elements in the tiles array
      [tiles.value[oldIndex], tiles.value[newIndex]] = [tiles.value[newIndex], tiles.value[oldIndex]]

      // Update the data-index attributes of the swapped elements
      event.dragged.setAttribute('data-index', newIndex);
      event.related.setAttribute('data-index', oldIndex);

      // Complete the Sortable operation by simulating a mouseup event
      const mouseUpEvent = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      event.originalEvent.target.dispatchEvent(mouseUpEvent);
    });

    // Return false to cancel the default Sortable behavior
    return false;
  }
}

const handleDragStart = (event) => {
  const rect = event.item.getBoundingClientRect();
  initialTilePosition.value = {
    left: rect.left + window.scrollX + rect.width / 2,
    top: rect.top + window.scrollY + rect.height / 2,
  };
}

const handleDragEnd = (event) => {
  const { newIndex, oldIndex } = event;
  const newIndexRow = Math.floor(newIndex / gridSize.value);
  const newIndexCol = newIndex % gridSize.value;
  const oldIndexRow = Math.floor(oldIndex / gridSize.value);
  const oldIndexCol = oldIndex % gridSize.value;

  const isHorizontalSwap = newIndexRow === oldIndexRow && Math.abs(newIndexCol - oldIndexCol) === 1;
  const isVerticalSwap = newIndexCol === oldIndexCol && Math.abs(newIndexRow - oldIndexRow) === 1;

  if (!isHorizontalSwap && !isVerticalSwap) {
    // Revert the swap if it's not a valid move
    const temp = tiles.value[newIndex];
    tiles.value[newIndex] = tiles.value[oldIndex];
    tiles.value[oldIndex] = temp;
  } else {
    // Properly handle vertical swaps
    if (isVerticalSwap) {
      const temp = tiles.value[newIndex];
      tiles.value[newIndex] = tiles.value[oldIndex];
      tiles.value[oldIndex] = temp;
    }
  }

  checkWords()
}

const checkWords = async () => {
  await delay(25)
  const wordsFound = []

  // Reset isPartOfWord property for all tiles
  sortableTiles.value.forEach((tile, index) => {
    tile.isPartOfWord = false;
  });

  function isAlphabet(char) {
    return /^[A-Z]$/i.test(char);
  }

  const highlightTiles = (word, tiles) => {
    wordsFound.push(word)
    let startIndex = -1;
    for (let i = 0; i < tiles.length; i++) {
      if (tiles.slice(i, i + word.length).map(t => t.letter).join('') === word) {
        // Check the letters before and after the word
        const prevLetter = i > 0 ? tiles[i-1].letter : null;
        const nextLetter = i + word.length < tiles.length ? tiles[i + word.length].letter : null;
        
        // If the letters before and after the word are not part of the word or are not present (null), 
        // then this is not part of another word, so we can highlight it
        if ((!prevLetter || !word.includes(prevLetter)) && (!nextLetter || !word.includes(nextLetter))) {
          startIndex = i;
          break;
        }
      }
    }

    if (startIndex !== -1) {
      word.split('').forEach((letter, index) => {
        const tile = tiles[startIndex + index];
        if (tile) {
          sortableTiles.value.find((t) => t.id === tile.id).isPartOfWord = true
        }
      });
    }
  };

  // Sort valid words by length, from shortest to longest
  const sortedValidWords = validWords.value.sort((a, b) => a.length - b.length);

  // Check the rows for valid words
  for (let rowIndex = 0; rowIndex < gridSize.value; rowIndex++) {
    const rowTiles = tiles.value.slice(rowIndex * gridSize.value, rowIndex * gridSize.value + gridSize.value);
    const rowLetters = rowTiles.map((tile) => tile.letter);
    sortedValidWords.forEach((word) => {
      for (let i = 0; i <= rowLetters.length - word.length; i++) {
        let slicedLetters = rowLetters.slice(i, i + word.length).join('');
        if (slicedLetters === word &&
          (i === 0 || !isAlphabet(rowLetters[i - 1])) && // Check preceding letter
          (i + word.length === rowLetters.length || !isAlphabet(rowLetters[i + word.length]))) { // Check succeeding letter
          console.log(`Found valid word: ${word}`);
          highlightTiles(word, rowTiles.slice(i, i + word.length));
        }
      }
    });
  }

  // Check the columns for valid words
  for (let colIndex = 0; colIndex < gridSize.value; colIndex++) {
    let colTiles = [];
    for (let rowIndex = 0; rowIndex < gridSize.value; rowIndex++) {
      colTiles.push(tiles.value[rowIndex * gridSize.value + colIndex]);
    }
    const colLetters = colTiles.map((tile) => tile.letter);
    sortedValidWords.forEach((word) => {
      for (let i = 0; i <= colLetters.length - word.length; i++) {
        let slicedLetters = colLetters.slice(i, i + word.length).join('');
        if (slicedLetters === word &&
          (i === 0 || !isAlphabet(colLetters[i - 1])) && // Check preceding letter
          (i + word.length === colLetters.length || !isAlphabet(colLetters[i + word.length]))) { // Check succeeding letter
          console.log(`Found valid word: ${word}`);
          highlightTiles(word, colTiles.slice(i, i + word.length));
        }
      }
    });
  }
  
  // Compare previous and current words formed and play sound if new words are formed
  const newWords = wordsFound.filter(word => !wordsFormed.value.includes(word));

  wordsFormed.value = wordsFound

  if (arraysEqual(validWords.value, wordsFormed.value))
    return await completeLevel()
  
  if (newWords.length)
    playSound('wordFormed') 
  
  if (remainingMoves.value <= 0)
    await failLevel()
}

const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

const handleUpdate = (event) => {
  // Save the old and new indices for swapping
  const oldIndex = event.oldIndex;
  const newIndex = event.newIndex;

  // Calculate row and column for both oldIndex and newIndex
  const oldIndexRow = Math.floor(oldIndex / gridSize.value);
  const oldIndexCol = oldIndex % gridSize.value;
  const newIndexRow = Math.floor(newIndex / gridSize.value);
  const newIndexCol = newIndex % gridSize.value;

  // Check if the tiles are horizontally or vertically adjacent
  const isAdjacent =
    (Math.abs(newIndexRow - oldIndexRow) === 1 && newIndexCol === oldIndexCol) || // vertically adjacent
    (Math.abs(newIndexCol - oldIndexCol) === 1 && newIndexRow === oldIndexRow); // horizontally adjacent

  if (!isAdjacent) {
    // Revert the swap if it's not a valid move
    const temp = tiles.value[newIndex];
    tiles.value[newIndex] = tiles.value[oldIndex];
    tiles.value[oldIndex] = temp;
  } else {
    checkWords()
  }
}

const setAnimationClasses = () => {
  animationClasses = Array(tiles.value.length).fill('')

  tiles.value.forEach((tile, index) => {
    if (tile.letter === '')
      animationClasses[index] = `shake-and-fall-${Math.floor(Math.random() * 4) + 1}`
    // else
    //   animationClasses[index] = `slide-right`
  });
}

const setBorderRadiusClasses = () => {
  tiles.value.forEach((tile, index) => {
    // This is important: we use the `tiles` array since that is the one we keep for reference, since the sortableTiles aren't reactive. Tiles are swapped but the array doesn't change.
    // Therefore we MUST get the index of the tile in the sortableTiles array and update the classes at that index.
    const sortableTileIndex = sortableTiles.value.findIndex((sortableTile) => sortableTile.id === tile.id)

    let borderClasses = 'tile-shadow duration-100 rounded-bl-16pc rounded-tr-16pc rounded-br-16pc rounded-tl-16pc ' + tiles.value[index].letter;

    const row = Math.floor(index / gridSize.value);
    const col = index % gridSize.value;

    // Check for a tile on the left
    if (col > 0 && tiles.value[index - 1]?.letter) {
      borderClasses = borderClasses.replace('rounded-bl-16pc', '').replace('rounded-tl-16pc', '');
    }

    // Check for a tile on the right
    if (col < gridSize.value - 1 && tiles.value[index + 1]?.letter) {
      // console.log(index, tiles[index].letter)
      borderClasses = borderClasses.replace('rounded-br-16pc', '').replace('rounded-tr-16pc', '');
    }

    // Check for a tile on the top
    if (row > 0 && tiles.value[index - gridSize.value]?.letter) {
      // console.log(index, tiles[index].letter)
      borderClasses = borderClasses.replace('rounded-tl-16pc', '').replace('rounded-tr-16pc', '');
    }

    // Check for a tile on the bottom
    if (row < gridSize.value - 1 && tiles.value[index + gridSize.value]?.letter) {
      borderClasses = borderClasses.replace('rounded-bl-16pc', '').replace('rounded-br-16pc', '');
    }

    borderRadiusClasses.value[sortableTileIndex] = borderClasses
  });
}

const closeFailedModal = async (resetLevel) => {
  if (resetLevel)
    await gameStore.saveLevelProgress(false, remainingMoves.value, extraMovesUsed.value)
  
  hideFailedModal.value = true

  await delay(700)  // delay should match utility-modal-slide-out time

  showFailedModal.value = false
  hideFailedModal.value = false

  if (resetLevel) {
    gameStore.resetLevel()
    router.push('/')
  } else {
    playTrack('game')
  }
}

const addMoves = async (quantity) => {
  lockTransitionDuration = '200ms' // reduce duration for a nice strobe effect
  let intervalID
  
  intervalID = setInterval(async () => {
    if (quantity > 0) {
      quantity -= 1;
      remainingMoves.value += 1

      lockDropShadow.value = "drop-shadow(0 0 15px rgb(251, 163, 69))";
      await delay(200)
      lockDropShadow.value = "drop-shadow(0 0 0 rgb(251, 163, 69))";

      vibrateLight()
    } else {
      levelFailed.value = false
      clearInterval(intervalID);
    }
  }, 400)
}

const closeLoseLifeModal = async (resetLevel) => {
  if (resetLevel)
    await gameStore.saveLevelProgress(false, remainingMoves.value, extraMovesUsed.value)
  
  hideLoseLifeModal.value = true

  await delay(700)  // delay should match utility-modal-slide-out time

  showLoseLifeModal.value = false
  hideLoseLifeModal.value = false

  if (resetLevel) {
    gameStore.resetLevel()
    router.push('/')
  }
}
</script>

<style>
  /* .tile {
    position: relative;
  }

  .left-shadow {
    position: relative;
  }

  .tile:before {
    content: "";
    position: absolute;
    top: 5%;
    left: 5%;
    width: 90%;
    height: 2px;
    background: white;
    filter: blur(4px);
  }

  .tile:after {
    content: "";
    position: absolute;
    top: 5%;
    right: 5%;
    width: 2px;
    height: 90%;
    background: rgba(106, 106, 106, 0.2);
    filter: blur(4px);
  }

  .left-shadow::after {
    content: "";
    position: absolute;
    top: 5%;
    left: 5%;
    width: 2px;
    height: 90%;
    background: rgba(106, 106, 106, 0.2);
    filter: blur(4px);
  } */


  .lock-size {
    width: 5rem;
    height: 5rem;
  }

  .moves-text {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  /* Using these classes instead of tailwind because board height is a factor of the screen width */
  .board-size {
    width: 90vw;
    height: 90vw;
    padding: 0.75rem;
    border-radius: 0.75rem;
  }

  @media (min-width: 450px) { /* The value 768px is commonly used to target tablets and above */
    .board-size {
      width: 65vw;
      height: 65vw;
    }
  }

  @media (min-width: 768px) { /* The value 768px is commonly used to target tablets and above */
    .board-size {
      width: 65vw;
      height: 65vw;
    }
  }

  @media (max-width: 320px) {
    .board-size {
      width: 70vw;
      height: 70vw;
      padding: 0.3rem;
      border-radius: 0.5rem;
    }

    .lock-size {
      width: 3.5rem;
      height: 3.5rem;
    }

    .moves-text {
      font-size: 1.475rem;
      line-height: 1.2rem;
    }
  }

  @media (-webkit-max-device-pixel-ratio: 2) and (-webkit-min-device-pixel-ratio: 2) and (max-width: 380px) and (max-height: 700px) {
    .board-size {
      width: 80vw;
      height: 80vw;
      padding: 0.6rem;
      border-radius: 0.6rem;
    }
  }


  .highlight {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .dragging {
    display: none !important;
  }

  .grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .glow {
    filter: drop-shadow(0 0 12px rgb(251, 191, 36));
  }

  .lock-bolt {
    position: absolute;
    width: 0.38rem;
    height: 0.8rem;
    bottom: 2.97rem;
    left: 1.39rem;
    transition: background-color 1.3s ease-in-out, max-height 0.125s ease-in;
  }

  @media (min-width: 640px) {
    .lock-bolt {
      position: absolute;
      width: 0.56rem;
      height: 1.28rem;
      bottom: 4.75rem;
      left: 2.23rem;
      transition: background-color 1.3s ease-in-out, max-height 0.125s ease-in;
    }
  }

  @media (min-width: 1024px) {
    .lock-bolt {
      position: absolute;
      width: 0.76rem;
      height: 1.9rem;
      bottom: 6.53rem;
      left: 3.04rem;
      transition: background-color 1.3s ease-in-out, max-height 0.125s ease-in;
    }
  }

  @media (max-width: 320px) {
    .lock-bolt {
      position: absolute;
      width: 0.23rem;
      height: 0.6rem;
      bottom: 2.08rem;
      left: 0.98rem;
      transition: background-color 1.3s ease-in-out, max-height 0.125s ease-in;
    }
  }

  .ripple-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
  }

  .ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60vw;
    height: 60vw;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
    border-radius: 50%;
    opacity: 0;
    transform: translate(-50%, -50%) scale(1);
    animation: ripple 0.4s linear forwards;
  }

  @keyframes ripple {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1);
    }
    20% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(2);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(2.5);
    }
  }



  /* Modal slide in */

  @keyframes modal-slide-in {
    0% {
      transform: translateY(-130vh) rotate(12deg);
    }
    55% {
      transform: translateY(5vh) rotate(-3deg);
    }
    77% {
      transform: translateY(-3vh) rotate(2deg);
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }

  .modal-slide-in {
    animation: modal-slide-in forwards 1.2s ease-in-out;
  }



  /* Modal slide out */

  @keyframes modal-slide-out {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    23% {
      transform: translateY(3vh) rotate(-3deg);
    }
    100% {
      transform: translateY(-130vh) rotate(12deg);
    }
  }

  .modal-slide-out {
    animation: modal-slide-out forwards 0.8s ease-in-out;
  }


  .shake-and-fall-1,
  .shake-and-fall-2,
  .shake-and-fall-3,
  .shake-and-fall-4,
  .shake-and-fall-5,
  .shake-and-fall-6,
  .shake-and-fall-7,
  .shake-and-fall-8,
  .shake-and-fall-9,
  .shake-and-fall-10 {
    animation: shake-and-fall 2.25s ease-out forwards;
  }

  .shake-and-fall-1 {
    animation-delay: 0.5s;
  }

  .shake-and-fall-2 {
    animation-delay: 0.7s;
  }

  .shake-and-fall-3 {
    animation-delay: 0.9s;
  }

  .shake-and-fall-4 {
    animation-delay: 1.1s;
  }

  .shake-and-fall-5 {
    animation-delay: 1.3s;
  }

  .shake-and-fall-6 {
    animation-delay: 1.5s;
  }

  .shake-and-fall-7 {
    animation-delay: 1.7s;
  }

  .shake-and-fall-8 {
    animation-delay: 1.9s;
  }

  .shake-and-fall-9 {
    animation-delay: 2.1s;
  }

  .shake-and-fall-10 {
    animation-delay: 2.3s;
  }

  @keyframes shake-and-fall {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(-5deg); }
    20% { transform: rotate(6deg); }
    30% { transform: rotate(-7deg); }
    40% { transform: rotate(8deg); }
    50% { transform: rotate(-9deg); opacity: 1; }
    60% { transform: rotate(10deg); }
    70% { transform: rotate(-11deg); }
    80% { transform: rotate(12deg); }
    90% { transform: rotate(-15deg); }
    100% { transform: rotate(0deg); opacity: 0; }
  }



  .slide-right {
    animation: slide-right 0.9s ease-in forwards;
    animation-delay: 4s
  }

  /* @keyframes slide-right {
    0% { opacity: 1; transform: translateX(0); }
    100% { opacity: 1; transform: translateX(100vw); }
  } */

  @keyframes slide-right {
    0% {
      opacity: 1;
      transform: translateY(0) rotate(0deg);
    }
    70% {
      opacity: 0;
      transform: translateY();
    }
    100% {
      opacity: 0;
      transform: translateY(20vh) rotate(5deg);
    }
  }



  .slide-down {
    animation: slide-down 1.3s ease-in-out forwards;
    animation-delay: 4.1s;
  }

  @keyframes slide-down {
    0% { transform: translateY(0) scale(1) }
    100% { transform: translateY(18vh) scale(1.25) }
  }



  .slide-down-and-grow {
    animation: slide-down-and-grow 1.3s ease-in-out forwards;
    animation-delay: 4.1s
  }

  @keyframes slide-down-and-grow {
    0% { transform: translateY(0) scale(1) }
    100% { transform: translateY(24vh) scale(2) }
  }



  .hide-board {
    animation: hide-board 2.5s ease-in forwards;
  }

  @keyframes hide-board {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
  </style>

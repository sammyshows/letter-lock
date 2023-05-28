  <template>
    <div class="min-h-screen pt-4 flex flex-col justify-center items-center bg-gradient-to-b from-blue-600 via-blue-400 to-blue-300">
      <div class="z-10 w-full flex px-4">
        <NuxtLink :to="{ path: '/' }">
          <IconsArrowLeft class="h-10 w-10" />
        </NuxtLink>
      </div>
      <div class="z-10 grow">
        <div :class="{ 'slide-down': levelCompleted }" class="text-3xl mb-4 font-bold text-center">LEVEL {{ currentLevelId }}</div>

        <div class="flex justify-center">
          <div :class="{ 'slide-down-and-grow': levelCompleted }" class="relative flex justify-center items-end">
            <IconsLock :style="{ filter: lockDropShadow, transitionDuration: lockTransitionDuration }" class="h-20 w-20 mx-auto text-ll-orange"></IconsLock>
            <div :style="{ maxHeight: lockBoltHeight, backgroundColor: lockBoltColor }" class="lock-bolt"></div>
            <div class="absolute pb-2 text-3xl font-medium">{{ remainingMoves }}</div>
          </div>

          <div v-if="settings.testMode && replayingLevel" :class="{ 'slide-down-and-grow': levelCompleted }" class="relative flex justify-center items-end ml-2">
            <IconsLock class="h-12 w-12 mx-auto text-purple-400 duration-700"></IconsLock>
            <div class="lock-bolt"></div>
            <div class="absolute pb-0.5 text-lg font-medium">{{ remainingMoves - bestRemainingMoves }}</div>
          </div>
        </div>

        <div class="p-4">
          <div :class="{ 'hide-board': !displayBoard }" class="absolute p-3 bg-gray-100 rounded-xl" style="width: 90vw; height: 90vw;"></div>
          <div :class="{ 'slide-right': !displayBoard }" class="p-3" style="width: 90vw; height: 90vw;">
            <div
              ref="gameBoard"
              :class="[ gridCSS ]"
              class="grid mx-auto w-full h-full"
              :style="gridCols"
            >
              <div
                v-for="(tile, index) in sortableTiles"
                :key="tile.id"
                :data-index="index"
                :class="[
                    { 'empty-tile': !tile.letter, 'glow': showCollideEffect },
                    tile.isPartOfWord ? 'z-20 bg-amber-400' : 'bg-gray-200',
                    levelCompleted ? animationClasses[index] : '',
                    borderRadiusClasses ? borderRadiusClasses[index] : ''
                ]"
                class="w-full h-full relative text-blue-700 font-medium text-3xl flex justify-center items-center"
              >
                {{ tile.letter }}
              </div>
            </div>
          </div>

          <div class="mt-6 duration-1000" :class="{ 'opacity-0': !displayBoard }">
            <p v-for="word in validWords" class="text-2xl text-center">{{ word }}</p>
          </div>
        </div>
      </div>

      <div v-show="showCompleteModal || hideCompleteModal" :class="{ 'modal-slide-in': showCompleteModal, 'modal-slide-out': hideCompleteModal }" class="absolute flex flex-col items-center justify-between h-1/2 w-5/6 py-8 z-20 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl">
        <div class="text-ll-orange text-4xl font-bold">
          <p class="word-slide-left">LETTERS</p>
          <p class="word-slide-right">LOCKED</p>
        </div>
        <p class="px-6 text-xl text-slate-600">Nice job - you crushed it! The next has level has been <span class="text-purple-400 font-medium">UNLOCKED!</span></p>
        <div class="flex flex-col justify-center gap-y-2 text-lg" :class="[ settings.testMode ? 'h-28 mt-4' : 'h-12' ]">
          <button v-if="settings.testMode" @click="resetLevel" class="button-pulse self-center rounded-full bg-ll-orange text-white shadow-sm">Retry Level</button>
          <button @click="nextLevel" class="button-pulse self-center rounded-full bg-purple-400 text-white font-medium shadow-sm">Next Level</button>
        </div>
      </div>

      <div v-show="showFailedModal || hideFailedModal" :class="{ 'modal-slide-in': showFailedModal,  'modal-slide-out': hideFailedModal }" class="absolute flex flex-col items-center justify-between h-1/2 w-5/6 py-8 z-20 bg-gradient-to-br from-white to-slate-50 rounded-3xl text-center shadow-xl">
        <div class="relative text-ll-orange text-4xl font-bold">
          <p class="word-slide-left mr-4">LETTERS</p>
          <p class="drop-not absolute bottom-1.5 -left-8 text-2xl text-purple-400 underline underline-offset-2 opacity-0">NOT</p>
          <p class="word-slide-right ml-4">LOCKED</p>
        </div>
        <p class="px-6 text-xl text-slate-600">Oh no! You are so close to locking all the words!</p>
        <div class="flex flex-col justify-center gap-y-2 w-full h-24 text-lg">
          <div class="h-2/5 flex justify-center">
            <button @click="resetLevel" class="my-auto self-center rounded-full bg-red-400 py-1 px-4 text-base text-white shadow-sm">Give Up</button>
          </div>
          <div class="h-3/5 flex justify-center">
            <button @click="resetLevel" class="button-pulse self-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-sm">Watch Ad</button>
          </div>
        </div>
      </div>

      <div :class="[ showFailedModal || showCompleteModal ? 'opacity-1' : 'opacity-0' ]" class="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md duration-700 pointer-events-none z-10"></div>

<!--      <div v-show="showFailedModal" class="absolute flex flex-col justify-center items-center h-1/2 w-5/6 z-20 bg-orange-200 rounded-3xl text-center text-3xl">-->
<!--        <p class="text-slate-700">Bad luck, you failed...</p>-->
<!--        <p class="text-slate-700">It's still all messed up!</p>-->
<!--        <button @click="resetLevel" class="mt-4 px-10 py-2 rounded-lg bg-cyan-600 text-white">Retry</button>-->
<!--      </div>-->

<!--      <div class="ripple-container">-->
<!--        <div :class="{ 'ripple': showCollideEffect }"></div>-->
<!--      </div>-->

<!--      <div class="absolute bottom-20 left-10 duration-700" :class="[ showStamp ? 'opacity-1' : 'opacity-0' ]">-->
<!--        <Stamp />-->
<!--      </div>-->
    </div>
  </template>

  <script>
  import _ from 'lodash'
  import Sortable, { Swap } from "sortablejs";
  import { storeToRefs } from "pinia"
  import { Haptics, ImpactStyle } from '@capacitor/haptics';
  import { useGameStore } from "@/stores/game";
  Sortable.mount(new Swap());

  export default {
    name: "game",

    setup() {
      const gameStore = useGameStore()
      const { currentLevelId, bestRemainingMoves, replayingLevel, settings } = storeToRefs(gameStore)

      return { gameStore, currentLevelId, bestRemainingMoves, replayingLevel, settings }
    },

    data() {
      return {
        tiles: [], // copy of the tiles used internally for monitoring the state/position of tiles. This is manually kept up to date with tile swaps via our code.
        sortableTiles: [], // copy used for sortable. Changes are not made to this array by sortable so tiles could be swapped and this array wouldn't reflect it.
        gridSize: 3,
        remainingMoves: 0,
        validWords: [],
        levelCompleted: false,
        showCompleteModal: false,
        hideCompleteModal: false,
        showFailedModal: false,
        hideFailedModal: false,
        animationClasses: null,
        borderRadiusClasses: null,
        dragging: false,
        initialTilePosition: null,
        showCollideEffect: false,
        displayBoard: true,
        gridCSS: 'gap-2',
        lockBoltHeight: '0.60rem',
        lockBoltColor: '#337aff',
        lockDropShadow: 'drop-shadow(0 0 0 rgb(251, 163, 69))',
        lockTransitionDuration: '700ms', // also gets sets back to 700ms at end of failLevel()
        colors: ["#ff9054", "#22ff32", "#FFF176", "#214aff", "#ffbb2e", "#79f37c"]
      }
    },

    computed: {
      gridCols() {
        return {
          gridTemplateColumns: `repeat(${this.gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${this.gridSize}, minmax(0, 1fr))`,
        }
      },
    },

    mounted() {
      this.getLevelConfig()
      this.createSortable()
      this.checkWords()
      this.setAnimationClasses()
      this.borderRadiusClasses = Array(this.tiles.length).fill('rounded-bl-xl rounded-tr-xl rounded-br-xl rounded-tl-xl')
      // this.failLevel()
    },

    methods: {
      getLevelConfig() {
        this.tiles = _.cloneDeep(this.gameStore.currentLevelTiles)
        this.sortableTiles = _.cloneDeep(this.gameStore.currentLevelTiles)
        this.gridSize = this.gameStore.gridSize
        this.remainingMoves = this.gameStore.maxMoves
        this.validWords = this.gameStore.currentLevelValidWords
      },

      async failLevel() {
        if (!this.settings.showAnimations)
          return this.showFailedModal = true

        this.lockTransitionDuration = '300ms' // reduce duration for a nice strobe effect

        await this.delay(200);
        this.lockDropShadow = "drop-shadow(0 0 15px rgb(251, 163, 69))";

        await this.delay(300);
        this.lockDropShadow = "drop-shadow(0 0 0 rgb(251, 163, 69))";

        await this.delay(300);
        this.lockDropShadow = "drop-shadow(0 0 15px rgb(251, 163, 69))";

        await this.delay(300);
        this.lockDropShadow = "drop-shadow(0 0 0 rgb(251, 163, 69))";

        await this.delay(300);
        this.lockDropShadow = "drop-shadow(0 0 15px rgb(251, 163, 69))";

        await this.delay(300);
        this.lockDropShadow = "drop-shadow(0 0 0 rgb(251, 163, 69))";

        await this.delay(300)
        this.lockTransitionDuration = '700ms' // restore original duration

        await this.delay(300);
        this.showFailedModal = true
      },

      async completeLevel() {
        await this.gameStore.saveLevelProgress(this.remainingMoves)

        if (!this.settings.showAnimations)
          return this.showCompleteModal = true

        this.levelCompleted = true;
        this.displayBoard = false;

        await this.delay(2800);
        this.gridCSS = "gap-5 duration-700 ease-in-out";

        await this.delay(800);
        this.gridCSS = "gap-1 duration-100 ease-in";
        this.setBorderRadiusClasses();

        await this.delay(75);
        this.showCollideEffect = true;

        await this.delay(50);
        await Haptics.impact({ style: ImpactStyle.Light });

        await this.delay(775);
        this.lockBoltColor = "#4C9BFF";

        await this.delay(1500);
        this.lockBoltHeight = "0";

        await this.delay(150);
        this.lockDropShadow = "drop-shadow(0 0 40px rgb(251, 163, 69))";

        await this.delay(50);
        await Haptics.impact({ style: ImpactStyle.Light });

        let intervalID;
        const totalRemainingMoves = this.remainingMoves
        intervalID = setInterval(async () => {
          if (this.remainingMoves > 0) {
            this.remainingMoves -= 1;
            await Haptics.impact({ style: ImpactStyle.Light });
          } else {
            clearInterval(intervalID);
            this.showCompleteModal = true
          }
        }, totalRemainingMoves > 1 ? (1000 / totalRemainingMoves) : 500);
      },

      delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      },

      createSortable() {
        // If there is an existing sortable instance, destroy it first
        if (this.sortable)
          this.sortable.destroy()

        this.sortable = Sortable.create(this.$refs.gameBoard, {
          swap: true,
          swapClass: "highlight",
          dragClass: "dragging",
          animation: 150,
          onStart: this.handleDragStart,
          onUpdate: this.handleUpdate,
          onMove: (event) => {
            const distanceThreshold = event.dragged.clientWidth * 1.5;

            // Calculate the distance from the starting position
            const distanceX = Math.abs(event.originalEvent.clientX - this.initialTilePosition.left);
            const distanceY = Math.abs(event.originalEvent.clientY - this.initialTilePosition.top);

            // Log the distances
            console.log("Distance X:", distanceX);
            console.log("Distance Y:", distanceY);
            console.log("Threshold:", distanceThreshold);

            // If the distance is too large, cancel the drag
            if (distanceX > distanceThreshold || distanceY > distanceThreshold)
              return false

            // Save the old and new indices for swapping
            const oldIndex = parseInt(event.dragged.dataset.index, 10);
            const newIndex = parseInt(event.related.dataset.index, 10);

            // Calculate row and column for both oldIndex and newIndex
            const oldIndexRow = Math.floor(oldIndex / this.gridSize);
            const oldIndexCol = oldIndex % this.gridSize;
            const newIndexRow = Math.floor(newIndex / this.gridSize);
            const newIndexCol = newIndex % this.gridSize;

            // Check if the tiles are horizontally or vertically adjacent
            const isAdjacent =
              (Math.abs(newIndexRow - oldIndexRow) === 1 && newIndexCol === oldIndexCol) || // vertically adjacent
              (Math.abs(newIndexCol - oldIndexCol) === 1 && newIndexRow === oldIndexRow); // horizontally adjacent

            console.log('IS ADJACENT', isAdjacent)
            if (!isAdjacent)
              return false

            this.handleOnMove(event);
          },
        });
      },

      async nextLevel() {
        this.hideCompleteModal = true // 25/03/23 - the complete modal only shows if one of these two are true. That might cause issues if there's a split second where they're both false.
        this.showCompleteModal = false

        await this.delay(1000)
        await this.gameStore.setCurrentLevel(this.currentLevelId + 1)
        this.$router.push({ path: '/', query: { levelUp: true } })
      },

      async resetLevel() {
        if (this.showFailedModal)
          this.hideFailedModal = true
        else if (this.showCompleteModal)
          this.hideCompleteModal = true

        await this.delay(1000)
        this.gameStore.resetLevel()
        this.$router.push('/')
      },

      async handleOnMove(event) {
        // Save the old and new indices for swapping
        const oldIndex = parseInt(event.dragged.dataset.index, 10);
        const newIndex = parseInt(event.related.dataset.index, 10);

        // Calculate row and column for both oldIndex and newIndex
        const oldIndexRow = Math.floor(oldIndex / this.gridSize);
        const oldIndexCol = oldIndex % this.gridSize;
        const newIndexRow = Math.floor(newIndex / this.gridSize);
        const newIndexCol = newIndex % this.gridSize;

        // Check if the tiles are horizontally or vertically adjacent
        const isAdjacent =
          (Math.abs(newIndexRow - oldIndexRow) === 1 && newIndexCol === oldIndexCol) || // vertically adjacent
          (Math.abs(newIndexCol - oldIndexCol) === 1 && newIndexRow === oldIndexRow); // horizontally adjacent

        if (isAdjacent) {
          // Deduct 1 from the remaining moves, if not the same character
          if (this.tiles[oldIndex].letter !== this.tiles[newIndex].letter) {
            this.remainingMoves -= 1
            await Haptics.impact({ style: ImpactStyle.Light });
          } else {
            await Haptics.vibrate({ duration: 25 })
          }

          // Schedule a swap after the current frame
          requestAnimationFrame(() => {
            // Swap the elements in the tiles array
            [this.tiles[oldIndex], this.tiles[newIndex]] = [this.tiles[newIndex], this.tiles[oldIndex]]

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
      },

      handleDragStart(event) {
        const rect = event.item.getBoundingClientRect();
        this.initialTilePosition = {
          left: rect.left + window.scrollX + rect.width / 2,
          top: rect.top + window.scrollY + rect.height / 2,
        };
      },

      handleDragEnd(event) {
        const { newIndex, oldIndex } = event;
        const newIndexRow = Math.floor(newIndex / this.gridSize);
        const newIndexCol = newIndex % this.gridSize;
        const oldIndexRow = Math.floor(oldIndex / this.gridSize);
        const oldIndexCol = oldIndex % this.gridSize;

        const isHorizontalSwap = newIndexRow === oldIndexRow && Math.abs(newIndexCol - oldIndexCol) === 1;
        const isVerticalSwap = newIndexCol === oldIndexCol && Math.abs(newIndexRow - oldIndexRow) === 1;

        if (!isHorizontalSwap && !isVerticalSwap) {
          // Revert the swap if it's not a valid move
          const temp = this.tiles[newIndex];
          this.tiles[newIndex] = this.tiles[oldIndex];
          this.tiles[oldIndex] = temp;
        } else {
          // Properly handle vertical swaps
          if (isVerticalSwap) {
            const temp = this.tiles[newIndex];
            this.tiles[newIndex] = this.tiles[oldIndex];
            this.tiles[oldIndex] = temp;
          }
        }

        this.checkWords()
      },

      async checkWords() {
        await this.delay(25)
        const wordsFormed = []

        // Reset isPartOfWord property for all tiles
        this.sortableTiles.forEach((tile, index) => {
          tile.isPartOfWord = false;
        });

        const highlightTiles = (word, tiles) => {
          wordsFormed.push(word)
          let startIndex = -1;
          for (let i = 0; i < tiles.length; i++) {
            if (tiles.slice(i, i + word.length).map(t => t.letter).join('') === word) {
              startIndex = i;
              break;
            }
          }

          if (startIndex !== -1) {
            word.split('').forEach((letter, index) => {
              const tile = tiles[startIndex + index];
              if (tile) {
                this.sortableTiles.find((t) => t.id === tile.id).isPartOfWord = true
              }
            });
          }
        };


        // Check the rows for valid words
        for (let rowIndex = 0; rowIndex < this.gridSize; rowIndex++) {
          const rowTiles = this.tiles.slice(rowIndex * this.gridSize, rowIndex * this.gridSize + this.gridSize);
          const rowString = rowTiles.map((tile) => tile.letter).join("");
          this.validWords.forEach((word) => {
            if (rowString.includes(word)) {
              console.log(`Found valid word: ${word}`);
              highlightTiles(word, rowTiles);
            }
          });
        }

        // Check the columns for valid words
        for (let colIndex = 0; colIndex < this.gridSize; colIndex++) {
          let colTiles = [];
          for (let rowIndex = 0; rowIndex < this.gridSize; rowIndex++) {
            colTiles.push(this.tiles[rowIndex * this.gridSize + colIndex]);
          }
          const colString = colTiles.map((tile) => tile.letter).join("");
          this.validWords.forEach((word) => {
            if (colString.includes(word)) {
              console.log(`Found valid word: ${word}`);
              highlightTiles(word, colTiles);
            }
          });
        }

        if (this.arraysEqual(this.validWords, wordsFormed))
          await this.completeLevel()
        else if (this.remainingMoves <= 0)
          await this.failLevel()
      },

      arraysEqual(arr1, arr2) {
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
      },

      handleUpdate(event) {
        // Save the old and new indices for swapping
        const oldIndex = event.oldIndex;
        const newIndex = event.newIndex;

        // Calculate row and column for both oldIndex and newIndex
        const oldIndexRow = Math.floor(oldIndex / this.gridSize);
        const oldIndexCol = oldIndex % this.gridSize;
        const newIndexRow = Math.floor(newIndex / this.gridSize);
        const newIndexCol = newIndex % this.gridSize;

        // Check if the tiles are horizontally or vertically adjacent
        const isAdjacent =
          (Math.abs(newIndexRow - oldIndexRow) === 1 && newIndexCol === oldIndexCol) || // vertically adjacent
          (Math.abs(newIndexCol - oldIndexCol) === 1 && newIndexRow === oldIndexRow); // horizontally adjacent

        if (!isAdjacent) {
          // Revert the swap if it's not a valid move
          const temp = this.tiles[newIndex];
          this.tiles[newIndex] = this.tiles[oldIndex];
          this.tiles[oldIndex] = temp;
        } else {
          this.checkWords()
        }
      },

      setAnimationClasses() {
        this.animationClasses = Array(this.tiles.length).fill('')

        this.tiles.forEach((tile, index) => {
          if (tile.letter === '')
            this.animationClasses[index] = `shake-and-fall-${Math.floor(Math.random() * 4) + 1}`
          // else
          //   this.animationClasses[index] = `slide-right`
        });
      },

      setBorderRadiusClasses() {
        this.tiles.forEach((tile, index) => {
          // This is important: we use the `tiles` array since that is the one we keep for reference, since the sortableTiles aren't reactive. Tiles are swapped but the array doesn't change.
          // Therefore we MUST get the index of the tile in the sortableTiles array and update the classes at that index.
          const sortableTileIndex = this.sortableTiles.findIndex((sortableTile) => sortableTile.id === tile.id)

          let borderClasses = 'tile-shadow duration-100 rounded-bl-2xl rounded-tr-2xl rounded-br-2xl rounded-tl-2xl ' + this.tiles[index].letter;

          const row = Math.floor(index / this.gridSize);
          const col = index % this.gridSize;

          // Check for a tile on the left
          if (col > 0 && this.tiles[index - 1]?.letter) {
            borderClasses = borderClasses.replace('rounded-bl-2xl', '').replace('rounded-tl-2xl', '');
          }

          // Check for a tile on the right
          if (col < this.gridSize - 1 && this.tiles[index + 1]?.letter) {
            console.log(index, this.tiles[index].letter)
            borderClasses = borderClasses.replace('rounded-br-2xl', '').replace('rounded-tr-2xl', '');
          }

          // Check for a tile on the top
          if (row > 0 && this.tiles[index - this.gridSize]?.letter) {
            // console.log(index, this.tiles[index].letter)
            borderClasses = borderClasses.replace('rounded-tl-2xl', '').replace('rounded-tr-2xl', '');
          }

          // Check for a tile on the bottom
          if (row < this.gridSize - 1 && this.tiles[index + this.gridSize]?.letter) {
            borderClasses = borderClasses.replace('rounded-bl-2xl', '').replace('rounded-br-2xl', '');
          }

          this.borderRadiusClasses[sortableTileIndex] = borderClasses
          console.log(this.borderRadiusClasses[index])
        });
      },

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

  <style>
  .highlight {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .dragging {
    display: none;
  }

  .grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .glow {
    filter: drop-shadow(0 0 12px rgb(251, 191, 36));
  }

  .lock-bolt {
    position: absolute;
    width: 0.35rem;
    height: 0.8rem;
    bottom: 2.98rem;
    left: 1.39rem;
    transition: background-color 1.3s ease-in-out, max-height 0.2s ease-in;
  }

  /*.ripple-container {*/
  /*  position: fixed;*/
  /*  top: 0;*/
  /*  left: 0;*/
  /*  width: 100vw;*/
  /*  height: 100vh;*/
  /*  pointer-events: none;*/
  /*}*/

  /*.ripple {*/
  /*  position: absolute;*/
  /*  top: 50%;*/
  /*  left: 50%;*/
  /*  width: 200px;*/
  /*  height: 200px;*/
  /*  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 100%);*/
  /*  border-radius: 50%;*/
  /*  opacity: 0;*/
  /*  transform: translate(-50%, -50%) scale(1);*/
  /*  animation: ripple 0.4s linear forwards;*/
  /*}*/

  /*@keyframes ripple {*/
  /*  0% {*/
  /*    opacity: 0;*/
  /*    transform: translate(-50%, -50%) scale(1);*/
  /*  }*/
  /*  20% {*/
  /*    opacity: 1;*/
  /*    transform: translate(-50%, -50%) scale(2);*/
  /*  }*/
  /*  100% {*/
  /*    opacity: 0;*/
  /*    transform: translate(-50%, -50%) scale(2.5);*/
  /*  }*/
  /*}*/


  /* Word Slides */

  @keyframes word-slide-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-16px);
    }
  }

  .word-slide-left {
    animation: word-slide-left forwards 1.3s ease-out;
    animation-delay: 0.3s;
  }


  @keyframes word-slide-right {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(16px);
    }
  }

  .word-slide-right {
    animation: word-slide-right forwards 1.3s ease-out;
    animation-delay: 0.3s;
  }


  /* Dropping the word NOT in the modal :) */

  @keyframes drop-not {
    0% {
      opacity: 1;
      transform: scale(2.5) rotate(12deg);
    }
    20% {
      opacity: 1;
      transform: scale(2.2) rotate(12deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) rotate(12deg);
    }
  }

  .drop-not {
    animation: drop-not forwards 0.3s ease-out;
    animation-delay: 1.7s;
  }


  /* 'Next' button size changer */

  .button-pulse {
    animation: button-pulse 1.5s infinite alternate;
  }

  @keyframes button-pulse {
    0%, 100% {
      padding: 10px 32px;
    }

    50% {
      padding: 11px 38px;
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
    animation: slide-right 0.7s ease-in forwards;
    animation-delay: 4.2s
  }

  @keyframes slide-right {
    0% { opacity: 1; transform: translateX(0); }
    100% { opacity: 1; transform: translateX(100vw); }
  }



  .slide-down {
    animation: slide-down 1.3s ease-in-out forwards;
    animation-delay: 4.5s;
  }

  @keyframes slide-down {
    0% { transform: translateY(0) scale(1) }
    100% { transform: translateY(18vh) scale(1.25) }
  }



  .slide-down-and-grow {
    animation: slide-down-and-grow 1.3s ease-in-out forwards;
    animation-delay: 4.5s
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

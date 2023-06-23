  <template>
    <div :class="[ platform === 'ios' ? 'pt-12' : 'pt-8' ]" class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-700 via-blue-500 to-blue-600">
      <img v-if="isMobile" src="@/assets/images/background.png" alt="background" class="h-full w-full absolute top-0 left-0">
      <img v-else src="@/assets/images/background-large.png" alt="background" class="h-full w-full absolute top-0 left-0">

      <div class="w-full flex justify-between px-4 z-10">
        <IconsArrowLeft @click="showLoseLifeModal = true" class="h-10 w-10 sm:w-20 sm:h-20 sm:ml-3 sm:mt-2" style="touch-action: manipulation;" />

        <div class="relative h-7 w-7 drop-shadow opacity-50 sm:h-14 sm:w-14">
          <IconsHeart class="h-7 w-7 text-red-400 sm:h-14 sm:w-14" />
          <span class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-xs sm:text-3xl font-medium">{{ lives }}</span>
        </div>
      </div>
      <div class="flex flex-col grow z-10">
        <div :class="{ 'slide-down': levelCompleted }" class="flex justify-center items-center text-3xl mt-1 mb-3 font-bold tracking-widest text-center sm:text-5xl lg:text-7xl" style="font-family: 'Luckiest Guy';">LEVEL <span class="ml-3 text-4xl sm:text-6xl lg:ml-7 lg:text-8xl">{{ currentLevelId }}</span></div>

        <div class="flex justify-center">
          <div :class="{ 'slide-down-and-grow': levelCompleted }" class="relative flex justify-center items-end">
            <IconsLock :style="{ filter: lockDropShadow, transitionDuration: lockTransitionDuration }" class="h-20 w-20 mx-auto text-ll-orange sm:h-32 sm:w-32 lg:h-44 lg:w-44"></IconsLock>
            <div :style="{ maxHeight: lockBoltHeight, backgroundColor: lockBoltColor }" class="lock-bolt"></div>
            <div class="absolute pb-2 text-3xl font-medium sm:text-5xl sm:pb-4 lg:text-7xl lg:pb-5">{{ remainingMoves }}</div>
          </div>

          <div v-if="settings.testMode && replayingLevel" :class="{ 'slide-down-and-grow': levelCompleted }" class="relative flex justify-center items-end ml-2">
            <IconsLock class="h-12 w-12 mx-auto text-purple-400 duration-700"></IconsLock>
            <div class="lock-bolt"></div>
            <div class="absolute pb-0.5 text-lg font-medium">{{ remainingMoves - bestRemainingMoves }}</div>
          </div>
        </div>

        <div class="flex flex-col justify-center grow p-4">
          <div class="relative">
            <div :class="{ 'hide-board': !displayBoard }" class="board-size absolute p-3 bg-gray-100 rounded-xl sm:p-4 sm:rounded-2xl lg:p-5 lg:rounded-3xl"></div>
            <div :class="{ 'slide-right': !displayBoard }" class="board-size p-3 sm:p-4 lg:p-5">
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

          <div v-else class="grow flex flex-col justify-center gap-y-2 mt-2 font-medium tracking-wide duration-1000 sm:gap-y-4 lg:mt-2 lg:gap-y-6" :class="{ 'opacity-0': !displayBoard }">
            <div class="flex justify-center gap-x-8">
              <p v-for="word in validWords.slice(0,1).concat(validWords.slice(2,3))" :class="{ 'line-through opacity-40': wordsFormed.includes(word) }" class="text-2xl text-center decoration-slate-200 duration-500 sm:text-4xl lg:text-5xl" style="min-width: 25%;">{{ word }}</p>
            </div>
            <div class="flex justify-center gap-x-8">
              <p v-for="word in validWords.slice(1,2).concat(validWords.slice(3,4))" :class="{ 'line-through opacity-40': wordsFormed.includes(word) }" class="text-2xl text-center decoration-slate-200 duration-500 sm:text-4xl lg:text-5xl" style="min-width: 25%;">{{ word }}</p>
            </div>
            <div class="flex justify-center gap-x-8">
              <p v-for="word in validWords.slice(4)" :class="{ 'line-through opacity-40': wordsFormed.includes(word) }" class="text-2xl text-center decoration-slate-200 duration-500 sm:text-4xl lg:text-5xl" style="min-width: 25%;">{{ word }}</p>
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

  <script>
  import _ from 'lodash'
  import Sortable from "sortablejs";
  import { App } from '@capacitor/app';
  import { Capacitor } from "@capacitor/core"
  import { storeToRefs } from "pinia"
  import { useGameStore } from "@/stores/game";

  export default {
    name: "game",

    setup() {
      const gameStore = useGameStore()

      let { event, currentLevelId, bestRemainingMoves, replayingLevel, settings, lives } = storeToRefs(gameStore)
      lives = JSON.parse(JSON.stringify(lives.value.count))
      currentLevelId = JSON.parse(JSON.stringify(currentLevelId.value))

      return { event, gameStore, currentLevelId, bestRemainingMoves, replayingLevel, settings, lives }
    },

    data() {
      return {
        platform: Capacitor.getPlatform(),
        tiles: [], // copy of the tiles used internally for monitoring the state/position of tiles. This is manually kept up to date with tile swaps via our code.
        sortableTiles: [], // copy used for sortable. Changes are not made to this array by sortable so tiles could be swapped and this array wouldn't reflect it.
        gridSize: 3,
        remainingMoves: 0,
        extraMovesUsed: false,
        validWords: [],
        wordsFormed: [],
        levelCompleted: false,
        levelFailed: false,
        showLevelCompleteModal: false,
        hideLevelCompleteModal: false,
        showLoseLifeModal: false,
        hideLoseLifeModal: false,
        showFailedModal: false,
        hideFailedModal: false,
        animationClasses: null,
        borderRadiusClasses: null,
        dragging: false,
        initialTilePosition: null,
        showCollideEffect: false,
        displayBoard: true,
        gridCSS: this.getResponsiveValue('gridGap1'),
        lockBoltHeight: this.getResponsiveValue('lockBoltHeight'),
        lockBoltColor: this.getResponsiveValue('lockBoltColor1'),
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

      isMobile() {
        return window.innerWidth <= 640;
      }
    },

    created() {
      App.addListener('backButton', this.onBackButton)
    },
    beforeDestroy() {
      App.removeAllListeners()
    },

    mounted() {
      this.getLevelConfig()
      this.createSortable()
      this.checkWords()
      this.setAnimationClasses()
      this.borderRadiusClasses = Array(this.tiles.length).fill('rounded-bl-12pc rounded-tr-12pc rounded-br-12pc rounded-tl-12pc')
    },

    watch: {
      levelCompleted(newValue, oldValue) {
        // levelCompleted (newValue)
        this.sortable.option("disabled", newValue)
      },

      levelFailed(newValue, oldValue) {
        // levelFailed (newValue)
        this.sortable.option("disabled", newValue)
      },

      event: {
        deep: true,
        handler: async function (newAdEvent, oldAdEvent) {
          await this.closeFailedModal(false)

          await this.delay(100)
          this.addMoves(newAdEvent.quantity) // after modal is closed add the moves, visible to the user
          this.extraMovesUsed = true
        }
      },
    },

    methods: {
      getLevelConfig() {
        this.tiles = _.cloneDeep(this.gameStore.currentLevelTiles)
        this.sortableTiles = _.cloneDeep(this.gameStore.currentLevelTiles)
        this.gridSize = this.gameStore.gridSize
        this.remainingMoves = this.gameStore.maxMoves
        this.validWords = this.gameStore.currentLevelValidWords
      },

      onBackButton() {
        if (this.showLoseLifeModal)
          this.closeLoseLifeModal(false)
        else if (!this.showLevelCompleteModal && !this.hideLevelCompleteModal && !this.showFailedModal && !this.hideFailedModal && !this.levelCompleted && !this.levelFailed)
          this.showLoseLifeModal = true
      },

      async failLevel() {
        if (!this.settings.showAnimations)
          return this.showFailedModal = true

        this.levelFailed = true

        await this.delay(1000);
        this.showFailedModal = true
      },

      async completeLevel() {
        await this.gameStore.saveLevelProgress(true, this.remainingMoves, this.extraMovesUsed)

        if (!this.settings.showAnimations)
          return this.showLevelCompleteModal = true

        this.levelCompleted = true;
        this.displayBoard = false;

        await this.delay(2300);
        // looks complicated, but it's just a simple calculation to get the correct grid gap for different grid sizes. OPtherwise, 5x5 spreads the letters out too far on animation.
        this.gridCSS = 'gap-' + (this.getResponsiveValue('gridGap2') + 3 - this.gridSize) + ' duration-700 ease-in-out'

        await this.delay(800);
        this.gridCSS = this.getResponsiveValue('gridGap3') + ' duration-100 ease-in'
        this.setBorderRadiusClasses();

        await this.delay(75);
        this.showCollideEffect = true;

        await this.delay(50);
        this.$vibrateLight()

        await this.delay(875);
        this.lockBoltColor = this.getResponsiveValue('lockBoltColor2')

        await this.delay(1500);
        this.lockBoltHeight = "0";

        await this.delay(75);
        this.lockDropShadow = "drop-shadow(0 0 40px rgb(251, 163, 69))";

        await this.delay(50);
        this.$vibrateLight()

        let intervalID;
        const totalRemainingMoves = this.remainingMoves
        intervalID = setInterval(async () => {
          if (this.remainingMoves > 0) {
            this.remainingMoves -= 1;
            this.$vibrateLight()
          } else {
            clearInterval(intervalID);
            this.showLevelCompleteModal = true
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
            const oldIndexRow = Math.floor(oldIndex / this.gridSize);
            const oldIndexCol = oldIndex % this.gridSize;
            const newIndexRow = Math.floor(newIndex / this.gridSize);
            const newIndexCol = newIndex % this.gridSize;

            // Check if the tiles are horizontally or vertically adjacent
            const isAdjacent =
              (Math.abs(newIndexRow - oldIndexRow) === 1 && newIndexCol === oldIndexCol) || // vertically adjacent
              (Math.abs(newIndexCol - oldIndexCol) === 1 && newIndexRow === oldIndexRow); // horizontally adjacent

            // console.log('IS ADJACENT', isAdjacent)
            if (!isAdjacent)
              return false

            this.handleOnMove(event);
          },
        });
      },

      async nextLevel() {
        this.hideLevelCompleteModal = true // 25/03/23 - the complete modal only shows if one of these two are true. That might cause issues if there's a split second where they're both false.
        this.showLevelCompleteModal = false

        await this.delay(700)
        await this.gameStore.setCurrentLevel(this.currentLevelId + 1)
        this.$router.push({ path: '/', query: { levelUp: true } })
      },

      async resetLevel() {
        if (this.showFailedModal)
          this.hideFailedModal = true
        else if (this.showLevelCompleteModal)
          this.hideLevelCompleteModal = true

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
            this.$vibrateLight()
          } else {
            this.$vibrateMedium()
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

        function isAlphabet(char) {
          return /^[A-Z]$/i.test(char);
        }

        const highlightTiles = (word, tiles) => {
          wordsFormed.push(word)
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
                this.sortableTiles.find((t) => t.id === tile.id).isPartOfWord = true
              }
            });
          }
        };

        // Sort valid words by length, from shortest to longest
        const sortedValidWords = this.validWords.sort((a, b) => a.length - b.length);

        // Check the rows for valid words
        for (let rowIndex = 0; rowIndex < this.gridSize; rowIndex++) {
          const rowTiles = this.tiles.slice(rowIndex * this.gridSize, rowIndex * this.gridSize + this.gridSize);
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
        for (let colIndex = 0; colIndex < this.gridSize; colIndex++) {
          let colTiles = [];
          for (let rowIndex = 0; rowIndex < this.gridSize; rowIndex++) {
            colTiles.push(this.tiles[rowIndex * this.gridSize + colIndex]);
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

        this.wordsFormed = wordsFormed

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

          let borderClasses = 'tile-shadow duration-100 rounded-bl-16pc rounded-tr-16pc rounded-br-16pc rounded-tl-16pc ' + this.tiles[index].letter;

          const row = Math.floor(index / this.gridSize);
          const col = index % this.gridSize;

          // Check for a tile on the left
          if (col > 0 && this.tiles[index - 1]?.letter) {
            borderClasses = borderClasses.replace('rounded-bl-16pc', '').replace('rounded-tl-16pc', '');
          }

          // Check for a tile on the right
          if (col < this.gridSize - 1 && this.tiles[index + 1]?.letter) {
            // console.log(index, this.tiles[index].letter)
            borderClasses = borderClasses.replace('rounded-br-16pc', '').replace('rounded-tr-16pc', '');
          }

          // Check for a tile on the top
          if (row > 0 && this.tiles[index - this.gridSize]?.letter) {
            // console.log(index, this.tiles[index].letter)
            borderClasses = borderClasses.replace('rounded-tl-16pc', '').replace('rounded-tr-16pc', '');
          }

          // Check for a tile on the bottom
          if (row < this.gridSize - 1 && this.tiles[index + this.gridSize]?.letter) {
            borderClasses = borderClasses.replace('rounded-bl-16pc', '').replace('rounded-br-16pc', '');
          }

          this.borderRadiusClasses[sortableTileIndex] = borderClasses
        });
      },

      async closeFailedModal(resetLevel) {
        if (resetLevel)
          await this.gameStore.saveLevelProgress(false, this.remainingMoves, this.extraMovesUsed)
        
        this.hideFailedModal = true

        await this.delay(700)  // delay should match utility-modal-slide-out time

        this.showFailedModal = false
        this.hideFailedModal = false

        if (resetLevel) {
          this.gameStore.resetLevel()
          this.$router.push('/')
        }
      },

      async addMoves(quantity) {
        this.lockTransitionDuration = '200ms' // reduce duration for a nice strobe effect
        let intervalID
        
        intervalID = setInterval(async () => {
          if (quantity > 0) {
            quantity -= 1;
            this.remainingMoves += 1

            this.lockDropShadow = "drop-shadow(0 0 15px rgb(251, 163, 69))";
            await this.delay(200)
            this.lockDropShadow = "drop-shadow(0 0 0 rgb(251, 163, 69))";

            this.$vibrateLight()
          } else {
            this.levelFailed = false
            clearInterval(intervalID);
          }
        }, 400)
      },

      getResponsiveValue(variableName) {
        const values = {
          lockBoltHeight: {
            '': '0.60rem',
            'sm': '0.60rem',
            'md': '0.96rem',
            'lg': '1.536rem'
          },
          lockBoltColor1: {
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
            '': 'gap-2',
            'sm': 'gap-2',
            'md': 'gap-3',
            'lg': 'gap-4'
          },
          gridGap2: { // just the number because it's dynamically changed when set based on gridSize
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
        let screen = '';

        if (currentScreenWidth >= 1536) screen = '2xl';
        else if (currentScreenWidth >= 1280) screen = 'xl';
        else if (currentScreenWidth >= 1024) screen = 'lg';
        else if (currentScreenWidth >= 768) screen = 'md';
        else if (currentScreenWidth >= 640) screen = 'sm';

        return values[variableName][screen];
      },

      async closeLoseLifeModal(resetLevel) {
        if (resetLevel)
          await this.gameStore.saveLevelProgress(false, this.remainingMoves, this.extraMovesUsed)
        
        this.hideLoseLifeModal = true

        await this.delay(700)  // delay should match utility-modal-slide-out time

        this.showLoseLifeModal = false
        this.hideLoseLifeModal = false

        if (resetLevel) {
          this.gameStore.resetLevel()
          this.$router.push('/')
        }
      }
    }
  };
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

  /* Using these classes instead of tailwind because board height is a factor of the screen width */
  .board-size {
    width: 90vw;
    height: 90vw;
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

  @media (max-height: 650px) and (min-width: 260px) {
    .board-size {
      width: 70vw;
      height: 70vw;
    }
  }


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
    width: 200px;
    height: 200px;
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

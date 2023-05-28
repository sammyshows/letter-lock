let levelData = [
  // [['P', 'E', 'T', 'A', 'N', '', '', '', ''], "PAN, PET"]
  // [['', '', '', '', '', '', '', '', ''], ""]
  // [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], ""]
  // [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], ""]

    [['A', 'C', 'T', 'O', 'R', 'R', 'I', 'E', 'D', 'A', 'M', 'I', 'T', '', '', '', '', '', '', '', '', '', '', '', ''], "ADMIT, ACTOR, CRIED"],
  [['F', 'D', 'L', 'U', 'S', 'H', 'S', 'T', 'Y', 'O', 'F', 'E', 'N', '', '', '', '', '', '', '', '', '', '', '', ''], "DUSTY, FLUSH, OFTEN"],
  [['J', 'U', 'I', 'C', 'Y', 'U', 'M', 'P', 'L', 'A', 'N', 'T', 'S', '', '', '', '', '', '', '', '', '', '', '', ''], "JUICY, JUMPS, PLANT"],
  [['S', 'C', 'O', 'R', 'E', 'L', 'O', 'G', 'I', 'N', 'R', 'U', 'H', '', '', '', '', '', '', '', '', '', '', '', ''], "LOGIN, ROUGH, SCORE"],
  [['B', 'A', 'C', 'O', 'N', 'R', 'E', 'A', 'D', 'Y', 'W', 'R', 'L', '', '', '', '', '', '', '', '', '', '', '', ''], "BACON, READY, WORLD"],
  [['Q', 'U', 'E', 'S', 'T', 'A', 'B', 'L', 'E', 'K', 'N', 'I', 'F', 'U', 'I', 'C', 'K', '', '', '', '', '', '', '', ''], "QUEST, QUICK, TABLE, KNIFE"],
  [['N', 'O', 'B', 'L', 'E', 'F', 'I', 'Z', 'Z', 'Y', 'M', 'R', 'C', '', '', '', '', '', '', '', '', '', '', '', ''], "FRIZZY, MERCY, NOBLE"],
  [['A', 'D', 'M', 'I', 'T', 'U', 'S', 'I', 'C', 'S', 'E', 'Z', 'E', '', '', '', '', '', '', '', '', '', '', '', ''], "ADMIT, MUSIC, SEIZE"],
  [['T', 'Y', 'P', 'E', 'A', 'N', 'I', 'C', 'O', 'L', 'V', 'E', '', '', '', '', '', '', '', '', '', '', '', '', ''], "TYPE, OLIVE, PANIC"],
  [['T', 'R', 'U', 'C', 'K', 'J', 'E', 'M', 'B', 'O', 'P', 'T', '', '', '', '', '', '', '', '', '', '', '', '', ''], "JUMBO, KEPT, TRUCK"],
  [['E', 'L', 'F', 'U', 'Z', 'E', 'D', 'I', 'G', 'O', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ELF, FUZED, FIG, GO"],
  [['S', 'P', 'I', 'N', 'E', 'W', 'L', 'Y', 'C', 'O', 'Z', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "SPIN, COZY, NEWLY"],
  [['S', 'O', 'B', 'E', 'G', 'I', 'N', 'T', 'A', 'N', 'S', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "SOB, BEGIN, TANS"],
  [['N', 'I', 'L', 'U', 'C', 'K', 'Y', 'B', 'O', 'Y', 'S', 'A', 'R', 'T', '', '', '', '', '', '', '', '', '', '', ''], "ART, NIL, LUCKY, BOYS"],
  [['M', 'A', 'I', 'L', 'E', 'M', 'O', 'N', 'E', 'F', 'U', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "MAIL, LEMON, ME, FUN"],
  [['M', 'A', 'N', 'O', 'R', 'B', 'O', 'N', 'U', 'S', 'I', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "BONUS, MANOR, IS"],
  [['I', 'R', 'O', 'N', 'Y', 'Q', 'U', 'E', 'T', 'A', 'C', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "IRONY, ACE, QUOTE"],
  [['S', 'A', 'U', 'C', 'E', 'P', 'L', 'S', 'E', 'A', 'H', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ASH, PULSE, SAUCE"],
  [['S', 'U', 'N', 'A', 'V', 'O', 'Y', 'M', 'O', 'I', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "SUN, SAVOY, MOVIE"],
  [['V', 'A', 'C', 'O', 'L', 'S', 'H', 'U', 'T', 'A', 'P', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "LAP, VOCAL, SHOUT"],
  [['L', 'I', 'O', 'N', 'V', 'E', 'R', 'A', 'T', 'H', 'U', 'T', '', '', '', '', '', '', '', '', '', '', '', '', ''], "LION, OVER, RAT, HUT"],
  [['M', 'I', 'N', 'D', 'O', 'E', 'J', 'U', 'G', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "MIND, DOE, JUG"],
  [['B', 'U', 'G', 'I', 'D', 'R', 'A', 'N', 'K', 'O', 'W', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "BUG, BID, DRANK, NOW"],
  [['H', 'O', 'W', 'A', 'T', 'K', 'I', 'E', 'Y', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "HOW, HAT, KIT, KEY"],
  [['O', 'U', 'T', 'W', 'L', 'C', 'A', 'F', 'U', 'P', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "CUP, OUT, OWL, CALF"],
  [['Z', 'I', 'N', 'C', 'D', 'L', 'E', 'G', 'E', 'A', 'S', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "GAS, GEL, IDLE, ZINC"],
  [['C', 'L', 'A', 'W', 'E', 'G', 'P', 'I', 'S', 'U', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "CLAW, LEG, PIGS, PUT"],
  [['T', 'R', 'I', 'P', 'O', 'G', 'U', 'E', 'B', 'L', 'K', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "BULK, TRIP, ROGUE"],
  [['D', 'O', 'A', 'N', 'W', 'H', 'Y', 'E', 'L', 'L', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "AN, DO, WHY, YELL"],
  [['U', 'N', 'C', 'L', 'E', 'T', 'T', 'E', 'R', 'A', 'M', 'P', '', '', '', '', '', '', '', '', '', '', '', '', ''], "UTTER, UNCLE, RAMP"],
  [['J', 'U', 'M', 'B', 'O', 'B', 'E', 'Y', 'S', 'I', 'M', 'P', 'L', '', '', '', '', '', '', '', '', '', '', '', ''], "JUMBO, IMPLY, OBEYS"],
  [['F', 'I', 'L', 'M', 'S', 'D', 'E', 'A', 'L', 'C', 'H', 'E', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ACHE, IDEAL, FILMS"],
  [['R', 'A', 'Y', 'O', 'B', 'E', 'S', 'U', 'I', 'L', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "RAY, ROBES, BUILT"],
  [['I', 'C', 'O', 'N', 'S', 'U', 'L', 'A', 'R', 'G', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "LARGE, ICONS, OUR"],
  [['E', 'P', 'I', 'C', 'S', 'A', 'L', 'P', 'M', 'O', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "EPIC, SCALP, MOP"],
  [['T', 'A', 'M', 'E', 'D', 'B', 'N', 'C', 'H', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "TAMED, BENCH"],
  [['R', 'U', 'G', 'B', 'Y', 'N', 'T', 'I', 'L', 'E', 'F', 'S', '', '', '', '', '', '', '', '', '', '', '', '', ''], "RUGBY, UNTIE, ELFS"],
  [['F', 'I', 'R', 'S', 'T', 'A', 'C', 'E', 'P', 'O', 'U', 'N', 'D', '', '', '', '', '', '', '', '', '', '', '', ''], "ACE, FIRST, POUND"],
  [['W', 'I', 'T', 'C', 'H', 'M', 'A', 'Y', 'O', 'R', 'D', 'E', 'N', 'S', 'E', '', '', '', '', '', '', '', '', '', ''], "DENSE, MAYOR, WITCH"],
  [['H', 'O', 'U', 'R', 'S', 'A', 'M', 'I', 'N', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "HOURS, AS, MIND"],
  [['W', 'H', 'I', 'T', 'E', 'N', 'D', 'S', 'O', 'Y', 'M', 'A', '', '', '', '', '', '', '', '', '', '', '', '', ''], "MAY, SOY, WHITE, END"],
  [['H', 'E', 'A', 'D', 'S', 'P', 'I', 'C', 'H', 'O', 'W', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "HEAD, SPICE, SHOW"],
  [['L', 'I', 'E', 'U', 'N', 'C', 'H', 'S', 'I', 'P', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "LIE, SHIP, LUNCH"],
  [['S', 'E', 'L', 'F', 'L', 'Y', 'J', 'O', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "SELF, FLY, JOY"],
  [['H', 'O', 'N', 'E', 'Y', 'C', 'R', 'O', 'W', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "HONEY, CROW"],
  [['H', 'O', 'S', 'E', 'P', 'A', 'N', 'T', 'S', 'I', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "TIDE, HOSE, PANTS"],
  [['B', 'A', 'R', 'K', 'I', 'D', 'S', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "BARK, KIDS"],
  [['B', 'L', 'I', 'N', 'K', 'E', 'W', 'S', 'A', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "NEW, SAW, BLINK"],
  [['L', 'I', 'M', 'E', 'S', 'K', 'I', 'N', 'T', 'W', 'C', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "LIME, SKIN, TWICE"],
  [['M', 'E', 'U', 'S', 'I', 'C', 'A', 'L', 'P', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ME, SCALP, MUSIC"],
  [['R', 'O', 'C', 'K', 'I', 'N', 'S', 'E', 'M', 'U', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ROCK, RINSE, EMU"],
  [['D', 'I', 'P', 'T', 'F', 'O', 'C', 'U', 'S', 'H', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "DIP, ITCH, FOCUS"],
  [['E', 'A', 'S', 'T', 'R', 'O', 'B', 'N', 'R', 'H', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "EAST, NORTH, ROB"],
  [['L', 'A', 'U', 'G', 'H', 'P', 'O', 'I', 'N', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "LAUGH, POINT"],
  [['T', 'H', 'R', 'O', 'W', 'B', 'E', 'A', 'K', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "BREAK, THROW"],
  [['M', 'E', 'A', 'P', 'U', 'T', 'I', 'N', 'O', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ME, MAP, PUT, TIN, NO"],
  [['I', 'T', 'T', 'O', 'V', 'A', 'G', 'U', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "IT, TO, VAGUE"],
  [['R', 'I', 'G', 'H', 'T', 'L', 'E', 'F', 'B', 'O', 'A', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "BOAR, RIGHT, LEFT"]

]
let levelObj = {}
let par = 30
let maxMoves = 50

// Set these two options
let startKey = 160
let gridSize = 5


// Call formatLevels(levelData).

const formatLevels = (data) => {
  // Step 1: Create an array of grid letters, and an array of words.
  let arrays = [];
  let wordSets = [];

  data.forEach(item => {
    arrays.push(item[0]);
    wordSets.push(item[1]);
  });

  // Step 2: Shuffle the grids.
  let shuffledArrays = arrays.map((a) => shuffleArray(a))

  // Step 3: Format the levels.
  let puzzlesConfig = shuffledArrays.map((grid, index) => createPuzzleConfig(grid, wordSets[index]));

  puzzlesConfig.forEach((p) => {
    levelObj[startKey] = p
    startKey++
  })

  console.log(levelObj);
}





const shuffleArray = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}





const createPuzzleConfig = (grid, validWords) => {
  let tiles = [];
  let idCounter = 1;

  for(let i = 0; i < grid.length; i++) {
    tiles.push({
      id: idCounter++,
      isPartOfWord: false,
      letter: grid[i]
    });
  }

  return {
    gridSize: gridSize,
    maxMoves: maxMoves,
    par: par,
    tiles: tiles,
    validWords: validWords.split(', ').map(word => word.trim())
  };
}

formatLevels(levelData)

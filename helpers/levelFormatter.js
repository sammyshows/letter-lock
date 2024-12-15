const fs = require('fs');

let levelData = [
  // ------------------------- Templates -------------------------
  // [['P', 'E', 'T', 'A', 'N', '', '', '', ''], "PAN, PET"]
  // [['', '', '', '', '', '', '', '', ''], ""]
  // [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], ""]
  // [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], ""]


  // ------------------------- Levels 257 - 300 -------------------------
  // ------------------------- 10 * 3 x 3 -------------------------
  [['C', 'A', 'R', 'E', 'P', 'P', 'O', '', ''], "CAR, POP, REP"],
  [['O', 'A', 'K', 'X', 'E', '', '', '', ''], "OAK, AXE"],
  [['O', 'U', 'T', 'A', 'X', '', '', '', ''], "TAX, OUT"],
  [['B', 'I', 'T', 'U', 'T', 'H', 'E', '', ''], "BIT, THE, TUB"],
  [['A', 'T', 'O', 'N', '', '', '', '', ''], "AT, TO, ON"],
  [['I', 'T', 'O', 'W', 'N', '', '', '', ''], "ON, IT, TWO"],
  [['A', 'C', 'E', 'I', 'Y', '', '', '', ''], "ICY, ACE"],
  [['J', 'A', 'W', 'H', 'I', 'P', '', '', ''], "JAW, HIP"],
  [['O', 'U', 'R', 'P', '', '', '', '', ''], "UP, OUR"],
  [['C', 'A', 'N', 'U', 'T', 'I', 'S', '', ''], "SIT, NUT, CAN"],
  [['Y', 'B', 'U', 'S', 'I', '', '', '', ''], "BUS, IS, BY"],
  [['P', 'P', 'O', 'I', 'E', '', '', '', ''], "POP, PIE"],
  [['I', 'N', 'A', 'S', 'P', '', '', '', ''], "NAP, AS, IN"],
  [['S', 'O', 'E', 'A', 'N', '', '', '', ''], "SO, AN, SEA"],
  [['E', 'K', 'L', 'A', 'S', '', '', '', ''], "ASK, ELK"],
  [['P', 'A', 'Y', 'N', 'E', 'W', '', '', ''], "NEW, PAY"],
  [['A', 'W', 'E', 'M', 'O', '', '', '', ''], "AWE, MOW"],
  [['E', 'N', 'D', 'I', 'B', '', '', '', ''], "NIB, END"],
  [['F', 'O', 'G', 'I', 'X', 'Y', 'M', '', ''], "GYM, FOG, GIX"],
  [['S', 'I', 'P', 'E', 'A', '', '', '', ''], "PEA, SIP"],
  [['E', 'L', 'F', 'I', 'X', '', '', '', ''], "ELF, FIX"],
  [['C', 'O', 'W', 'L', 'D', '', '', '', ''], "COD, OWL"],
  [['J', 'A', 'W', 'E', 'T', '', '', '', ''], "WET, JAW"],
  [['A', 'R', 'C', 'D', 'R', '', '', '', ''], "DRY, ARC"],
  [['A', 'I', 'R', 'N', 'K', '', '', '', ''], "AIR, INK"],
  [['A', 'N', 'Y', 'E', 'S', '', '', '', ''], "ANY, YES"],
  [['L', 'O', 'G', 'I', 'N', '', '', '', ''], "GIN, LOG"],
  [['T', 'U', 'G', 'O', 'Y', '', '', '', ''], "TOY, TUG"],
  [['S', 'E', 'E', 'N', 'D', '', '', '', ''], "END, SEE"],
  [['G', 'A', 'P', 'I', 'E', '', '', '', ''], "PIE, GAP"],
  [['B', 'E', 'D', 'R', 'A', '', '', '', ''], "RED, BAD"],
  [['E', 'C', 'O', 'A', 'T', '', '', '', ''], "ACT, ECO"],
  [['S', 'E', 'W', 'T', 'O', '', '', '', ''], "TWO, SEW"],
  [['A', 'R', 'M', 'I', 'M', '', '', '', ''], "AIM, ARM"],
  [['T', 'A', 'G', 'H', 'D', 'O', '', '', ''], "HAD, TAG, GO"],

  // ------------------------- 50 * 4 x 4 -------------------------
  [['M', 'A', 'T', 'E', 'E', 'I', 'S', '', '', '', '', '', '', '', '', ''], "MATE, SITE"],
  [['Z', 'O', 'N', 'E', 'F', 'A', 'R', 'N', '', '', '', '', '', '', '', ''], "EARN, OF, ZONE"],
  [['S', 'L', 'A', 'B', 'H', 'R', 'P', '', '', '', '', '', '', '', '', ''], "HARP, SLAB"],
  [['E', 'C', 'H', 'O', 'U', 'P', 'O', 'N', '', '', '', '', '', '', '', ''], "UPON, ECHO"],
  [['H', 'I', 'A', 'N', 'G', 'C', 'E', 'T', '', '', '', '', '', '', '', ''], "HANG, HI, CENT"],
  [['V', 'E', 'T', 'A', 'G', 'O', '', '', '', '', '', '', '', '', '', ''], "TAG, VET, GO"],
  [['O', 'I', 'L', 'E', 'F', 'T', 'A', '', '', '', '', '', '', '', '', ''], "OIL, LEFT, AT"],
  [['W', 'I', 'F', 'E', 'S', 'T', 'M', '', '', '', '', '', '', '', '', ''], "STEM, WIFE"],
  [['M', 'I', 'X', 'T', 'T', 'E', 'O', '', '', '', '', '', '', '', '', ''], "MIX, TEXT, TO"],
  [['C', 'R', 'E', 'W', 'A', 'T', 'A', 'S', '', '', '', '', '', '', '', ''], "CAT, CREW, WAS"],
  [['H', 'O', 'L', 'D', 'K', 'A', 'W', '', '', '', '', '', '', '', '', ''], "HAWK, HOLD"],
  [['T', 'O', 'H', 'E', 'D', 'G', 'E', '', '', '', '', '', '', '', '', ''], "TO, EDGE, THE"],
  [['U', 'S', 'E', 'D', 'I', 'V', 'E', 'Z', 'O', 'N', '', '', '', '', '', ''], "DIVE, USED, ZONE"],
  [['L', 'I', 'O', 'N', 'M', 'O', 'R', 'E', '', '', '', '', '', '', '', ''], "MORE, LION"],
  [['P', 'O', 'R', 'T', 'S', 'C', 'A', '', '', '', '', '', '', '', '', ''], "SCAR, PORT"],
  [['R', 'I', 'C', 'H', 'O', 'C', 'K', 'I', 'N', '', '', '', '', '', '', ''], "KIN, ROCK, RICH"],
  [['O', 'I', 'N', 'K', 'B', 'E', 'Y', 'A', 'P', '', '', '', '', '', '', ''], "OBEY, NAP, OINK"],
  [['A', 'I', 'M', 'E', 'N', 'U', 'P', '', '', '', '', '', '', '', '', ''], "UP, MENU, AIM"],
  [['D', 'A', 'W', 'N', 'C', 'I', 'D', '', '', '', '', '', '', '', '', ''], "ACID, DAWN"],
  [['A', 'L', 'L', 'R', 'C', 'E', 'E', 'N', 'S', '', '', '', '', '', '', ''], "LENS, ALL, ACRE"],
  [['S', 'K', 'I', 'P', 'S', 'I', 'P', '', '', '', '', '', '', '', '', ''], "SKIN, SKIP"],
  [['L', 'A', 'Z', 'Y', 'O', 'K', 'E', '', '', '', '', '', '', '', '', ''], "YOKE, LAZY"],
  [['J', 'E', 'R', 'K', 'H', 'E', 'B', '', '', '', '', '', '', '', '', ''], "HERB, JERK"],
  [['O', 'N', 'O', 'T', 'H', 'E', 'B', 'D', '', '', '', '', '', '', '', ''], "NO, ON, THE, BED"],
  [['I', 'F', 'C', 'O', 'N', 'L', 'C', 'K', '', '', '', '', '', '', '', ''], "IF, LOCK, ICON"],
  [['H', 'O', 'U', 'R', 'W', 'A', 'S', 'H', '', '', '', '', '', '', '', ''], "WASH, HOUR"],
  [['V', 'I', 'E', 'W', 'A', 'Y', 'P', 'R', 'A', '', '', '', '', '', '', ''], "PRAY, WAY, VIEW"],
  [['Z', 'E', 'R', 'O', 'R', 'E', 'F', '', '', '', '', '', '', '', '', ''], "ZERO, REEF"],
  [['S', 'I', 'N', 'O', 'U', 'L', 'R', 'B', 'S', '', '', '', '', '', '', ''], "RUBS, SIN, SOUL"],
  [['P', 'O', 'P', 'A', 'T', 'H', 'I', 'S', '', '', '', '', '', '', '', ''], "HIS, POP, PATH"],
  [['S', 'H', 'O', 'E', 'L', 'A', 'N', 'I', '', '', '', '', '', '', '', ''], "IN, SHOE, LOAN"],
  [['W', 'I', 'N', 'G', 'O', 'O', 'D', 'U', 'E', '', '', '', '', '', '', ''], "WOOD, DUE, WING"],
  [['A', 'T', 'E', 'I', 'N', 'Y', 'E', 'S', '', '', '', '', '', '', '', ''], "TINY, YES, ATE"],
  [['S', 'H', 'O', 'W', 'T', 'I', 'N', 'I', '', '', '', '', '', '', '', ''], "IN, SHOW, THIN"],
  [['S', 'T', 'A', 'R', 'I', 'D', 'E', 'B', 'E', '', '', '', '', '', '', ''], "BEE, STAR, RIDE"],
  [['H', 'U', 'G', 'E', 'U', 'G', '', '', '', '', '', '', '', '', '', ''], "HUGE, HUG"],
  [['C', 'R', 'A', 'B', 'W', 'E', 'R', '', '', '', '', '', '', '', '', ''], "WEAR, CRAB"],
  [['S', 'A', 'F', 'E', 'I', 'B', 'Y', '', '', '', '', '', '', '', '', ''], "SAFE, BY, FIB"],
  [['A', 'P', 'P', 'I', 'N', 'K', 'S', 'O', 'G', '', '', '', '', '', '', ''], "PINK, SONG, APP"],
  [['M', 'I', 'N', 'T', 'O', 'W', 'N', 'W', 'A', 'R', '', '', '', '', '', ''], "WARN, MINT, TOWN"],
  [['U', 'S', 'I', 'L', 'K', 'O', 'T', 'A', '', '', '', '', '', '', '', ''], "AT, SILK, US, LOT"],
  [['T', 'O', 'E', 'S', 'A', 'Y', 'N', 'E', 'K', '', '', '', '', '', '', ''], "STAY, NECK, TOE"],
  [['O', 'R', 'E', 'X', 'I', 'T', 'G', 'A', 'N', '', '', '', '', '', '', ''], "GAIN, ORE, EXIT"],
  [['J', 'U', 'G', 'E', 'E', 'P', 'V', 'R', 'Y', '', '', '', '', '', '', ''], "JEEP, VERY, JUG"],
  [['M', 'Y', 'O', 'S', 'T', 'U', 'L', 'Y', 'P', 'E', '', '', '', '', '', ''], "MY, TYPE, MOST, RULE"],
  [['J', 'A', 'D', 'E', 'H', 'S', 'P', 'U', '', '', '', '', '', '', '', ''], "UP, JADE, HASP"],
  [['S', 'O', 'Y', 'A', 'R', 'D', 'L', 'E', 'S', '', '', '', '', '', '', ''], "SLED, SOY, YARD"],
  [['H', 'I', 'M', 'U', 'C', 'H', 'I', '', '', '', '', '', '', '', '', ''], "HI, HIM, MUCH"],
  [['E', 'N', 'D', 'V', 'I', 'F', 'O', 'U', 'R', '', '', '', '', '', '', ''], "END, FIVE, FOUR"],
  [['J', 'O', 'L', 'T', 'A', 'I', 'L', 'B', 'E', '', '', '', '', '', '', ''], "BELL, JOLT, TAIL"],
  [['K', 'W', 'H', 'E', 'N', 'O', 'W', 'H', 'Y', '', '', '', '', '', '', ''], "KNOW, WHEN, WHY"],

  // ------------------------- 40 * 5 x 5 -------------------------
  [['L', 'I', 'P', 'A', 'S', 'T', 'S', 'K', 'Y', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "LIP, SKY, PASTS"],
  [['H', 'A', 'N', 'D', 'I', 'E', 'T', 'F', 'R', 'O', 'N', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "DIET, HAND, FRONT"],
  [['G', 'I', 'A', 'N', 'T', 'E', 'E', 'M', 'Y', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "GIANT, ENEMY"],
  [['T', 'E', 'M', 'P', 'O', 'S', 'Q', 'U', 'A', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "SQUAD, TEMPO"],
  [['R', 'A', 'T', 'I', 'O', 'C', 'E', 'A', 'N', 'P', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "PEA, OCEAN, RATIO"],
  [['G', 'R', 'E', 'Y', 'R', 'I', 'E', 'F', 'D', 'L', 'A', 'Y', '', '', '', '', '', '', '', '', '', '', '', '', ''], "GREY, DELAY, GRIEF"],
  [['F', 'R', 'U', 'I', 'T', 'A', 'G', 'U', 'E', 'O', 'L', 'D', '', '', '', '', '', '', '', '', '', '', '', '', ''], "FRUIT, TOLD, ARGUE"],
  [['N', 'A', 'C', 'H', 'O', 'J', 'U', 'S', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "JOUST, NACHO"],
  [['F', 'I', 'X', 'L', 'O', 'A', 'T', 'E', 'X', 'A', 'C', 'T', '', '', '', '', '', '', '', '', '', '', '', '', ''], "FLOAT, EXACT, FIX"],
  [['F', 'L', 'O', 'A', 'D', 'B', 'R', 'W', 'N', 'Y', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "FLOAD, BROWN, DYE"],
  [['R', 'E', 'D', 'B', 'L', 'U', 'I', 'G', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "BIG, BLUE, RED"],
  [['D', 'A', 'B', 'E', 'L', 'O', 'W', 'I', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "WIT, DAB, ELBOW"],
  [['P', 'U', 'N', 'E', 'T', 'A', 'L', 'O', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "OLD, PETAL, PUN"],
  [['A', 'R', 'O', 'M', 'A', 'O', 'U', 'N', 'T', 'P', 'I', 'C', 'R', '', '', '', '', '', '', '', '', '', '', '', ''], "CRU, PIT, MOUNT, AROMA"],
  [['N', 'I', 'G', 'H', 'T', 'D', 'R', 'U', 'P', 'O', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "NIGHT, ROUTE, POT"],
  [['L', 'Y', 'R', 'I', 'C', 'O', 'U', 'T', 'E', 'N', 'W', 'S', '', '', '', '', '', '', '', '', '', '', '', '', ''], "NEWS, LYRIC, ROUTE"],
  [['T', 'H', 'R', 'E', 'E', 'W', 'O', 'N', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ONE, TWO, THREE"],
  [['H', 'U', 'M', 'S', 'E', 'R', 'A', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "AT, USE, ERA, HUM"],
  [['Z', 'E', 'B', 'R', 'A', 'L', 'D', 'Y', 'I', 'N', 'K', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "LADY, ZINK, ZEBRA"],
  [['E', 'L', 'B', 'O', 'W', 'A', 'C', 'O', 'N', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ELBOW, BACON"],
  [['B', 'E', 'N', 'C', 'H', 'W', 'I', 'D', 'Y', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "WINDY, BENCH"],
  [['A', 'L', 'I', 'V', 'E', 'D', 'A', 'D', 'O', 'K', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ALIVE, DEAD, OK"],
  [['L', 'E', 'M', 'O', 'N', 'I', 'F', 'E', 'A', 'R', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "EAR, LIFE, LEMON"],
  [['W', 'I', 'L', 'D', 'O', 'C', 'K', 'S', 'A', 'R', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ARC, WILD, DOCKS"],
  [['D', 'I', 'S', 'C', 'E', 'L', 'L', 'O', 'P', 'I', 'A', 'N', '', '', '', '', '', '', '', '', '', '', '', '', ''], "PIANO, CELLO, DISC"],
  [['J', 'A', 'B', 'O', 'K', 'E', 'R', 'O', 'I', 'G', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "JAB, OK, RIG, JOKER"],
  [['M', 'A', 'Y', 'B', 'E', 'U', 'S', 'T', 'O', 'L', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "TOLD, MUST, MAYBE"],
  [['I', 'F', 'A', 'T', 'E', 'D', 'S', 'I', 'R', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "DESIR, FATE, IF"],
  [['S', 'A', 'U', 'C', 'E', '', 'Y', 'M', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "YUM, SAUCE"],
  [['J', 'O', 'I', 'N', 'T', 'L', 'Y', 'A', 'L', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "JOINT, LOYAL"],
  [['W', 'I', 'L', 'L', 'O', 'V', 'E', 'G', 'R', 'A', 'C', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "GRACE, LOVE, WILL"],
  [['P', 'L', 'A', 'Y', 'G', 'M', 'E', 'S', 'N', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "PLAY, GAMES, END"],
  [['C', 'A', 'L', 'L', 'P', 'H', 'O', 'N', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "PHONE, CALL"],
  [['G', 'I', 'L', 'T', 'R', 'Y', 'V', 'O', 'C', 'E', 'U', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "VOICE, TRY, GUILT"],
  [['S', 'A', 'W', 'O', 'O', 'N', 'E', 'X', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "SAW, SOON, NEXT"],
  [['M', 'I', 'L', 'K', 'D', 'A', 'R', 'Y', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "DAIRY, MILK"],
  [['M', 'E', 'A', 'N', 'O', 'D', 'V', 'I', 'L', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "NO, MEAN, DEVIL"],
  [['B', 'R', 'R', 'Y', 'E', 'R', 'R', 'O', 'R', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "BERRY, ERROR"],
  [['C', 'R', 'O', 'W', 'D', 'A', 'M', 'S', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "SEW, ARM, CROWD"],
  [['H', 'I', 'M', 'A', 'L', 'E', 'S', 'O', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "OLD, MALES, HIM"],
  [['T', 'W', 'I', 'S', 'T', 'O', 'R', 'L', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "WORLD, TWIST"]
]
let levelObj = {}
let par = 30
let maxMoves = 50

// Set these two options
let startKey = 257


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

  return levelObj
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
  let gridSize = Math.sqrt(grid.length); // Calculate grid size dynamically

  for (let i = 0; i < grid.length; i++) {
    tiles.push({
      id: idCounter++,
      isPartOfWord: false,
      letter: grid[i] || "" // Ensure empty tiles are handled
    });
  }

  return {
    gridSize,
    maxMoves,
    par,
    tiles,
    validWords: validWords.split(', ').map(word => word.trim())
  };
};






const newLevels = formatLevels(shuffleArray(levelData))

// Prepare the output as a string in the required TypeScript format
const outputString = `
  import { IndexedLevelData } from "@/types/types";
  const newLevels: IndexedLevelData = ${JSON.stringify(newLevels, null, 2)}`

// Write the output to a new TypeScript file
fs.writeFile('helpers/newLevelsArrays.ts', outputString, (err) => {
  if (err) {
  console.error('Error writing to file:', err);
  } else {
  console.log('Successfully wrote to helpers/newLevelsArrays.ts');
  }
});

const fs = require('fs');

let levelData = [
  // [['P', 'E', 'T', 'A', 'N', '', '', '', ''], "PAN, PET"]
  // [['', '', '', '', '', '', '', '', ''], ""]
  // [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], ""]
  // [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], ""]

  // Below 55 have been added to the game (202 - 256)
  // [['B', 'A', 'C', 'O', 'N', 'R', 'E', 'A', 'D', 'Y', 'W', 'R', 'L', '', '', '', '', '', '', '', '', '', '', '', ''], "BACON, READY, WORLD"],
  // [['T', 'Y', 'P', 'E', 'A', 'N', 'I', 'C', 'O', 'L', 'V', 'E', '', '', '', '', '', '', '', '', '', '', '', '', ''], "TYPE, OLIVE, PANIC"],
  // [['T', 'R', 'U', 'C', 'K', 'J', 'E', 'M', 'B', 'O', 'P', 'T', '', '', '', '', '', '', '', '', '', '', '', '', ''], "JUMBO, KEPT, TRUCK"],
  // [['S', 'A', 'U', 'C', 'E', 'P', 'L', 'S', 'E', 'A', 'H', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ASH, PULSE, SAUCE"],
  // [['M', 'I', 'N', 'D', 'O', 'E', 'J', 'U', 'G', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "MIND, DOE, JUG"],
  // [['Z', 'I', 'N', 'C', 'D', 'L', 'E', 'G', 'E', 'A', 'S', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "GAS, GEL, IDLE, ZINC"],
  // [['C', 'L', 'A', 'W', 'E', 'G', 'P', 'I', 'S', 'U', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "CLAW, LEG, PIGS, PUT"],
  // [['D', 'O', 'A', 'N', 'W', 'H', 'Y', 'E', 'L', 'L', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "AN, DO, WHY, YELL"],
  // [['J', 'U', 'M', 'B', 'O', 'B', 'E', 'Y', 'S', 'I', 'M', 'P', 'L', '', '', '', '', '', '', '', '', '', '', '', ''], "JUMBO, IMPLY, OBEYS"],
  // [['F', 'I', 'L', 'M', 'S', 'D', 'E', 'A', 'L', 'C', 'H', 'E', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ACHE, IDEAL, FILMS"],
  // [['R', 'A', 'Y', 'O', 'B', 'E', 'S', 'U', 'I', 'L', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "RAY, ROBES, BUILT"],
  // [['I', 'C', 'O', 'N', 'S', 'U', 'L', 'A', 'R', 'G', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "LARGE, ICONS, OUR"],
  // [['E', 'P', 'I', 'C', 'S', 'A', 'L', 'P', 'M', 'O', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "EPIC, SCALP, MOP"],
  // [['T', 'A', 'M', 'E', 'D', 'B', 'N', 'C', 'H', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "TAMED, BENCH"],
  // [['W', 'I', 'T', 'C', 'H', 'M', 'A', 'Y', 'O', 'R', 'D', 'E', 'N', 'S', 'E', '', '', '', '', '', '', '', '', '', ''], "DENSE, MAYOR, WITCH"],
  // [['H', 'O', 'U', 'R', 'S', 'A', 'M', 'I', 'N', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "HOURS, AS, MIND"],
  // [['H', 'E', 'A', 'D', 'S', 'P', 'I', 'C', 'H', 'O', 'W', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "HEAD, SPICE, SHOW"],
  // [['L', 'A', 'U', 'G', 'H', 'P', 'O', 'I', 'N', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "LAUGH, POINT"],
  // [['R', 'I', 'G', 'H', 'T', 'L', 'E', 'F', 'B', 'O', 'A', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "BOAR, RIGHT, LEFT"],
  // [['B', 'I', 'D', 'R', 'E', '', '', '', ''], "BID, IRE"],
  // [['J', 'A', 'W', 'P', 'W', '', '', '', ''], "JAW, PAW"],
  // [['M', 'E', 'N', 'T', 'A', '', '', '', ''], "MEN, TAN"],
  // [['R', 'O', 'D', 'Y', 'E', 'Y', 'E', '', ''], "ROD, RYE, RYE"],
  // [['S', 'K', 'I', 'I', 'N', 'T', '', '', ''], "SKI, INK, IT"],
  // [['P', 'E', 'G', 'T', 'E', '', '', '', ''], "PEG, TEE"],
  // [['Z', 'A', 'P', 'R', 'C', 'I', 'Y', '', ''], "ZAP, ARC, ICY"],
  // [['H', 'O', 'W', 'W', 'O', 'C', 'O', '', ''], "HOW, WOW, COW"],
  // [['J', 'U', 'G', 'U', 'M', '', '', '', ''], "JUG, GUM"],
  // [['N', 'O', 'R', 'I', 'P', 'S', 'I', '', ''], "RIP, SIP, NOR"],
  // [['Z', 'O', 'O', 'T', 'W', '', '', '', ''], "TWO, ZOO"],
  // [['T', 'A', 'B', 'A', 'N', 'I', 'N', '', ''], "TAB, BAN, INN"],
  // [['A', 'M', 'E', 'W', 'E', '', '', '', ''], "EW, AM, WE, ME"],
  // [['W', 'R', 'Y', 'S', 'A', '', '', '', ''], "WRY, SAY"],
  // [['W', 'A', 'G', 'A', 'S', 'I', 'S', '', ''], "WAG, SIS, GAS"],
  // [['N', 'O', 'U', 'N', 'T', 'U', 'R', '', '', '', '', '', '', '', '', ''], "NOUN, TURN"],
  // [['O', 'A', 'T', 'H', 'P', 'I', 'L', 'L', 'I', 'L', '', '', '', '', '', ''], "OATH, PILL, HILL"],
  // [['N', 'U', 'M', 'B', 'T', 'A', 'T', 'O', 'O', '', '', '', '', '', '', ''], "NUMB, TOOT, BAT"],
  // [['M', 'O', 'R', 'E', 'E', 'A', 'D', '', 'A', 'I', '', '', '', '', '', ''], "MORE, READ, AID"],
  // [['A', 'G', 'E', 'D', 'E', 'A', 'R', 'O', 'O', 'P', '', '', '', '', '', ''], "POOR, DEAR, AGED"],
  // [['S', 'P', 'U', 'R', 'S', 'E', 'R', 'P', 'U', 'E', '', '', '', '', '', ''], "SPUR, USER, PURE"],
  // [['J', 'U', 'N', 'K', 'I', 'N', 'U', 'R', '', '', '', '', '', '', '', ''], "JUNK, KIN, URN"],
  // [['W', 'O', 'L', 'F', 'L', 'E', 'W', 'F', 'L', 'O', '', '', '', '', '', ''], "FLEW, FLOW, WOLF"],
  // [['J', 'A', 'Z', 'Z', 'I', 'N', 'C', 'L', 'U', 'K', '', '', '', '', '', ''], "JAZZ, ZINC, LUCK"],
  // [['L', 'E', 'E', 'K', 'N', 'E', 'E', '', '', '', '', '', '', '', '', ''], "LEEK, KNEE"],
  // [['L', 'O', 'F', 'T', 'G', 'R', 'E', 'H', 'Y', '', '', '', '', '', '', ''], "LOFT, THY, OGRE"],
  // [['J', 'A', 'D', 'E', 'G', 'G', 'H', 'O', '', '', '', '', '', '', '', ''], "JADE, EGG, HOG"],
  // [['L', 'O', 'R', 'E', 'O', 'S', 'E', 'P', 'A', 'S', '', '', '', '', '', ''], "LORE, ROSE, PASS"],
  // [['K', 'I', 'N', 'G', 'J', 'A', 'C', 'K', 'I', 'E', '', '', '', '', '', ''], "KING, JACK, NICE"],
  // [['L', 'O', 'A', 'F', 'O', 'O', 'L', 'I', 'D', '', '', '', '', '', '', ''], "LOAF, FOOL, LID"],
  // [['J', 'O', 'K', 'E', 'I', 'D', 'O', 'E', '', '', '', '', '', '', '', ''], "JOKE, KID, ODE"],
  // [['O', 'X', 'A', 'T', 'O', 'A', '', '', '', '', '', '', '', '', '', ''], "OX, AX, TO, AT"],
  // [['N', 'O', 'V', 'A', 'V', 'A', 'I', 'I', 'S', 'A', '', '', '', '', '', ''], "NOVA, VAIN, VISA"],
  // [['O', 'M', 'E', 'N', '', 'R', 'B', 'S', 'E', 'E', 'S', '', '', '', '', ''], "OMEN, ORBS, BEES"],
  // [['M', 'U', 'T', 'T', 'U', 'R', 'N', 'S', 'A', 'E', '', '', '', '', '', ''], "MUTT, TURN, SANE"],
  // [['L', 'A', 'R', 'D', 'O', 'I', 'V', 'E', 'N', '', '', '', '', '', '', ''], "OVEN, OIL, LARD"],
]
let levelObj = {}
let par = 30
let maxMoves = 50

// Set these two options
let startKey = 202


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





// const createPuzzleConfig = (grid, validWords) => {
//   let tiles = [];
//   let idCounter = 1;

//   for(let i = 0; i < grid.length; i++) {
//     tiles.push({
//       id: idCounter++,
//       isPartOfWord: false,
//       letter: grid[i]
//     });
//   }

//   return {
//     gridSize,
//     maxMoves,
//     par,
//     tiles,
//     validWords: validWords.split(', ').map(word => word.trim())
//   };
// }

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

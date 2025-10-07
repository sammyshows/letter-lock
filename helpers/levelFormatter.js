const fs = require('fs');

let levelData = [
  // ------------------------- Templates -------------------------
  // [['P', 'E', 'T', 'A', 'N', '', '', '', ''], "PAN, PET"]
  // [['', '', '', '', '', '', '', '', ''], ""]
  // [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], ""]
  // [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], ""]


  // ------------------------- Levels 257 - 300 -------------------------
  // ------------------------- 10 * 3 x 3 -------------------------
  [['P', 'I', 'P', 'O', 'P', '', '', '', ''], "PIP, POP"],
  [['A', 'C', 'E', 'O', 'P', 'T', 'P', '', ''], "ACE, APT, TOP"],
  [['D', 'Y', 'E', 'O', 'U', 'L', 'G', '', ''], "DYE, YOU, LUG"],
  [['B', 'E', 'I', 'D', 'E', 'N', 'O', '', ''], "BE, BID, DEN, ON"],
  [['S', 'O', 'D', 'D', 'E', '', '', '', ''], "SOD, ODE"],
  [['L', 'E', 'T', 'I', 'P', 'T', 'O', '', ''], "LET, TIP, TOP"],
  [['H', 'A', 'D', 'G', 'O', '', '', '', ''], "HAD, GO"],
  [['G', 'A', 'P', 'O', 'O', 'M', '', '', ''], "GAP, GO, POM"],
  [['U', 'S', 'E', 'A', 'R', 'O', '', '', ''], "USE, EAR, OR"],
  [['C', 'O', 'N', 'E', 'T', 'C', 'O', '', ''], "CON, NET, COT"],
  [['B', 'I', 'T', 'L', 'P', '', '', '', ''], "BIT, LIP"],
  [['M', 'E', 'T', 'O', 'O', '', '', '', ''], "MET, TOO"],
  [['L', 'E', 'V', 'E', 'T', '', '', '', ''], "LET, VET"],
  [['P', 'I', 'E', 'S', 'I', '', '', '', ''], "SIP, PIE"],

  // ------------------------- 50 * 4 x 4 -------------------------
  [['D', 'E', 'A', 'L', 'R', 'I', 'E', 'T', 'O', 'U', '', '', '', '', '', ''], "DEAL, RILE, TOUR"],
  [['L', 'I', 'V', 'E', 'R', 'O', 'O', 'T', '', '', '', '', '', '', '', ''], "LIVE, ROOT"],
  [['P', 'A', 'R', 'T', 'S', 'E', 'T', 'S', 'O', 'N', 'A', '', '', '', '', ''], "SEAT, PART, SONS"],
  [['S', 'E', 'A', 'R', 'E', 'A', 'L', '', '', '', '', '', '', '', '', ''], "SEAR, SEAL"],
  [['A', 'B', 'L', 'E', 'T', 'A', 'R', 'L', 'O', 'L', '', '', '', '', '', ''], "ABLE, EARL, TOLL"],
  [['C', 'A', 'L', 'F', 'E', 'E', 'T', 'L', 'T', '', '', '', '', '', '', ''], "CALF, ALT, FEET"],
  [['T', 'R', 'I', 'M', 'E', 'E', 'K', '', '', '', '', '', '', '', '', ''], "TRIM, REEK"],
  [['R', 'O', 'L', 'L', 'D', 'I', 'C', 'E', '', '', '', '', '', '', '', ''], "ROLL, DICE"],
  [['P', 'O', 'P', 'L', 'U', 'S', 'I', 'O', 'N', '', '', '', '', '', '', ''], "PLUS, SION, POP"],
  [['R', 'A', 'G', 'S', 'I', 'C', 'H', 'T', 'O', '', '', '', '', '', '', ''], "RAGS, TO, RICH"],
  [['F', 'E', 'E', 'D', 'D', 'E', 'N', '', '', '', '', '', '', '', '', ''], "FEED, EDEN"],
  [['T', 'O', 'O', 'T', 'H', 'O', 'R', 'N', '', '', '', '', '', '', '', ''], "HORN, TOOT"],
  [['M', 'E', 'S', 'S', 'A', 'K', 'E', '', '', '', '', '', '', '', '', ''], "MESS, SAKE"],
  [['H', 'E', 'X', 'I', 'U', 'G', 'O', '', '', '', '', '', '', '', '', ''], "HEX, XI, HUG, GO"],


  // ------------------------- 40 * 5 x 5 -------------------------
  [['C', 'A', 'N', 'E', 'S', 'T', 'R', 'E', 'S', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "CANES, TREES"],
  [['L', 'I', 'S', 'P', 'I', 'N', 'T', 'D', 'A', 'M', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "LISP, LINT, NAMED"],
  [['M', 'E', 'T', 'A', 'L', 'S', 'T', 'E', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "METAL, STEEL"],
  [['R', 'A', 'K', 'E', 'S', 'L', 'A', 'F', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "RAKES, LEAF"],
  [['S', 'A', 'N', 'D', 'S', 'H', 'E', 'E', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "SAND, SHEET"],
  [['C', 'R', 'E', 'E', 'D', 'R', 'E', 'A', 'M', 'S', 'T', 'O', 'R', 'A', 'V', 'E', '', '', '', '', '', '', '', '', ''], "CREED, DREAM, STORM, CAVES"],
  [['F', 'E', 'T', 'E', 'I', 'M', 'E', 'D', 'O', 'E', 'S', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "FETE, TIME, DOMES"],
  [['V', 'E', 'E', 'R', 'A', 'C', 'E', 'R', 'I', 'C', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "VEER, VICE, RACER"],
  [['F', 'A', 'B', 'L', 'E', 'S', 'W', 'O', 'R', 'D', 'R', 'R', 'O', '', '', '', '', '', '', '', '', '', '', '', ''], "FABLE, SWORD, ARROW"],
  [['P', 'E', 'E', 'K', 'A', 'L', 'E', 'E', 'E', 'R', 'S', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "PEEK, PEERS, KALE"],
  [['F', 'I', 'R', 'E', 'W', 'A', 'T', 'E', 'E', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "FIRE, WATER, WET"],
  [['O', 'N', 'E', 'T', 'W', 'O', 'H', 'R', 'E', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], "ONE, TWO, THREE"],
]
let levelObj = {}
let par = 30
let maxMoves = 50

// Set these two options
let startKey = 386


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

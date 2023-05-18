let levelData = [
  [['P', 'E', 'T', 'A', 'N', '', '', '', ''], "PAN, PET"],
  [['T', 'O', 'P', 'Z', 'O', '', '', '', ''], "TOP, ZOO"],
  [['B', 'O', 'W', 'I', 'G', '', '', '', ''], "WIG, BOW"],
  [['D', 'I', 'P', 'L', 'P', '', '', '', ''], "DIP, LIP"],
  [['T', 'O', 'E', 'G', 'G', '', '', '', ''], "TOE, EGG"],
  [['E', 'Y', 'E', 'G', 'M', '', '', '', ''], "EYE, GEM"],
  [['N', 'O', 'W', 'E', 'D', '', '', '', ''], "NEW, ODE"],
  [['D', 'I', 'P', 'R', 'Y', '', '', '', ''], "DRY, DIP"],
  [['T', 'I', 'E', 'K', 'D', '', '', '', ''], "TIE, KID"],
  [['E', 'R', 'A', 'U', 'N', '', '', '', ''], "RUN, ERA"],
  [['E', 'N', 'D', 'E', 'T', '', '', '', ''], "END, NET"],
  [['L', 'A', 'W', 'E', 'G', 'O', '', '', ''], "LAW, EGO"],
  [['W', 'I', 'T', 'I', 'N', '', '', '', ''], "WIT, TIN, ON"],
  [['P', 'U', 'B', 'O', 'Y', '', '', '', ''], "BOY, PUB"],
  [['L', 'I', 'D', 'N', 'K', '', '', '', ''], "KID, NIL"],
  [['D', 'O', 'T', 'A', 'K', '', '', '', ''], "DOT, OAK"],
  [['B', 'A', 'R', '', 'I', 'T', '', '', ''], "BAR, BIT"],
  [['I', '', 'C', 'E', 'J', 'T', '', '', ''], "JET, ICE"],
  [['I', 'F', 'L', 'Y', 'E', 'E', '', '', ''], "FLY, EYE, IF"],
  [['C', 'U', 'T', 'P', '', '', '', '', ''], "CUT, UP"],
  [['B', 'U', 'N', 'E', 'O', 'W', '', '', ''], "BUN, NOW, BE"],
  [['I', 'N', 'O', 'N', '', 'T', '', '', ''], "INN, NOT"],
  [['W', '', 'T', 'E', 'M', 'O', '', '', ''], "MET, TWO"],
  [['D', 'U', 'O', 'D', 'P', '', '', '', ''], "DUD, POD"],
  [['A', 'P', 'T', 'U', 'N', '', '', '', ''], "NUT, TAP"],
  [['A', 'I', 'R', 'P', 'O', '', '', '', ''], "AIR, PRO"],
  [['D', 'A', 'Y', 'W', 'G', 'E', 'M', '', ''], "DAY, GEM, AWE"],
  [['D', 'E', 'W', 'L', 'O', '', '', '', ''], "DEW, LOW"]
]
let levelObj = {}
let par = 19
let maxMoves = 30

// Set these two options
let startKey = 63
let gridSize = 3


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

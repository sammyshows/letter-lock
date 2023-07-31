const myLove = 'Sam';
const myName = 'Celine';

function writeLoveLetter() {
  let myDeclaration = `My Dearest ${myLove}, 
You are the variable that brought color into my life, 
A function that fills my heart with joy and laughter,
With every if/else statement, I choose you, now and forever.
Yours always and forever,
${myName}`;

  const willComeToSleep = Math.random() < 0.5;

  if (willComeToSleep) {
    console.log(myDeclaration);
  } else {
    console.log(`Hey ${myLove}, it seems you're a bit too busy coding away! Don’t stay up too long because I miss you!`);
  }
}

writeLoveLetter();
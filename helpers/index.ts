const adjectives = ["Quick", "Jolly", "Brave", "Happy", "Clever", "Mighty", "Quiet", "Fierce", "Eager", "Loyal", "Humble", "Proud", "Bold", "Busy", "Calm", "Elegant", "Friendly", "Gentle", "Helpful", "Innocent", "Kind", "Lovely", "Nervous", "Peaceful", "Reliable", "Silly", "Smart", "Tolerant", "Witty", "Wonderful", "Adorable", "Ambitious", "Amusing", "Awesome", "Beaming", "Charming", "Cheerful", "Colorful", "Cool", "Creative", "Shiny", "Tiny", "Warm", "Free", "Wild", "Young", "Mellow", "Bright", "Vibrant", "Crisp", "Breezy", "Bold", "Frosty", "Silent", "Grand", "Hot", "Icy", "Juicy", "Keen", "Lucky", "Majestic", "Nifty", "Old", "Plush", "Quaint", "Ripe", "Smooth", "Tough", "Vivid", "Wacky", "Zesty"];
const nouns = ["Lion", "Eagle", "Bear", "Fox", "Penguin", "Tiger", "Owl", "Panda", "Giraffe", "Dolphin", "Wolf", "Hawk", "Rabbit", "Zebra", "Monkey", "Parrot", "Koala", "Horse", "Sheep", "Raccoon", "Puma", "Squirrel", "Hippo", "Jaguar", "Cheetah", "Kangaroo", "Ostrich", "Bison", "Ferret", "Gazelle", "Llama", "Narwhal", "Octopus", "Pangolin", "Quokka", "Rhino", "Scorpion", "Viper", "Walrus", "Yak", "Beaver", "Bug", "Cat", "Dog", "Elk", "Frog", "Goose", "Hamster", "Ibex", "Jackal", "Kitten", "Lemur", "Mole", "Newt", "Otter", "Pig", "Quail", "Rat", "Slug", "Turtle", "Urial", "Vole", "Weasel", "Xerus", "Yak", "Zebra"];

export const generateUsername = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  
  return `${adj} ${noun}`
}
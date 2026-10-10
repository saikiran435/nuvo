import type { Category } from "@/data/types";

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: Category;
  gcReward: number;
  questions: QuizQuestion[];
}

// TODO(verify): source needed before any count of litres, lakes, or years is added to these questions.

export const quizzes: Quiz[] = [
  {
    id: "myth-or-fact",
    title: "Myth or fact",
    category: "nature",
    gcReward: 20,
    questions: [
      {
        id: "myth-1",
        prompt: "Myth or fact: turning the tap off while you brush can save water.",
        options: ["Myth", "Fact"],
        correctIndex: 1,
        explanation: "The tap is only needed to wet the brush and to rinse.",
      },
      {
        id: "myth-2",
        prompt: "Myth or fact: Indian pangolins live in India.",
        options: ["Myth", "Fact"],
        correctIndex: 1,
        explanation: "They are shy animals that eat ants and termites.",
      },
      {
        id: "myth-3",
        prompt: "Myth or fact: a plastic bottle disappears quickly if you leave it in the soil.",
        options: ["Myth", "Fact"],
        correctIndex: 0,
        explanation: "Plastic stays around for a long time. A bin or a bottle you use again is a better ending.",
      },
      {
        id: "myth-4",
        prompt: "Myth or fact: sharing a ride can mean fewer vehicles for the same journey.",
        options: ["Myth", "Fact"],
        correctIndex: 1,
        explanation: "One shared ride can carry people who might otherwise have gone separately.",
      },
      {
        id: "myth-5",
        prompt: "Myth or fact: birds only live in forests, never in cities.",
        options: ["Myth", "Fact"],
        correctIndex: 0,
        explanation: "Many birds visit parks, lakes, and trees in cities when those places are calm.",
      },
    ],
  },
  {
    id: "water-wise",
    title: "Water wise",
    category: "water",
    gcReward: 20,
    questions: [
      {
        id: "water-1",
        prompt: "Which one catches rain you could use later?",
        options: ["A tap left running", "A bucket under a roof pipe", "A bottle from a shop"],
        correctIndex: 1,
        explanation: "Rain from the roof can be stored for plants.",
      },
      {
        id: "water-2",
        prompt: "You notice a tap dripping. What is a good next step?",
        options: ["Ignore it", "Tell a grown-up", "Open it wider"],
        correctIndex: 1,
        explanation: "A drip is a small clue. A grown-up can help fix it.",
      },
      {
        id: "water-3",
        prompt: "Why do lakes matter in a city like Bengaluru?",
        options: [
          "They are only for boats",
          "They give monsoon rain a place to rest",
          "They make tap water salty",
        ],
        correctIndex: 1,
        explanation: "Lakes and tanks can hold rain. When they are filled in, the city has fewer places to keep it.",
      },
      {
        id: "water-4",
        prompt: "Which water is the usual kind in a home glass in India?",
        options: ["Water straight from the sea", "Water from a river, lake, well, or rain", "Water from a puddle on the road"],
        correctIndex: 1,
        explanation: "The sea is salty. Tap water usually begins in a river, a lake, a well, or stored rain.",
      },
      {
        id: "water-5",
        prompt: "Washing water that a grown-up says is safe for plants is sometimes called…",
        options: ["Grey water", "Ocean water", "New rain"],
        correctIndex: 0,
        explanation: "Grey water is used water, like from washing, that might water plants if a grown-up checks it.",
      },
    ],
  },
  {
    id: "waste-sorting",
    title: "Waste sorting",
    category: "waste",
    gcReward: 20,
    questions: [
      {
        id: "waste-1",
        prompt: "Where do fruit peels belong if you have a compost jar?",
        options: ["In the compost", "In a battery box", "Down the drain"],
        correctIndex: 0,
        explanation: "Peels can become food for soil. Batteries do not belong with them.",
      },
      {
        id: "waste-2",
        prompt: "A clean jar is empty. What is a useful next life for it?",
        options: ["Use it again", "Break it for fun", "Hide it in the garden"],
        correctIndex: 0,
        explanation: "A clean jar can hold seeds, pencils, or leftovers.",
      },
      {
        id: "waste-3",
        prompt: "Which item should stay out of a compost jar?",
        options: ["Dry leaves", "A battery", "A vegetable peel"],
        correctIndex: 1,
        explanation: "Batteries need a grown-up and a proper collection point, not the compost.",
      },
      {
        id: "waste-4",
        prompt: "Why is a cloth bag a friendly shopping tool?",
        options: ["It can go on many trips", "It works only once", "It has to be thrown away each day"],
        correctIndex: 0,
        explanation: "A cloth bag can be used again, so fewer single-use bags are needed.",
      },
      {
        id: "waste-5",
        prompt: "You find broken glass. What should you do?",
        options: ["Pick it up with bare hands", "Ask a grown-up", "Put it in the compost"],
        correctIndex: 1,
        explanation: "Glass can cut. A grown-up should handle it.",
      },
    ],
  },
  {
    id: "climate-basics",
    title: "Climate basics",
    category: "nature",
    gcReward: 20,
    questions: [
      {
        id: "climate-1",
        prompt: "Which sentence fits climate?",
        options: ["It is the weather this afternoon", "It is the usual pattern of weather over many years", "It is only the temperature of a cup of tea"],
        correctIndex: 1,
        explanation: "Weather is today. Climate is the pattern over a long time.",
      },
      {
        id: "climate-2",
        prompt: "What is one real job of a tree?",
        options: ["It gives shade and a home for birds", "It stops all rain forever", "It makes the air salty"],
        correctIndex: 0,
        explanation: "Trees give shade and shelter. As they grow they also take in carbon dioxide.",
      },
      {
        id: "climate-3",
        prompt: "What is the monsoon?",
        options: ["A kind of plastic", "A seasonal change in the wind that brings a rainy season", "A tap inside the house"],
        correctIndex: 1,
        explanation: "The monsoon brings a rainy season to much of India.",
      },
      {
        id: "climate-4",
        prompt: "Saving electricity at home can help because…",
        options: ["Many power plants burn fuel", "Lights drink water", "Switches are made of rain"],
        correctIndex: 0,
        explanation: "Using less power can mean less fuel is burned to make it.",
      },
      {
        id: "climate-5",
        prompt: "A lake is missing from an old map. What can change?",
        options: ["Rain has one less place to rest", "The moon moves closer", "Birds forget how to fly"],
        correctIndex: 0,
        explanation: "Without the lake, rain looks for another path, sometimes along a street.",
      },
    ],
  },
];

export function quizById(id: string): Quiz | undefined {
  return quizzes.find((quiz) => quiz.id === id);
}

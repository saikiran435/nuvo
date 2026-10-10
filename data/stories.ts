import type { Category } from "@/data/types";

export interface StoryCard {
  text: string;
  mood?: "idle" | "happy" | "thinking" | "celebrate";
}

export interface Story {
  id: string;
  title: string;
  durationSec: number;
  category: Category;
  kind: "cards" | "video";
  cards?: StoryCard[];
  videoSrc?: string;
  unlock: { type: "missions" | "gc" | "level"; value: number; worldId?: string };
  missionId?: string;
}

// TODO(verify): source needed before adding dates, lake counts, or rainfall figures to these stories.

export const stories: Story[] = [
  {
    id: "story-bengaluru",
    title: "Why does Bengaluru run out of water?",
    durationSec: 180,
    category: "water",
    kind: "cards",
    unlock: { type: "missions", value: 3, worldId: "water" },
    missionId: "water-detective",
    cards: [
      { mood: "thinking", text: "Chiku has a question. Why do some weeks in Bengaluru feel short of water, even after the rains?" },
      { mood: "idle", text: "The city grew quickly. More homes and more taps mean more thirst." },
      { mood: "thinking", text: "Lakes and tanks used to hold the monsoon. Some were filled in, or cut off from the streams that fed them." },
      { mood: "idle", text: "When rain cannot sink into the ground, wells have a harder time refilling." },
      { mood: "idle", text: "Hot weeks ask for more water for drinking, washing, and plants." },
      { mood: "happy", text: "You can still help at home. Find a leak, catch a little rain, and talk about lakes with your family." },
    ],
  },
  {
    id: "story-bottle",
    title: "What happens to a plastic bottle?",
    durationSec: 150,
    category: "waste",
    kind: "cards",
    unlock: { type: "missions", value: 0 },
    cards: [
      { mood: "thinking", text: "A bottle's job can end in a minute. The plastic stays much longer." },
      { mood: "happy", text: "If it is collected and clean, it might be made into something new." },
      { mood: "idle", text: "If it is dropped outside, wind and rain can carry it to a drain." },
      { mood: "thinking", text: "Drains can lead to rivers and, in time, toward the sea." },
      { mood: "idle", text: "Animals may mistake small pieces for food. Hold the bottle until you find a bin." },
      { mood: "celebrate", text: "A cloth bag, and a bottle you use again, are friendly choices." },
    ],
  },
  {
    id: "story-pollinators",
    title: "Meet the pollinators",
    durationSec: 140,
    category: "nature",
    kind: "cards",
    unlock: { type: "missions", value: 0 },
    missionId: "nature-spot",
    cards: [
      { mood: "happy", text: "Bees, butterflies, and some birds move pollen from flower to flower." },
      { mood: "thinking", text: "Pollen helps plants make fruits and seeds." },
      { mood: "idle", text: "A pot of flowers on a balcony can be a tiny stop for them." },
      { mood: "idle", text: "They like real flowers. Plastic ones do not feed anyone." },
      { mood: "happy", text: "Watch quietly. You do not need to touch them." },
      { mood: "celebrate", text: "If you see one, you have already met a neighbour." },
    ],
  },
  {
    id: "story-rain-garden",
    title: "Build a rain garden",
    durationSec: 160,
    category: "water",
    kind: "cards",
    unlock: { type: "gc", value: 1500 },
    missionId: "water-rain",
    cards: [
      { mood: "thinking", text: "A rain garden is a shallow dip planted with tough plants." },
      { mood: "idle", text: "It gives rain a place to sink in, instead of rushing down the street." },
      { mood: "happy", text: "Ask a grown-up before any digging." },
      { mood: "idle", text: "Stones can slow the water. Plants hold the soil." },
      { mood: "thinking", text: "It does not have to be big. A pot with a saucer is a tiny practice version." },
      { mood: "celebrate", text: "When it rains, watch where the water goes. That is the start." },
    ],
  },
  {
    id: "story-missing-lake",
    title: "Climate mysteries: the missing lake",
    durationSec: 170,
    category: "community",
    kind: "cards",
    unlock: { type: "level", value: 5 },
    cards: [
      { mood: "thinking", text: "Some old maps show a lake where a road or a building stands now." },
      { mood: "idle", text: "The lake was a bowl for the monsoon." },
      { mood: "thinking", text: "Without it, rain looks for a new path. Sometimes that path is a street." },
      { mood: "happy", text: "People who remember the lake are part of the story. Ask a grown-up what they remember." },
      { mood: "idle", text: "Bringing a lake back is big work for a city. Noticing the story is work you can do." },
      { mood: "celebrate", text: "Guardians pay attention. That is a fine skill to practice." },
    ],
  },
];

export function storyById(id: string): Story | undefined {
  return stories.find((story) => story.id === id);
}

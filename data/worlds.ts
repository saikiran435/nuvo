import type { Category } from "@/data/types";

export interface World {
  id: string;
  category: Category;
  order: number;
  missionIds: string[];
  unlockedBy?: string;
  /** Extra packs stay off the main trail and open immediately. */
  pack?: boolean;
}

export const worlds: World[] = [
  {
    id: "water",
    category: "water",
    order: 1,
    missionIds: ["water-tap-off", "water-leak", "water-rain", "water-detective", "water-map"],
  },
  {
    id: "waste",
    category: "waste",
    order: 2,
    missionIds: ["waste-sort", "waste-remix", "waste-bag", "waste-compost", "waste-swap"],
    unlockedBy: "water",
  },
  {
    id: "nature",
    category: "nature",
    order: 3,
    missionIds: ["nature-spot", "nature-sapling", "nature-birds"],
    unlockedBy: "waste",
  },
  {
    id: "mobility",
    category: "mobility",
    order: 4,
    missionIds: ["mobility-walk", "mobility-ride"],
    unlockedBy: "nature",
  },
  {
    id: "community",
    category: "community",
    order: 5,
    missionIds: ["community-teach", "community-tidy", "community-repair"],
    unlockedBy: "mobility",
  },
  {
    id: "habits",
    category: "waste",
    order: 6,
    pack: true,
    missionIds: ["habit-sort", "habit-ride", "habit-plant", "habit-reuse"],
  },
  {
    id: "wild",
    category: "nature",
    order: 7,
    pack: true,
    missionIds: ["wild-shelter", "wild-flowers", "wild-tree", "wild-spot", "wild-food", "wild-lights", "wild-home"],
  },
];

export function worldById(id: string): World | undefined {
  return worlds.find((world) => world.id === id);
}

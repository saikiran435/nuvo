const minutes: Record<string, number> = {
  "water-tap-off": 10,
  "water-leak": 15,
  "water-rain": 15,
  "water-detective": 20,
  "water-map": 15,
  "waste-sort": 20,
  "waste-remix": 25,
  "waste-bag": 15,
  "waste-compost": 15,
  "waste-swap": 20,
  "nature-spot": 20,
  "nature-sapling": 15,
  "nature-birds": 15,
  "mobility-walk": 25,
  "mobility-ride": 10,
  "community-teach": 10,
  "community-tidy": 25,
  "community-repair": 25,
  "habit-sort": 15,
  "habit-ride": 20,
  "habit-plant": 15,
  "habit-reuse": 10,
  "wild-shelter": 25,
  "wild-flowers": 20,
  "wild-tree": 20,
  "wild-spot": 20,
  "wild-food": 15,
  "wild-lights": 10,
  "wild-home": 15,
};

const steady = new Set(["waste-compost", "mobility-walk", "community-tidy", "community-repair", "nature-sapling", "wild-shelter", "wild-tree", "habit-ride"]);

export function missionMinutes(id: string): number {
  return minutes[id] ?? 15;
}

export function missionDifficulty(id: string): "easy" | "steady" {
  return steady.has(id) ? "steady" : "easy";
}

import type { Mission } from "@/data/types";

export const missions: Mission[] = [
  { id: "water-tap-off", worldId: "water", category: "water", gc: 60, learn: { storyId: "story-bengaluru" }, do: {}, prove: { evidence: "checklist", checkCount: 3 }, repeatable: true, needsApproval: false },
  { id: "water-leak", worldId: "water", category: "water", gc: 70, learn: { storyId: "story-bengaluru" }, do: { supervised: true }, prove: { evidence: "photo" }, repeatable: false, needsApproval: true },
  { id: "water-rain", worldId: "water", category: "water", gc: 70, learn: { storyId: "story-bengaluru" }, do: {}, prove: { evidence: "photo" }, repeatable: false, needsApproval: true },
  { id: "water-detective", worldId: "water", category: "water", gc: 80, learn: { storyId: "story-bengaluru" }, do: {}, prove: { evidence: "photo" }, repeatable: false, needsApproval: true },
  { id: "water-map", worldId: "water", category: "water", gc: 90, learn: { storyId: "story-bengaluru" }, do: {}, prove: { evidence: "log" }, repeatable: true, needsApproval: false },
  { id: "waste-sort", worldId: "waste", category: "waste", gc: 70, learn: {}, do: {}, prove: { evidence: "photo" }, repeatable: false, needsApproval: true },
  { id: "waste-remix", worldId: "waste", category: "waste", gc: 100, learn: {}, do: {}, prove: { evidence: "photo" }, repeatable: false, needsApproval: true },
  { id: "waste-bag", worldId: "waste", category: "waste", gc: 60, learn: {}, do: { supervised: true }, prove: { evidence: "adult" }, repeatable: false, needsApproval: true },
  { id: "waste-compost", worldId: "waste", category: "waste", gc: 90, learn: {}, do: { supervised: true }, prove: { evidence: "photo" }, repeatable: false, needsApproval: true },
  { id: "waste-swap", worldId: "waste", category: "waste", gc: 80, learn: {}, do: { supervised: true }, prove: { evidence: "adult" }, repeatable: false, needsApproval: true },
  { id: "nature-spot", worldId: "nature", category: "nature", gc: 70, learn: { storyId: "story-pollinators" }, do: {}, prove: { evidence: "photo" }, repeatable: false, needsApproval: true },
  { id: "nature-sapling", worldId: "nature", category: "nature", gc: 100, learn: {}, do: {}, prove: { evidence: "log" }, repeatable: true, needsApproval: false },
  { id: "nature-birds", worldId: "nature", category: "nature", gc: 70, learn: {}, do: {}, prove: { evidence: "log" }, repeatable: true, needsApproval: false },
  { id: "mobility-walk", worldId: "mobility", category: "mobility", gc: 80, learn: {}, do: { supervised: true, optionCount: 2 }, prove: { evidence: "adult" }, repeatable: false, needsApproval: true },
  { id: "mobility-ride", worldId: "mobility", category: "mobility", gc: 60, learn: {}, do: {}, prove: { evidence: "log" }, repeatable: true, needsApproval: false },
  { id: "community-teach", worldId: "community", category: "community", gc: 70, learn: {}, do: {}, prove: { evidence: "log" }, repeatable: true, needsApproval: false },
  { id: "community-tidy", worldId: "community", category: "community", gc: 120, learn: {}, do: { supervised: true }, prove: { evidence: "adult" }, repeatable: false, needsApproval: true },
  { id: "community-repair", worldId: "community", category: "community", gc: 90, learn: {}, do: { supervised: true }, prove: { evidence: "log" }, repeatable: false, needsApproval: false },
  // Everyday deeds: sort, share a trip, care for a plant, reuse.
  { id: "habit-sort", worldId: "habits", category: "waste", gc: 60, learn: {}, do: {}, prove: { evidence: "log" }, repeatable: true, needsApproval: false },
  { id: "habit-ride", worldId: "habits", category: "mobility", gc: 70, learn: {}, do: { supervised: true, optionCount: 2 }, prove: { evidence: "log" }, repeatable: false, needsApproval: false },
  { id: "habit-plant", worldId: "habits", category: "nature", gc: 70, learn: {}, do: {}, prove: { evidence: "log" }, repeatable: false, needsApproval: false },
  { id: "habit-reuse", worldId: "habits", category: "waste", gc: 60, learn: {}, do: {}, prove: { evidence: "log" }, repeatable: true, needsApproval: false },
  // Near-home nature: shelter, flowers, a tree, spotting, food, lights, and home clues.
  { id: "wild-shelter", worldId: "wild", category: "nature", gc: 80, learn: {}, do: { supervised: true }, prove: { evidence: "log" }, repeatable: false, needsApproval: false },
  { id: "wild-flowers", worldId: "wild", category: "nature", gc: 70, learn: {}, do: { supervised: true }, prove: { evidence: "log" }, repeatable: false, needsApproval: false },
  { id: "wild-tree", worldId: "wild", category: "nature", gc: 80, learn: {}, do: { supervised: true }, prove: { evidence: "log" }, repeatable: false, needsApproval: false },
  { id: "wild-spot", worldId: "wild", category: "nature", gc: 70, learn: {}, do: { supervised: true }, prove: { evidence: "log" }, repeatable: true, needsApproval: false },
  { id: "wild-food", worldId: "wild", category: "waste", gc: 60, learn: {}, do: {}, prove: { evidence: "log" }, repeatable: true, needsApproval: false },
  { id: "wild-lights", worldId: "wild", category: "mobility", gc: 50, learn: {}, do: {}, prove: { evidence: "checklist", checkCount: 1 }, repeatable: true, needsApproval: false },
  { id: "wild-home", worldId: "wild", category: "water", gc: 70, learn: {}, do: {}, prove: { evidence: "log" }, repeatable: false, needsApproval: false },
];

export function missionById(id: string): Mission | undefined {
  return missions.find((mission) => mission.id === id);
}

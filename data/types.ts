export type Category = "water" | "waste" | "nature" | "mobility" | "community";
export type Evidence = "photo" | "checklist" | "log" | "adult";

export interface Mission {
  id: string;
  worldId: string;
  category: Category;
  gc: number;
  learn: { storyId?: string };
  do: { supervised?: boolean; optionCount?: number };
  prove: { evidence: Evidence; checkCount?: number };
  repeatable: boolean;
  needsApproval: boolean;
}

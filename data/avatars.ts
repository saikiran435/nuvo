export const avatars = [
  { id: "drop", emoji: "💧" },
  { id: "sprout", emoji: "🌱" },
  { id: "bird", emoji: "🐦" },
  { id: "sun", emoji: "☀️" },
  { id: "fish", emoji: "🐟" },
  { id: "star", emoji: "⭐" },
] as const;

export type AvatarId = (typeof avatars)[number]["id"];

export function avatarEmoji(id: string): string {
  return avatars.find((avatar) => avatar.id === id)?.emoji ?? "💧";
}

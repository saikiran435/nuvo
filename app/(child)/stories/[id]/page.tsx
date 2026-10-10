import { Soon } from "@/components/Soon";

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Soon titleKey="soon.storiesTitle" bodyKey="soon.storiesBody" storyId={id} />;
}

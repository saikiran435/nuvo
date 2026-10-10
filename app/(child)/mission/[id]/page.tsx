import { MissionScreen } from "@/components/mission/MissionScreen";

export default async function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MissionScreen id={id} />;
}

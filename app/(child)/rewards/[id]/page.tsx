import { RewardDetail } from "@/components/rewards/RewardDetail";

export default async function RewardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RewardDetail id={id} />;
}

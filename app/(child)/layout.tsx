import type { ReactNode } from "react";
import { Shell } from "@/components/shell/Shell";

export default function ChildLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}

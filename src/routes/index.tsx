import { createFileRoute } from "@tanstack/react-router";
import { SuvvaiHome } from "@/components/suvvai-home";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <SuvvaiHome />;
}

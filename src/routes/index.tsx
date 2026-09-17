import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Astravolt — Arcade Space Shooter" },
      {
        name: "description",
        content:
          "Astravolt is a fast-paced neon arcade shooter with coins, upgrades and skins. Play in your browser or install the Android app.",
      },
      { property: "og:title", content: "Astravolt — Arcade Space Shooter" },
      {
        property: "og:description",
        content:
          "Blast waves of cyber threats, earn coins, unlock upgrades and skins in this neon arcade shooter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      <h1 className="sr-only">Astravolt — arcade space shooter</h1>
      <iframe
        src="/game/index.html"
        title="Astravolt game"
        className="h-full w-full border-0"
        allow="autoplay; fullscreen"
      />
    </main>
  );
}

import dynamic from "next/dynamic";

export default function Home() {
  const Map = dynamic(() => import("./components/MapComponent"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
  });
  return (
    <main className="">
      <h1 className="text-4xl font-bold">Ceylon Public Transit</h1>
      <p className="text-lg">
        An open-source initiative to revolutionize public transport in Sri
        Lanka.
      </p>
      <Map posix={[6.9, 79.94]} zoom={13} />
    </main>
  );
}

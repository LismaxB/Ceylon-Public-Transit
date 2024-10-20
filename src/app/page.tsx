import dynamic from "next/dynamic";
import NavBar from "./components/Navbar";

export default function Home() {
  const Map = dynamic(() => import("./components/MapComponent"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
  });
  return (
    <main className="">
      <NavBar />
      <Map posix={[6.9, 79.94]} zoom={13} />
    </main>
  );
}

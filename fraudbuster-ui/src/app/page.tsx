import Image from "next/image";
import RootPage from "./root";
import { Suspense } from "react";

export default function Home() {
  return (
      <main className="">
        <Suspense fallback={<div>Loading...</div>}>
          <RootPage />
        </Suspense>
      </main>
  );
}

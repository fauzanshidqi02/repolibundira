import { Suspense } from "react";
import RepositoryApp from "@/components/repository/RepositoryApp";

export default function SearchRoutePage() {
  return (
    <Suspense fallback={null}>
      <RepositoryApp forceSearchPage />
    </Suspense>
  );
}
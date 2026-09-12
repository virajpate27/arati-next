import { Suspense } from "react";
import ListPageClient from "@/components/ListPageClient";

export const metadata = {
  title: "आरत्या — आरती संग्रहालय",
};

export default function ListPage() {
  return (
    <Suspense fallback={null}>
      <ListPageClient />
    </Suspense>
  );
}

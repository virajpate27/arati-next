import { notFound } from "next/navigation";
import { AARTI_DATA } from "@/lib/data/aartis";
import ReaderPage from "@/components/reader/ReaderPage";

export function generateStaticParams() {
  return AARTI_DATA.map((a) => ({ id: a.id }));
}

export function generateMetadata({ params }) {
  const aarti = AARTI_DATA.find((a) => a.id === params.id);
  return {
    title: aarti ? `${aarti.title} — आरती संग्रहालय` : "आरती सापडली नाही — आरती संग्रहालय",
  };
}

export default function AartiPage({ params }) {
  const aarti = AARTI_DATA.find((a) => a.id === params.id);
  if (!aarti) notFound();
  return <ReaderPage aarti={aarti} />;
}

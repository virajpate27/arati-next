import Link from "next/link";

export default function AartiNotFound() {
  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <div className="empty-state">
        <p>ही आरती सापडली नाही.</p>
        <div style={{ marginTop: 18 }}>
          <Link className="btn btn-primary" href="/list">
            आरत्यांकडे परत जा
          </Link>
        </div>
      </div>
    </div>
  );
}

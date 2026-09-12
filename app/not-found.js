import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-reading)", fontSize: "1.4rem", color: "var(--text)" }}>
        ही पृष्ठ सापडले नाही.
      </p>
      <div style={{ marginTop: 18 }}>
        <Link className="btn btn-primary" href="/">
          मुख्यपृष्ठावर जा
        </Link>
      </div>
    </div>
  );
}

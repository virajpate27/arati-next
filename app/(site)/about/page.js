export const metadata = {
  title: "आमच्याबद्दल — आरती संग्रहालय",
};

export default function AboutPage() {
  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <header className="page-header" data-entrance>
        <h1>आमच्याबद्दल</h1>
      </header>
      <div className="ornament" data-entrance />
      <div
        style={{ fontFamily: "var(--font-reading)", color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.9 }}
        data-entrance
      >
        <p>
          आरती संग्रहालय हे मराठी आरत्यांचे एक शांत, सुबक आणि आधुनिक डिजिटल भांडार आहे. रोजच्या पूजेत सहज वापरता यावे,
          म्हणून प्रत्येक आरती स्पष्ट कडवेवार मांडली आहे — जेणेकरून वाचताना आपण नेमके कोणत्या कडव्यावर आहात हे कायम
          कळत राहील.
        </p>
        <p style={{ marginTop: 16 }}>
          ही एक सतत वाढणारी सूची आहे. आपल्याला एखादी आरती सुचवायची असल्यास, आम्हाला जरूर कळवा.
        </p>
      </div>
    </div>
  );
}

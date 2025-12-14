import { NavLink, Outlet } from "react-router-dom";
import logo from "./assets/Battle_Arena-Cover.png";

export default function App() {
  return (
    <div className="app-container">
      
      {/* ---- HEADER ---- */}
      <header className="header w-full">
  <nav className="navbar w-full">

          
          {/* --- Logo + Titre --- */}
          <NavLink to="/" className="logo-block">
            <img
              src={logo}
              alt="Logo soft skills"
              className="logo"
            />
            <span className="site-title">Battle-Arena</span>
          </NavLink>

          <div className="nav-links">
  <NavLink to="/" className="nav-item">
    Home
  </NavLink>

  <NavLink to="/admin-login" className="nav-item">
    Admin
  </NavLink>


</div>

        </nav>
      </header>

       {/* ---- CONTENU ---- */}
      <main className="w-full flex justify-center">
  <div className="max-w-6xl w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">

        <section className="lg:col-span-2">
          {/* Contenu des routes */}
          <Outlet />

         {/*  Section vidéo */}
<div className="content-block">
  <h2>Presentation video</h2>
  <div className="video-wrapper">
    <video 
      controls 
      className="video-player"
      controlsList="nodownload noremoteplayback"
    >
      <source src="/videos/vidéoenglishgamefinalversion.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</div>

<div className="faq-section">
  <h2 className="faq-title">Quick In-Game FAQ</h2>

  <div className="faq-item">
    <p className="faq-question">Question 1: Can I use more than one Soft Skill Card in a round?</p>
    <p className="faq-answer">
      Only if the Game Master allows it or during a special Event Card round (like “Team-Up”).
      Otherwise, choose one card per scenario.
    </p>
  </div>

  <div className="faq-item">
    <p className="faq-question">Question 2: What if I don’t know the English word for a soft skill?</p>
    <p className="faq-answer">
      Use the definitions on the Notion-style vocabulary page. You can explain in your own words
      in English. Clarity is more important than perfect vocabulary.
    </p>
  </div>

  <div className="faq-item">
    <p className="faq-question">Question 3: How do I earn points?</p>
    <p className="faq-answer">
      Points are awarded for: relevance (+3), communication clarity (+2), creativity (+1),
      and teamwork (+1). Negative points for irrelevant answers or poor communication (–1 each).
    </p>
  </div>
</div>

          {/* 🔽 Section bouton de téléchargement PDF */}
          <div className="pdf-section">
  <h2 className="pdf-title">Notion soft skills</h2>
  <p className="pdf-text">
    You can download the PDF document by clicking the button below.
  </p>

  <a
    href="/docs/Notion_battle_arena.pdf"
    download
    className="pdf-button"
  >
    Download the PDF
  </a>

  {/* Aperçu visuel du PDF */}
  <div className="pdf-preview">
    <div className="pdf-frame-wrapper">
      <iframe
        src="/docs/Notion_battle_arena.pdf#toolbar=0&navpanes=0&scrollbar=0"
        title="Aperçu PDF Notion soft skills"
        className="pdf-frame"
      />
    </div>
  </div>
</div>
        </section>
        </div>
      </main>

      {/* ---- FOOTER ---- */}
      <footer className="footer w-full">
        © {new Date().getFullYear()} Battle-Arena – All rights reserved
      </footer>
    </div>
  );
}

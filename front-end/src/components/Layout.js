import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* Layout shell: top bar with app title, global actions & theme toggle */
function Layout({ children }) {
  const [dark, setDark] = useState(() => document.body.classList.contains('theme-dark'));
    const [largeText, setLargeText] = useState(() => localStorage.getItem('pref-large-text') === 'true');

  useEffect(() => {
    if (dark) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }, [dark]);
    useEffect(() => {
      if (largeText) document.body.classList.add('text-large'); else document.body.classList.remove('text-large');
      localStorage.setItem('pref-large-text', largeText);
    }, [largeText]);

  return (
    <div className="app-shell">
      <header className="app-header-bar">
        <div className="app-header-inner container">
          <div className="brand">
            <Link to="/" className="brand-link flex items-center gap-2" aria-label="Stone Manager Home">
              <span className="brand-word brand-gradient">$UMA</span>
              <span style={{fontWeight:600}}>Exports Manager</span>
            </Link>
          </div>
          <div className="header-actions flex items-center gap-3">
            <Link to="/add-stone" className="btn btn-add btn-pill" aria-label="Add a new stone">Add Stone +</Link>
            <button
              type="button"
              className="btn btn-outline btn-pill theme-toggle"
              onClick={() => setDark(d => !d)}
              aria-pressed={dark}
              aria-label="Toggle dark mode"
            >
              {dark ? '☀️ Light' : '🌙 Dark'}
            </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline btn-pill"
                  onClick={() => setLargeText(t => !t)}
                  aria-pressed={largeText}
                  aria-label="Toggle large text mode"
                  title="Increase text size"
                >
                  {largeText ? '− Size' : '+ Size'}
                </button>
              </div>
          </div>
        </div>
      </header>
      <main className="app-main container" role="main">
        {children}
      </main>
    </div>
  );
}

export default Layout;

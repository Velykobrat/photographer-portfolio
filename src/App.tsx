import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Collections from "./pages/Collections/Collections";
import Blog from "./pages/Blog/Blog";
import Contacts from "./pages/Contacts/Contacts";
import Footer from "./components/Footer/Footer";
import Series from "./pages/Series/Series";
import JournalArticle from "./pages/JournalArticle/JournalArticle";
import NotFound from "./pages/NotFound/NotFound";

export function AppContent() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);

  const isHome = ["/home", "/", "/uk/home", "/uk"].includes(location.pathname);

  return (
    <div className="pageContainer">
      <Header />

      <div className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<Series />} />
          <Route path="/journal" element={<Blog />} />

          <Route path="/journal/:slug" element={<JournalArticle />} />

          <Route path="/blog" element={<Navigate to="/journal" replace />} />

          <Route path="/contacts" element={<Contacts />} />
          <Route path="/uk" element={<Navigate to="/uk/home" replace />} />
          <Route path="/uk/home" element={<Home />} />
          <Route path="/uk/collections" element={<Collections />} />
          <Route path="/uk/collections/:slug" element={<Series />} />
          <Route path="/uk/journal" element={<Blog />} />
          <Route path="/uk/journal/:slug" element={<JournalArticle />} />
          <Route path="/uk/contacts" element={<Contacts />} />
          <Route path="/uk/blog" element={<Navigate to="/uk/journal" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!isHome && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

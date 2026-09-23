import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Collections from './pages/Collections/Collections';
import Blog from './pages/Blog/Blog';
import Contacts from './pages/Contacts/Contacts';
import Footer from './components/Footer/Footer';

function AppContent() {
  const location = useLocation();

  const isHome =
    location.pathname === '/home' ||
    location.pathname === '/';

  return (
    <div className="pageContainer">
      <Header />

      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </main>

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
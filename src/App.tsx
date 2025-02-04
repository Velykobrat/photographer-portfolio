import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Collections from './pages/Collections/Collections';
import Blog from './pages/Blog/Blog';
import Contacts from './pages/Contacts/Contacts';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="pageContainer"> 
      <Router>
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
        <Footer />
      </Router>
    </div>
  );
}

export default App;

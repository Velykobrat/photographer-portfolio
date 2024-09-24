import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Collections from './pages/Collections/Collections';
import Press from './pages/Press/Press';
import Contacts from './pages/Contacts/Contacts';
import About from './pages/About/About';
import Footer from './components/Footer/Footer';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.pageContainer}>
      <Router>
        <Header />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Navigate to="/collections" />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/press" element={<Press />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from './assets/img/mariam-alkurd-logo-large.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { AdminDashboard } from "./components/AdminDashboard";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <NavBar />
              <Banner />
              <Skills />
              <Projects />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
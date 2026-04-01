import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cupones from './pages/Cupones';
import ModoPago from './pages/ModoPago';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal que usa el Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="mis-cupones" element={<Cupones />} />
          <Route path="pago" element={<ModoPago />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
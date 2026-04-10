import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; 

export function MainLayout() {
    const [busqueda, setBusqueda] = useState('');

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Pasamos los estados al NavBar */}
            <header>
                <Navbar busqueda={busqueda} setBusqueda={setBusqueda} />
            </header>

            <main className="flex-grow">
                {/* Pasamos el contexto a todas las paginas como Home */}
                <Outlet context={{ busqueda }} />
            </main>

            <footer className="bg-white border-t py-6 text-center text-gray-400 text-sm">
                &copy; 2026 La Cuponera SV - Proyecto Cátedra
            </footer>
        </div>
    );
}

export default MainLayout;
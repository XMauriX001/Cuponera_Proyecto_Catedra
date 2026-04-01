import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar'; 

export function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* El NavBar siempre estará fijo arriba */}
            <header>
                <NavBar />
            </header>

            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Un pie de página sencillo para que se vea Pro */}
            <footer className="bg-white border-t py-6 text-center text-gray-400 text-sm">
                &copy; 2026 La Cuponera SV - Proyecto Cátedra
            </footer>
        </div>
    );
}

export default MainLayout;
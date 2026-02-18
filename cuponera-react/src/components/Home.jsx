import { useState, useEffect } from 'react';
import api from '../api/axios';

export function Home() {
    const [rubros, setRubros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/ofertas')
            .then(response => {
                setRubros(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar ofertas:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Cargando ofertas...</div>;

    return (
        <div>
            <h1>Ofertas Disponibles</h1>
            {rubros.map(rubro => (
                <div key={rubro.id}>
                    <h2>{rubro.nombre}</h2>
                    <div>
                        {rubro.ofertas.map(oferta => (
                            <div key={oferta.id}>
                                <h3>{oferta.titulo}</h3>
                                <p>Precio regular: ${oferta.precio_regular}</p>
                                <p>Precio oferta: ${oferta.precio_oferta}</p>
                                <p>{oferta.descripcion}</p>
                                <button>Comprar</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Home;
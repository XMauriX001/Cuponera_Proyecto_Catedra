import { useState } from "react";

export default function ModoPago({ oferta, onClose, onConfirmarPago }) {

  // Estados simples para inputs
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");
  const [nombre, setNombre] = useState("");

  // La tarjeta no puede pasar de 16 números
  const handleTarjeta = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // solo números
    value = value.slice(0, 16); // máximo 16 dígitos

    // Formato simple 0000 0000 0000 0000
    value = value.replace(/(.{4})/g, "$1 ").trim();

    setTarjeta(value);
  };

  // Limitar fecha MM/YY
  const handleFecha = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 4);

    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    setFecha(value);
  };

  // Limitar CVV 3 números
  const handleCvv = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 3);
    setCvv(value);
  };

  // Botón pagar
  const handlePagar = () => {

  if (!tarjeta || !fecha || !cvv || !nombre) {
    alert("Completa todos los campos");
    return;
  }

  // Validar formato correcto MM/YY
  if (!fecha.includes("/")) {
    alert("Fecha inválida");
    return;
  }

  const [mes, anio] = fecha.split("/");

  const mesNumero = parseInt(mes);
  const anioNumero = parseInt(anio);

  if (mesNumero < 1 || mesNumero > 12) {
    alert("Mes inválido. Debe estar entre 01 y 12");
    return;
  }

  const hoy = new Date();
  const anioActual = hoy.getFullYear() % 100; 
  const mesActual = hoy.getMonth() + 1;

  // Validar vencimiento
  if (
    anioNumero < anioActual ||
    (anioNumero === anioActual && mesNumero < mesActual)
  ) {
    alert("La tarjeta está vencida");
    return;
  }

  
  onConfirmarPago();
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Pago con tarjeta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">✕</button>
        </div>

        {/* Oferta */}
        {oferta && (
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-sm text-gray-500">Estás comprando</p>
            <p className="font-bold">{oferta.titulo}</p>
            <p className="text-green-600 font-bold">${oferta.precio_oferta}</p>
          </div>
        )}

        {/* Inputs */}
        <input
          type="text"
          placeholder="Número de tarjeta"
          value={tarjeta}
          onChange={handleTarjeta}
          className="w-full border rounded-lg p-3"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="MM/YY"
            value={fecha}
            onChange={handleFecha}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={handleCvv}
            className="border rounded-lg p-3"
          />
        </div>

        <input
          type="text"
          placeholder="Nombre del titular"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-3"
          >
            Cancelar
          </button>

          <button
            onClick={handlePagar}
            className="flex-1 bg-blue-600 text-white rounded-xl py-3 font-bold"
          >
            Pagar
          </button>
        </div>

      </div>
    </div>
  );
}

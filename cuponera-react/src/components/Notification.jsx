import React, { useEffect } from 'react';

const styles = {
  success: 'bg-white border-l-4 border-green-500 text-green-900 shadow-2xl',
  error: 'bg-white border-l-4 border-red-500 text-red-900 shadow-2xl',
  info: 'bg-white border-l-4 border-blue-500 text-blue-900 shadow-2xl',
};

// Iconos en formato SVG 
const icons = {
  success: (
    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export const Notification = ({ type = 'success', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    // Se cierra solo después del tiempo definido
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-bounce-in">
      <div className={`flex items-center p-4 rounded-xl min-w-[320px] ${styles[type]}`}>
        <div className="mr-3">
          {icons[type]}
        </div>
        
        <div className="flex-1 mr-4">
          <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Sistema</p>
          <p className="font-bold text-sm text-gray-800">{message}</p>
        </div>

        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;
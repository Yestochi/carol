import React, { useRef, useEffect, useState } from 'react';
import { LogoutIcon } from './Icons';

interface AccountDropdownProps {
  onClose: () => void;
  onLogout: () => void;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ onClose, onLogout }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleLinkClick = (featureName: string) => {
    alert(`${featureName} está em desenvolvimento.`);
    onClose();
  };

  const handleConfirmLogout = () => {
    onLogout();
    onClose();
  };
  
  const handleCancelLogout = () => {
    setShowConfirmLogout(false);
  };

  return (
    <>
      <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-200 z-40 text-gray-800">
        <div className="p-2">
          <div onClick={() => handleLinkClick('Configurações e privacidade')} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-md">
            <span className="ml-2 font-semibold">Configurações e privacidade</span>
          </div>
          <div onClick={() => handleLinkClick('Ajuda e suporte')} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-md">
            <span className="ml-2 font-semibold">Ajuda e suporte</span>
          </div>
          <div className="border-t my-1"></div>
          <div onClick={() => setShowConfirmLogout(true)} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-md">
            <LogoutIcon className="w-5 h-5" />
            <span className="ml-2 font-semibold">Sair</span>
          </div>
        </div>
      </div>

      {showConfirmLogout && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-bold text-gray-800">Confirmar Saída</h3>
            <p className="text-gray-600 mt-2">Você tem certeza que deseja sair?</p>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={handleCancelLogout} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmLogout} 
                style={{ backgroundColor: 'var(--primary-color)' }}
                className="text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountDropdown;
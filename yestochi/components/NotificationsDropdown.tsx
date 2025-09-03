import React, { useRef, useEffect } from 'react';
import { users } from '../services/mockData';

interface NotificationsDropdownProps {
  onClose: () => void;
}

const notifications = [
    { id: 1, text: `${users[1].name} curtiu sua publicação.`, time: 'há 5 minutos', user: users[1] },
    { id: 2, text: `${users[2].name} comentou em uma publicação sua.`, time: 'há 1 hora', user: users[2] },
    { id: 3, text: `${users[4].name} enviou uma solicitação de amizade.`, time: 'há 3 horas', user: users[4] },
];

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-40">
      <div className="p-3 border-b">
        <h3 className="font-bold text-xl text-gray-800">Notificações</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map(notif => (
              <li key={notif.id} className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b">
                <img src={notif.user.profilePicture} alt={notif.user.name} className="w-12 h-12 rounded-full mr-3"/>
                <div>
                  <p className="text-sm text-gray-800">{notif.text}</p>
                  <p className="text-xs text-[var(--primary-color)]">{notif.time}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-gray-500">Nenhuma notificação nova.</p>
        )}
      </div>
       <div className="p-2 text-center border-t">
        <a href="#" onClick={(e) => { e.preventDefault(); alert('Em desenvolvimento'); }} className="text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>Ver todas</a>
      </div>
    </div>
  );
};

export default NotificationsDropdown;

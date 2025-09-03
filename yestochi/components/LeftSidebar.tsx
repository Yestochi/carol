import React from 'react';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { FriendsIcon } from './Icons';

interface LeftSidebarProps {
  onNavigateToProfile: (userId: number) => void;
  nicknames: Record<number, string>;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onNavigateToProfile, nicknames }) => {
  const currentUser = useCurrentUser();
  const displayName = nicknames[currentUser.id] || currentUser.name;

  const handleFeatureClick = () => {
    alert('Esta seção está em desenvolvimento.');
  };

  const menuItems = [
    { icon: <FriendsIcon className="w-8 h-8 text-[var(--primary-color)]" />, name: 'Amigos' },
    { icon: <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y_/-2_T4oP5q5A.png" alt="Grupos" className="w-8 h-8"/>, name: 'Grupos' },
    { icon: <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/bo0Zt3_3uGn.png" alt="Marketplace" className="w-8 h-8"/>, name: 'Mercado' },
    { icon: <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/r3V22n_sD4o.png" alt="Watch" className="w-8 h-8"/>, name: 'Vídeos' },
    { icon: <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y-/r/FhLhDPZke2d.png" alt="Memories" className="w-8 h-8"/>, name: 'Lembranças' },
  ];

  return (
    <div className="sticky top-20 space-y-4">
      <div 
        onClick={() => onNavigateToProfile(currentUser.id)}
        className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
        role="button"
        aria-label={`Ver perfil de ${displayName}`}
      >
        <img src={currentUser.profilePicture} alt={displayName} className="w-8 h-8 rounded-full" />
        <span className="ml-3 font-semibold text-gray-800">{displayName}</span>
      </div>
      {menuItems.map((item, index) => (
        <div key={index} onClick={handleFeatureClick} className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
          {item.icon}
          <span className="ml-3 font-semibold text-gray-800">{item.name}</span>
        </div>
      ))}
      <div className="border-t border-gray-300 pt-4 mt-4">
        <h3 className="text-gray-500 font-semibold mb-2">Seus atalhos</h3>
        <div onClick={handleFeatureClick} className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
            <img src="https://picsum.photos/seed/group1/40/40" alt="shortcut" className="w-8 h-8 rounded-lg" />
            <span className="ml-3 font-semibold text-gray-800">Desenvolvedores React</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
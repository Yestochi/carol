import React, { useState, useRef } from 'react';
import type { User } from '../types';

interface EditProfileModalProps {
  user: User;
  onSave: (updatedData: Partial<Omit<User, 'id'>>) => void;
  onClose: () => void;
  isInitialSetup?: boolean;
}

const fonts = ['Segoe UI', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana'];

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onSave, onClose, isInitialSetup = false }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [profileColor, setProfileColor] = useState(user.profileColor || '#1877F2');
  const [backgroundColor, setBackgroundColor] = useState(user.backgroundColor || '#f0f2f5');
  const [font, setFont] = useState(user.font || 'Segoe UI');
  const [newProfilePicture, setNewProfilePicture] = useState<string | null>(null);
  const [newCoverPhoto, setNewCoverPhoto] = useState<string | null>(null);

  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({
      name,
      bio,
      profilePicture: newProfilePicture || user.profilePicture,
      coverPhoto: newCoverPhoto || user.coverPhoto,
      profileColor,
      backgroundColor,
      font,
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{isInitialSetup ? 'Complete Seu Perfil' : 'Editar Perfil / Configurações'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Fechar">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm p-2 bg-white text-black"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Fale um pouco sobre você..."
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm p-2 bg-white text-black"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
            <div className="mt-2 flex items-center space-x-4">
              <img
                src={newProfilePicture || user.profilePicture}
                alt="Prévia da foto de perfil"
                className="w-20 h-20 rounded-full object-cover"
              />
              <button
                type="button"
                onClick={() => profileFileInputRef.current?.click()}
                className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Fazer Upload
              </button>
              <input
                ref={profileFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setNewProfilePicture)}
                className="hidden"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Foto da Capa</label>
            <div className="mt-2 space-y-2">
              <img
                src={newCoverPhoto || user.coverPhoto}
                alt="Prévia da foto de capa"
                className="w-full h-32 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => coverFileInputRef.current?.click()}
                className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Fazer Upload
              </button>
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setNewCoverPhoto)}
                className="hidden"
                aria-hidden="true"
              />
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tema do Site</h4>
             <div>
                <label htmlFor="profileColor" className="block text-sm font-medium text-gray-700">Cor Principal</label>
                <div className="mt-1 flex items-center space-x-3">
                  <input
                    id="profileColor"
                    type="color"
                    value={profileColor}
                    onChange={(e) => setProfileColor(e.target.value)}
                    className="w-10 h-10 p-0 border-none cursor-pointer rounded-md"
                  />
                  <span className="text-sm text-gray-500">Cor de destaque do seu perfil e do site.</span>
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">Cor de Fundo</label>
                <div className="mt-1 flex items-center space-x-3">
                  <input
                    id="backgroundColor"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-10 h-10 p-0 border-none cursor-pointer rounded-md"
                  />
                  <span className="text-sm text-gray-500">Cor de fundo principal do site.</span>
                </div>
              </div>
               <div className="mt-4">
                <label htmlFor="font" className="block text-sm font-medium text-gray-700">Fonte</label>
                 <select
                  id="font"
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] sm:text-sm p-2 bg-white text-black"
                 >
                   {fonts.map(f => <option key={f} value={f} style={{fontFamily: f}}>{f}</option>)}
                 </select>
              </div>
          </div>

        </div>
        <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
            {isInitialSetup ? 'Fazer isso depois' : 'Cancelar'}
          </button>
          <button 
            onClick={handleSave} 
            style={{ backgroundColor: profileColor }}
            className="text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
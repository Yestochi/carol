import React, { useState, useRef } from 'react';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { PhotoIcon, CloseIcon } from './Icons';

interface CreatePostProps {
  onCreatePost: (text: string, image?: string | null) => void;
  nicknames: Record<number, string>;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost, nicknames }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const currentUser = useCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const displayName = nicknames[currentUser.id] || currentUser.name;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || image) {
      onCreatePost(text, image);
      setText('');
      setImage(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
      setImage(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-start space-x-3 mb-3">
        <img src={currentUser.profilePicture} alt={currentUser.name} className="w-10 h-10 rounded-full" />
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={image ? 'Diga algo sobre esta foto...' : `No que você está pensando, ${displayName.split(' ')[0]}?`}
            className="w-full border border-gray-200 rounded-lg bg-white p-3 focus:ring-2 focus:ring-[var(--primary-color)] resize-none text-lg text-black"
            rows={image ? 2 : 3}
          />
        </form>
      </div>
        
      {image && (
        <div className="mt-3 relative">
            <div className="bg-gray-100 p-2 rounded-lg">
              <img src={image} alt="Prévia da imagem" className="max-h-80 w-full object-contain rounded-md" />
            </div>
            <button
                onClick={removeImage}
                className="absolute top-3 right-3 bg-gray-800 bg-opacity-60 text-white rounded-full p-1.5 hover:bg-opacity-80 transition-opacity"
                aria-label="Remover imagem"
            >
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
      )}

      <div className="border-t border-gray-200 mt-3 pt-3">
        <div className="flex justify-between items-center">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
                <PhotoIcon className="w-6 h-6 text-green-500" />
                <span>Foto/Vídeo</span>
            </button>
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                aria-hidden="true"
            />
          <button
            type="submit"
            onClick={handleSubmit}
            style={{ backgroundColor: 'var(--primary-color)' }}
            className="w-1/2 text-white font-bold py-2 px-4 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
            disabled={!text.trim() && !image}
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
import React, { useState } from 'react';
import type { User } from '../types';
import { EyeIcon, EyeSlashIcon } from './Icons';

interface AuthPageProps {
  onLogin: (name: string, password: string) => Promise<boolean>;
  onRegister: (userData: Omit<User, 'id'>) => Promise<void>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await onLogin(name, password);
    if (!success) {
      setError('Nome de usuário ou senha incorretos. Tente novamente.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !password.trim()) {
        setError('Nome e senha são obrigatórios.');
        return;
    }
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('A senha deve conter pelo menos uma letra maiúscula.');
      return;
    }
    if (!/\d/.test(password)) {
      setError('A senha deve conter pelo menos um número.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    await onRegister({
      name,
      password,
      profilePicture: `https://picsum.photos/seed/${name}/200/200`,
      coverPhoto: `https://picsum.photos/seed/${name}-cover/1000/300`,
      profileColor: '#1877F2',
      backgroundColor: '#f0f2f5',
      font: 'Segoe UI',
    });
  };

  const clearForm = () => {
    setName('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setIsPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ backgroundColor: 'var(--background-color)'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-5xl font-bold" style={{ color: 'var(--primary-color)' }}>yestochi</h1>
            <p className="text-xl text-gray-600 mt-2">Conecte-se com seus amigos e com o mundo ao seu redor no Yestochi.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-gray-700">Entrar</h2>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div>
                <label htmlFor="login-name" className="sr-only">Nome</label>
                <input
                  id="login-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome de usuário"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 bg-white text-black"
                  style={{'--tw-ring-color': 'var(--primary-color)'} as React.CSSProperties}
                  required
                />
              </div>
               <div className="relative">
                <label htmlFor="login-password" className="sr-only">Senha</label>
                <input
                  id="login-password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 bg-white text-black"
                  style={{'--tw-ring-color': 'var(--primary-color)'} as React.CSSProperties}
                  required
                />
                <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                >
                    {isPasswordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                Entrar
              </button>
              <p className="text-center text-sm text-gray-600">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); clearForm(); }}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--primary-color)' }}
                >
                  Cadastre-se
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
               <h2 className="text-2xl font-semibold text-center text-gray-700">Criar Nova Conta</h2>
               {error && <p className="text-red-500 text-sm text-center">{error}</p>}
               <div>
                <label htmlFor="reg-name" className="sr-only">Nome</label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 bg-white text-black"
                  style={{'--tw-ring-color': 'var(--primary-color)'} as React.CSSProperties}
                  required
                />
              </div>
              <div className="relative">
                <label htmlFor="reg-password" className="sr-only">Senha</label>
                <input
                  id="reg-password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 bg-white text-black"
                  style={{'--tw-ring-color': 'var(--primary-color)'} as React.CSSProperties}
                  required
                />
                 <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                >
                    {isPasswordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
               <div className="relative">
                <label htmlFor="reg-confirm-password" className="sr-only">Confirmar Senha</label>
                <input
                  id="reg-confirm-password"
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar Senha"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 bg-white text-black"
                  style={{'--tw-ring-color': 'var(--primary-color)'} as React.CSSProperties}
                  required
                />
                <button
                    type="button"
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={isConfirmPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                >
                    {isConfirmPasswordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors bg-green-600 hover:bg-green-700"
              >
                Cadastrar
              </button>
               <p className="text-center text-sm text-gray-600">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); clearForm(); }}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--primary-color)' }}
                >
                  Entrar
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
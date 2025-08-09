import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to login');
      }

      const data = await response.json();
      console.log('Login successful', data);
      // Aqui você pode salvar o token e redirecionar o usuário
      localStorage.setItem('token', data.token);

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-5 py-7">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <label className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
        required
      />
      <label className="font-semibold text-sm text-gray-600 pb-1 block">Senha</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
        required
      />
      <button
        type="submit"
        className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
      >
        <span className="inline-block mr-2">Login</span>
      </button>
    </form>
  );
};

export default Login;

import { useState } from 'react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('PASSENGER');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, role }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to register');
      }

      const data = await response.json();
      console.log('Registration successful', data);
      // Aqui você pode redirecionar o usuário ou atualizar o estado do app

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-5 py-7">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <label className="font-semibold text-sm text-gray-600 pb-1 block">Nome</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
        required
      />
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
      <label className="font-semibold text-sm text-gray-600 pb-1 block">Telefone</label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
      />
      <label className="font-semibold text-sm text-gray-600 pb-1 block">Tipo de Conta</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
      >
        <option value="PASSENGER">Passageiro</option>
        <option value="DRIVER">Motorista</option>
      </select>
      <button
        type="submit"
        className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
      >
        <span className="inline-block mr-2">Registrar</span>
      </button>
    </form>
  );
};

export default Register;

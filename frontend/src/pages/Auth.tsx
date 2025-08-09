import { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 className="font-bold text-center text-2xl mb-5">Seu App de Mobilidade</h1>
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          {isLogin ? <Login /> : <Register />}
        </div>
        <div className="mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

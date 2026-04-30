import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Menembak API Backend yang kamu buat kemarin
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
                email: email,
                password: password
            });

            // Simpan Karcis (Token JWT) di brankas browser (LocalStorage)
            localStorage.setItem('token', response.data.token);
            alert('Login Berhasil!');

            // Arahkan ke halaman Dashboard
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal login! Cek lagi email/passwordnya.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-indigo-600">AI Ads Advisor</h1>
                    <p className="text-gray-500 mt-2">Masuk untuk menganalisa iklanmu</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username/Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Masukan email atau username Anda"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Masukan password Anda"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300"
                    >
                        {isLoading ? 'Mengecek Kunci...' : 'Masuk Sekarang'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                        Daftar di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}
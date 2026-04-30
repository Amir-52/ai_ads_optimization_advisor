import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Password dan konfirmasi password tidak cocok!');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('http://localhost:5000/api/register', {
                name: name,
                email: email,
                password: password
            });

            alert('Registrasi berhasil! Silakan login.');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal registrasi! Coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-indigo-600">AI Ads Advisor</h1>
                    <p className="text-gray-500 mt-2">Buat akun baru untuk mulai menganalisa iklan</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Nama kamu"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="email@gmail.com"
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
                            placeholder="Minimal 6 karakter"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Ulangi password kamu"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300"
                    >
                        {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}

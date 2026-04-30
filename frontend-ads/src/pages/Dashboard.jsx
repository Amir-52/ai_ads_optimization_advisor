import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // State Form disesuaikan pakai garis bawah (_) dan tambah language
    const [formData, setFormData] = useState({
        campaign_name: '', platform: 'Facebook Ads', impressions: '',
        clicks: '', conversions: '', spend: '', start_date: '', end_date: '', language: 'en'
    });

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate('/login');
            return;
        }
        fetchCampaigns();
    }, [navigate]);

    const fetchCampaigns = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/campaigns`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setCampaigns(res.data.data);
        } catch (error) {
            console.error("Gagal tarik data", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/campaigns`, formData, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            alert('Berhasil dianalisa oleh Gemini AI!');
            fetchCampaigns();
            // Kosongkan form setelah sukses (bahasa jangan dikosongkan)
            setFormData({ ...formData, campaign_name: '', impressions: '', clicks: '', conversions: '', spend: '' });
        } catch (error) {
            alert('Gagal menganalisa. Cek koneksi backend/AI.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="flex justify-between items-center bg-indigo-600 text-white p-4 rounded-xl shadow-md mb-6">
                <h1 className="text-2xl font-bold">AI Ads Advisor Dashboard</h1>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition">
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom Kiri: Form Input */}
                <div className="bg-white p-6 rounded-xl shadow-md h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Input Data Iklan</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Kampanye</label>
                            <input type="text" name="campaign_name" value={formData.campaign_name} onChange={handleChange} required className="w-full border p-2 rounded mt-1" />
                        </div>

                        {/* DROPDOWN PILIHAN BAHASA AI ADA DI SINI */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bahasa Analisa AI</label>
                            <select name="language" value={formData.language} onChange={handleChange} className="w-full border-2 border-indigo-300 bg-indigo-50 p-2 rounded mt-1 font-bold text-indigo-700 outline-none">
                                <option value="en">🇺🇸 English</option>
                                <option value="id">🇮🇩 Bahasa Indonesia</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Platform</label>
                            <select name="platform" value={formData.platform} onChange={handleChange} className="w-full border p-2 rounded mt-1">
                                <option value="Facebook Ads">Facebook Ads</option>
                                <option value="Google Ads">Google Ads</option>
                                <option value="TikTok Ads">TikTok Ads</option>
                                <option value="Instagram Ads">Instagram Ads</option>
                                <option value="LinkedIn Ads">LinkedIn Ads</option>
                                <option value="YouTube Ads">YouTube Ads</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Impressions</label>
                                <input type="number" name="impressions" value={formData.impressions} onChange={handleChange} required className="w-full border p-2 rounded mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Clicks</label>
                                <input type="number" name="clicks" value={formData.clicks} onChange={handleChange} required className="w-full border p-2 rounded mt-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Conversions</label>
                                <input type="number" name="conversions" value={formData.conversions} onChange={handleChange} required className="w-full border p-2 rounded mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Spend ($)</label>
                                <input type="number" step="0.01" name="spend" value={formData.spend} onChange={handleChange} required className="w-full border p-2 rounded mt-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required className="w-full border p-2 rounded mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required className="w-full border p-2 rounded mt-1" />
                            </div>
                        </div>
                        <button type="submit" disabled={isGenerating} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-indigo-700 disabled:bg-indigo-300 transition">
                            {isGenerating ? 'AI Sedang Menganalisa...' : 'Analisa dengan AI'}
                        </button>
                    </form>
                </div>

                {/* Kolom Kanan: Riwayat Analisa */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">Riwayat Analisa Kampanye</h2>
                    {campaigns.length === 0 ? (
                        <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-500">Belum ada data. Silakan input iklan pertamamu!</div>
                    ) : (
                        campaigns.map((camp) => (
                            <div key={camp.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{camp.campaign_name}</h3>
                                        <p className="text-sm text-gray-500">{camp.platform} | {camp.start_date} to {camp.end_date}</p>
                                    </div>
                                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                                        Spend: ${camp.spend}
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap font-sans text-sm border border-slate-200">
                                    <span className="font-bold text-indigo-600">🤖 Saran Gemini AI:</span><br /><br />
                                    {/* Tarik data dari ai_analysis */}
                                    {camp.ai_analysis}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
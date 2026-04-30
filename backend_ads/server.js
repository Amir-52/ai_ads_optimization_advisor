require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const verifyToken = require('./middleware/auth');
const { sequelize, User, Campaign } = require('./models');

const app = express();
const PORT = process.env.PORT;

// AI Gemini Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("Status Gemini API:", process.env.GEMINI_API_KEY ? "AKTIF" : "TIDAK AKTIF");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: "Backend Ads Optimization Nyala!" });
});

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Password di acak 10 kali putaran biar aman
        const hashedPassword = await bcrypt.hash(password, 10);

        // Menyimpan data ke database
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword // yang disimpan, yang sudah diacak
        });

        res.status(201).json({
            message: 'Register sukses!',
            data: { name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Gagal register, mungkin email sudah terdaftar!'
        });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user di database berdasarkan email
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(400).json({
                message: "Email tidak ditemukan"
            });
        }

        // cek password yang diketik dengan password acak di database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Password salah!"
            });
        }

        // kalau password cocok, cetak Token JWT
        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET || 'Kunci_Rahasia_Default', { expiresIn: '24h' });

        res.json({
            message: "Login berhasil, selamat datang!",
            token: token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Gagal login karena  server sedang erorr"
        });
    }
});

// Smart Ads Optimization (AI)
// === JALUR ANALISA IKLAN (Inti Aplikasi) ===
app.post('/api/campaigns', verifyToken, async (req, res) => {
    try {
        // 1. Tangkap data pakai format garis bawah (_) sesuai aslinya
        const { campaign_name, platform, impressions, clicks, conversions, spend, start_date, end_date, language } = req.body;
        const user_id = req.user.id;

        // 2. Logika Pemilihan Bahasa Prompt
        let prompt = "";

        if (language === 'id') {
            prompt = `
                Saya punya data iklan digital sebagai berikut:
                - Nama Kampanye: ${campaign_name}
                - Platform: ${platform}
                - Impressions (Tayangan): ${impressions}
                - Clicks (Klik): ${clicks}
                - Conversions (Konversi): ${conversions}
                - Total Spend (Biaya): $${spend}
                
                Tolong analisa performa iklan ini secara singkat. Hitung CTR, CPC, dan CPA-nya. 
                Lalu berikan 2 poin saran optimasi yang spesifik untuk meningkatkan performa iklan ini. 
                Jawab dengan format teks yang rapi dan profesional dalam Bahasa Indonesia.
            `;
        } else {
            // Default ke Bahasa Inggris
            prompt = `
                I have the following digital ad campaign data:
                - Campaign Name: ${campaign_name}
                - Platform: ${platform}
                - Impressions: ${impressions}
                - Clicks: ${clicks}
                - Conversions: ${conversions}
                - Total Spend: $${spend}
                
                Please analyze this ad performance briefly. Calculate the CTR, CPC, and CPA based on the data. 
                Then, provide 2 specific and actionable optimization suggestions to improve this campaign's performance. 
                Provide the response in a clean, professional English text format.
            `;
        }

        // 3. Kirim ke Google Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const ai_analysis = result.response.text();

        // 4. Simpan ke Database
        const newCampaign = await Campaign.create({
            user_id: user_id,
            campaign_name: campaign_name,
            platform: platform,
            impressions: impressions,
            clicks: clicks,
            conversions: conversions,
            spend: spend,
            start_date: start_date,
            end_date: end_date,
            ai_analysis: ai_analysis
        });

        res.status(201).json({
            message: "Data berhasil dianalisa dan disimpan!",
            data: newCampaign
        });

    } catch (error) {
        console.error("Gagal menganalisa data AI: ", error.message);
        res.status(500).json({
            message: "Terjadi kesalahan pada AI atau server.",
            error: error.message
        });
    }
});

// === JALUR AMBIL DATA (Untuk Ditampilkan di Dashboard) ===
app.get('/api/campaigns', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Ambil ID user dari karcis JWT

        // Cari semua iklan yang cuma milik user ini
        const campaigns = await Campaign.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']] // Urutkan dari yang paling baru
        });

        res.json({ message: "Data berhasil ditarik!", data: campaigns });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal menarik data." });
    }
});

app.listen(PORT, async () => {
    console.log(`Server nyala di http://localhost:${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Koneksi ke Database PostgreSQL berhasil!');
    } catch (error) {
        console.error('Gagal terhubung ke database', error);
    }
});
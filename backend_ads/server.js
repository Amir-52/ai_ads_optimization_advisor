const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, User } = require('./models');

const app = express();
const PORT = 5000;

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
        }, 'Kunci_Rahasia', { expiresIn: '1h' });

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

app.listen(PORT, async () => {
    console.log(`Server nyala di http://localhost:${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Koneksi ke Database PostgreSQL berhasil!');
    } catch (error) {
        console.error('Gagal terhubung ke database', error);
    }
});
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // cek token apakah ada di header atau tidak
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({
            message: "Token tidak ada, silahkan login kembali"
        });
    }

    const token = authHeader.split(' ')[1]; // Bearer Token jadi Token saja

    try {
        const decoded = jwt.verify(token, 'Kunci_Rahasia'); // KunciRahasia harus sama persis saat login
        req.user = decoded; // menyimpan data user ke request
        next(); // Silahkan lewat!
    } catch (error) {
        return res.status(401).json({
            message: "Token tidak valid atau sudah kadaluarsa"
        })
    }
}

module.exports = verifyToken;
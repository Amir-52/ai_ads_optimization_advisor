require('dotenv').config();

const dbConfig = {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

module.exports = {
  development: {
    // Jika ada DATABASE_URL (seperti di Railway), pakai itu. Jika tidak, pakai variabel individu.
    ...(process.env.DATABASE_URL
      ? { use_env_variable: 'DATABASE_URL' }
      : {
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_NAME || 'ads_optimization_db',
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 5432,
      }
    ),
    ...dbConfig,
    // Matikan SSL jika di localhost agar tidak error
    dialectOptions: (process.env.DB_HOST === '127.0.0.1' || !process.env.DATABASE_URL) ? {} : dbConfig.dialectOptions
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    ...dbConfig
  }
};
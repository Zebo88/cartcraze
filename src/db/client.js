import pkg from 'pg';
const { Client } = pkg;

const url = "postgresql://cartcraze_db_eqcv_user:Jng89PQTfX779unLvhuPC8739mEVnKQw@dpg-cs4s01q3esus73alfo7g-a.oregon-postgres.render.com/cartcraze_db_eqcv";

const connectionString = process.env.DATABASE_URL || url;

// const client = new Client({
//   connectionString,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
// });
const client = new Client({
  connectionString: process.env.DATABASE_URL || url,
  ssl: {
    rejectUnauthorized: false, // Set to true in production for enhanced security
  },
});

export default client;
import pkg from 'pg';
const { Client } = pkg;


const url = "postgresql://cartcraze_db_2_o7a9_user:iyrCdNEf8NMP1RrD7L865T1AG5ZHtiLn@dpg-d0vor50gjchc73a0hh8g-a/cartcraze_db_2_o7a9";
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
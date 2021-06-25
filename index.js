const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use(authRoutes);

const main = async () => {
  await app.listen(process.env.PORT || 5000);
  console.log('Server running on http://localhost:5000');
  await sequelize.authenticate();
  console.log('Database connect succesfully');
};

main();

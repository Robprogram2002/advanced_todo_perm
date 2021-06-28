const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const proyectRoutes = require('./routes/proyectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use(authRoutes);
app.use('/proyect', proyectRoutes);
app.use('/tasks', taskRoutes);

const main = async () => {
  await app.listen(process.env.PORT || 5000);
  console.log('Server running on http://localhost:5000');
  await sequelize.authenticate();
  console.log('Database connect succesfully');
};

main();

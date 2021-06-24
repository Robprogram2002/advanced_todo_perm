const express = require('express');

const app = express();
const cors = require('cors');

const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);

app.get('/test', (req, res) => {
  res.send('<h1> Hello from the server </h1>');
});

const main = async () => {
  await app.listen(process.env.PORT || 5000);
  console.log('Server running on http://localhost:5000');
  await sequelize.authenticate();
  console.log('Database connect succesfully');
};

main();

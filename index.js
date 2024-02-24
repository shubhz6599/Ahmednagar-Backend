require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
// const { PORT } = require('./config/env');
const path = require('path');
const cors = require('cors');

const app = express();
// .env

const port = process.env.PORT || 3000;;

app.use(bodyParser.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/post', postRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

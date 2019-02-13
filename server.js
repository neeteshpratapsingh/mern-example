const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true });

app.get('/', (req, res) => res.send('Hello world'));

app.use('./api/users', users);
app.use('./api/profile', profile);
app.use('./api/posts', posts);

const port = process.env.port || 5000;

app.listen(port, () => console.log(`server running on ${port}`));

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Import user routes

const app = express();
app.use(bodyParser.json());

// Use the user routes
app.use('/api/users', userRoutes);

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
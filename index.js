const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const quizRoutes = require('./routes/quizRoutes');

// 2. Initialize Express app
const app = express();

// 3. Connect to MongoDB database
mongoose.connect("mongodb+srv://devashish:qwerty123@cluster0.2zfm4jg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// 4. Middleware
app.use(bodyParser.json());

// 5. Define routes
app.use('/quizzes', quizRoutes);

// 6. Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// 7. Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware setup
app.use(morgan('dev')); // Logging middleware
app.use(cors()); // Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Sample route configuration
app.get('/api/example', (req, res) => {
    res.json({ message: 'This is an example route.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Sorry, not found!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
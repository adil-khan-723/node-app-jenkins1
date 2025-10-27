const express = require('express');
const cors = require('cors');
const messageRoute = require('./routes/message');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', messageRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
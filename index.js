const express = require('express');
const path = require('path')
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/ping', (req, res) => {
    res.json({ ping: 'pong' })
})


app.listen(PORT, () => {
    console.log(`Corriendo en http://localhost:${PORT}`);
})



const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/ping', (req, res) => {
    res.json({ ping: 'pong' })
})


app.listen(PORT, () => {
    console.log(`Corriendo en http://localhost:${PORT}`);
})



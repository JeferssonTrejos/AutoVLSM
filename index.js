const express = require('express');
const path = require('path')
const app = express();
const PORT = 3000;

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/helloworld', (req, res) => {
    res.json('<h1>helloworld</h1>')
})

app.listen(PORT, () => {
    console.log(`Corriendo en http://localhost:${PORT}`);
})



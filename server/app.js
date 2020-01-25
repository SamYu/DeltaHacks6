const express = require('express');

const app = express();

app.use(express.json());

app.get('/test', (req, res) => {
    res.send({message: 'API is working!'});
})
app.get('/*', (req, res) => {
    res.send({message: "hello world"} );
});

app.listen(8080, () => console.log('Server started...!'));

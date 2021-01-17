const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); //During dev tests on local machina

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});*/

app.use(cors()); //During dev tests on local machina

require('./app/controller/index')(app);

app.listen(3001);
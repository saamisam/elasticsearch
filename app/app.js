const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);

const routes = require('./routes');

//Port number
const port = 3000;

// app.set('root', `${__dirname}/..`);

//Cors Module
app.use(cors());

// app.use(express.static(path.join(__dirname,'public')));

//Body Parser
app.use(bodyParser.json());

//Session initialize
// app.use(session({secret: 'abcd', saveUninitialized: true, resave: true}));
//Product Routing
app.use(routes);

server.listen(port, () => {
    console.log('Server Started'+port);
});

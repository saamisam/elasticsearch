const app = module.exports = require('express')();
const {
    add_document
} = require('../actions/').add_document;
const {
    create_index
} = require('../actions').create_index;
const {
    get_info
} = require('../actions').get_info;
const {
    create_mapping
} = require('../actions').create_mapping;
const {
    add_settings
} = require('../actions').add_settings;

app.post('/addDocument', (req,res) => {
    add_document(req.body)
        .then((project) => res.send({project}))
        .catch((err) => {
            res.status(400).send(err);
        });
});
  
app.post('/createIndex', (req,res) => {
    create_index(req.body)
        .then((project) => res.send({project}))
        .catch((err) => {
            res.status(400).send(err);
        });
});
  
app.post('/createMapping', (req,res) => {
    create_mapping(req.body)
        .then((project) => res.send({project}))
        .catch((err) => {
            res.status(400).send(err);
        });
});
  
app.post('/addSettings', (req,res) => {
    add_settings(req.body)
        .then((project) => res.send({project}))
        .catch((err) => {
            res.status(400).send(err);
        });
});
  
app.get('/getInfo', (req,res) => {
    get_info(req.body)
        .then((project) => res.send({project}))
        .catch((err) => {
            res.status(400).send(err);
        });
});
  
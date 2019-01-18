const app = module.exports = require('express')();
const elastic = require('../controllers/elasticController');
const list = require('../controllers/listController');
// const {
//     create_index
// } = require('../actions').create_index;
// const {
//     get_info
// } = require('../actions').get_info;
// const {
//     create_mapping
// } = require('../actions').create_mapping;
// const {
//     add_settings
// } = require('../actions').add_settings;

// app.post('/addDocument', (req,res) => {
//     add_document(req.body)
//         .then((project) => res.send({project}))
//         .catch((err) => {
//             res.status(400).send(err);
//         });
// });
  
app.get('/createMovieIndex', (req,res) => {
    elastic.createMovieIndex(req.body)
        .then((project) => res.send({project}))
        .catch((err) => {
            res.status(400).send(err);
        });
});
  
app.get('/createEventIndex', (req,res) => {
    elastic.createEventIndex(req.body)
        .then((project) => res.send({project}))
        .catch((err) => {
            res.status(400).send(err);
        });
});

/** To create update and delete single entity */
app.post('/singlecontentcreateupdate', (req, res) => {
    elastic.singleContentCreateUpdate(req.body)
        .then((event) => res.send({event}))
        .catch((err) => {
            res.status(400).send(err);
        });
});
app.post('/list', (req,res) => {
    list.getlist(req.body, res);
        // .then((project) => res.send({project}))
        // .catch((err) => {
        //     res.status(400).send(err);
        // });
});

app.post('/dynamic', (req,res) => {
    list.dynamic(req.body, res);
        // .then((project) => res.send({project}))
        // .catch((err) => {
        //     res.status(400).send(err);
        // });
});
  
// app.post('/addSettings', (req,res) => {
//     add_settings(req.body)
//         .then((project) => res.send({project}))
//         .catch((err) => {
//             res.status(400).send(err);
//         });
// });
  
// app.get('/getInfo', (req,res) => {
//     get_info(req.body)
//         .then((project) => res.send({project}))
//         .catch((err) => {
//             res.status(400).send(err);
//         });
// });
  
var client = require('../config/connection.js');

function create_index(req){
  return Promise.resolve(
    client.indices.create({  
      index: 'prod_movies'
    },function(err,resp,status) {
      if(err) {
       return err;
      }
      else {
        return resp;
      }
  }));
}

module.exports = {create_index}
var client = require('../config/connection.js');

function get_info(req){
  var status = {}
  client.cluster.health({},function(err,resp,status) {  
    console.log("-- Client Health --",resp);
    status.health = resp;
  });

  client.count({index: 'prod_movies'},function(err,resp,status) {  
      console.log("movies",resp);
      status.movies = resp;
  });
  return Promise.resolve(status);
}

module.exports = {get_info};
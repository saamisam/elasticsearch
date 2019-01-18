const db = require('../config/db');
module.exports = {
    dynamicListPages: function(slug) {
        return new Promise((resolve, reject)=> {
            db.query("SELECT * FROM content_list_pages where slug = '"+slug+"'", function(err, result, fields){
                if(err){
                    console.log(err);
                }
                // console.log('result', result);
                resolve(result);
            });
        });
    },
    
}
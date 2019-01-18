const db = require('../config/db');
module.exports = {
    getAllFilterGroups: ()=> {
        return new Promise((resolve, reject)=> {
            db.query("SELECT * FROM filter_group where is_active = 1", function (err, result, fields) {
                resolve(result);
            });            
        });
    }
    // getAllFilterGroups: function(){
    //     const results = FilterGroup.find({isActive:1});
    //     return results;
    // }
};
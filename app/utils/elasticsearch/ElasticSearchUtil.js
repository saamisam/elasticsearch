var elasticClient = require("./elasticConnection.js");

module.exports = {
    initiateIndex: function(index, mapping) {
        return elasticClient.indices.create({
          index: index,
          body: mapping
        });
    },
    //5. Bulk Document Add / Update
    bulkDocument: function(bulk) {
        return new Promise((resolve, reject) => {
            elasticClient.bulk(
                {
                    body: bulk
                },
                (err, resp) => {
                    if (err) {
                        console.log('err', err);
                        reject(err);
                    }else{
                        console.log('resp',resp);
                        console.log("elastic bulk done");
                        return resolve(resp);
                    }
                }
            );
        });
    },

}

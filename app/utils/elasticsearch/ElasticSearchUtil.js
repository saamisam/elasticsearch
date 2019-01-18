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
    removeUpdateAlias: function(aliasName, indexName) {
        return elasticClient.indices.updateAliases({
          body: {
            actions: [
              { remove: { index: "*", alias: aliasName } },
              { add: { index: indexName, alias: aliasName } }
            ]
          }
        });
    },
    getContent: function(query) {
        return elasticClient.search({
          index: "events_1546135013678",
          body: query
        });
    },

    singleCreateEntity: function(aliasName, type, documentId, entityData) {
        return elasticClient.create({
          index: aliasName,
          type: type,
          id: documentId,
          body: entityData
        });
    },

    singleExistEntity: function(aliasName, type, documentId) {
        return elasticClient.exists({
          index: aliasName,
          type: type,
          id: documentId
        });
    },
    
    
    singleDeleteEntity: function(aliasName, type, documentId) {
        return elasticClient.delete({
          index: aliasName,
          type: type,
          id: documentId
        });
    },
    
    
}

const ElasticSearchUtil = require('../utils/elasticsearch/ElasticSearchUtil');
module.exports = {

    getESContent: function(query){
        var results = ElasticSearchUtil.getContent(query);
        return results;
    }

}
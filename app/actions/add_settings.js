var client = require('../config/connection.js');

function add_settings(req){
    client.indices.putSettings({
        "index": "",
        "body":{
            "index":{
            "number_of_shards":"3",
            //    "provided_name":"prod_movies",
            //    "creation_date":"1539613772842",
            "analysis":{
                "filter":{
                    "permutations":{
                        "max_shingle_size":"5",
                        "min_shingle_size":"2",
                        "type":"shingle"
                    },
                    "delimiter":{
                        "catenate_all":"true",
                        "type":"word_delimiter",
                        "catenate_numbers":"true",
                        "preserve_original":"true",
                        "catenate_words":"true"
                    },
                    "autocomplete_filter":{
                        "type":"edge_ngram",
                        "min_gram":"1",
                        "max_gram":"20"
                    }
                },
                "analyzer":{
                    "my_english":{
                        "type":"standard",
                        "stopwords":"_english_"
                    },
                    "autocomplete":{
                        "filter":[
                        "lowercase",
                        "autocomplete_filter",
                        "delimiter",
                        "permutations"
                        ],
                        "type":"custom",
                        "tokenizer":"standard"
                    }
                }
            },
            "number_of_replicas":"2",
            //    "uuid":"rjhAoLV9T7GhG0H6ccu49w",
            //    "version":{
            //       "created":"6040299"
            //    }
            }
        }
    },function(err,resp,status){
        if (err) {
        console.log(err);
        }
        else {
        console.log(resp);
        }
    });
}

module.exports = {add_settings}
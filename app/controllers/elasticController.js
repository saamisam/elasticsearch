const custom = require('../config/custom').custom;
const async = require('async');
const MovieElasticSearchUtil = require('../utils/elasticsearch/MovieElasticSearchUtil')

module.exports = {
    addSettings: async()=>{
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
    },

    addDocument: async()=>{
        return Promise.resolve(
        // var client = require('./connection.js');
        db.query("SELECT a.name, a.slug, a.global_launch, a.initial_followers_count, a.short_description, a.launch_date, a.id, d.duration, d.id as movie_details_id, e.robots_meta_tag, e.anchor_text, e.meta_description, e.page_title FROM contents a INNER JOIN movie_details d ON a.id = d.content_id INNER JOIN seo_informations e ON a.id = e.content_id WHERE a.content_type = 0 LIMIT 2", function (err, result, fields) {
            if (err) throw err;
            result.forEach(async(row) => {
                var data = {};
                data.launchCountries = getAdditionalData(row.id, (err, data) => {  
                    if(err)
                        console.log('err', err);
                    else{
                        // images = images(data.image_name, function(err, val){
                        //     console.log('val', val);
                        // });
                        images = processImage(data.image_name);
                        cast_crew = processCast(data.cast_crew);
                        data.duration = row.duration;
                        var seo = {}
                        seo.pageTitle = row.pageTitle;
                        seo.metaDescription = row.metaDescription;
                        seo.anchorText = row.anchorText;
                        seo.robotsMetaTag = row.robotsMetaTag;
                        data.seo = seo;
                        data.languages = [data.languages];
                        data.globalLaunch = row.global_launch;
                        data.genre = [data.genres];
                        data.name = row.name;
                        data.slug = row.slug;
                        data.movie_details_id = row.movie_details_id;
                        data.followCount = row.initial_followers_count;
                        data.coverImage = images.cover;
                        data.posterImage = images.poster;
                        data.images = images.other;
                        data.cast = cast_crew.cast;
                        data.crew = cast_crew.crew;
                        data.links = [data.links];
                        data.videos = [];
                        data.songVideos = [];
                        data.shortDesc = row.short_description;
                        data.launchDate =  row.launch_date;
                        data.formattedLaunchDate = "";
                        data.trailerUrl = "";
                        data.videoYoutubeId = "";
                        data.content_id = "";
                        data.launchDateEpoch = "";
                        data.keywords = "";
                        data.popularity = "";
                        data.objectID = "";
    
                        client.index({  
                            index: 'prod_movies',
                            body: {data}
                            },function(err,resp,status) {
                                console.log('resp', resp);
                                return resp;
                        });
                    
                        // console.log('data', data);
                    }
                });
            });
        }));
    },

    // createMovieIndex: async()=>{
    //     client.indices.create({  
    //         index: 'prod_movies'
    //         },function(err,resp,status) {
    //         if(err) {
    //             return err;
    //         }
    //         else {
    //             return resp;
    //         }
    //     });
    // },
    createMovieIndex: function(req, res) {
        // console.log('aaaaaaa')
        return new Promise((resolve, reject)=>{
            
            async.waterfall(
                [
                    function(callback) {
                        console.log("Bulk Content Elastic Index Step 1: Create New Index with mapping.");
                        let newIndexName = custom.MOVIE_INDEX_NAME + "_" + new Date().getTime();
                        MovieElasticSearchUtil.createNewIndex(newIndexName)
                        .then(result => {
                            callback(null, newIndexName);
                        })
                        .catch(err => {
                            console.log(err); 
                        });
                    },
            
                    function(newIndexName, callback) {
                        console.log("Content New Index Name - ", newIndexName);
                        console.log("Bulk Content Elastic Index Step 2: Copy data form DB to Elastic and upload in bulk mode.");
                        MovieElasticSearchUtil.copyDataToNewElasticIndexFromDB(newIndexName)
                        .then(result => {
                            callback(null, newIndexName, "dataWithPriceOrder");
                        })
                        .catch(err => {
                            console.log(err); 
                        });
                    }
            
                    // function(newIndexName, arg2, callback) {
                    //     console.log("Bulk Content Elastic Index Step 3: Toggle Content elastic index name with Alias name.");
                    //     ContentElasticSearchUtil.toggleAlliasName(newIndexName)
                    //     .then(result => {
                    //         callback(null, newIndexName, "dataWithPriceOrder");
                    //     })
                    //     .catch(err => {
                    //         console.log(err); 
                    //     });
                    // }
                ],
                (error, success) => {
                    if (error) {
                        reject(error)
                        // alert("Something is wrong!");
                    }
                    resolve(success)
                    resolve('Hurray Done')
                    // console.log("Done!");
                    // return Promise.resolve("Hurray Done!!");
                }
            )
        })
    },

    createMapping: async()=>{

    },

    getInfo: async()=>{

    }
}
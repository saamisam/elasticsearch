var client = require('../config/connection.js');

function create_mapping(req){
    client.indices.putMapping({  
    index: 'prod_movies',
    type: 'movies',
    body: {
        "properties": {
            "launchCountries": {
                "type": "keyword",
                "store": true
            },
            "duration": {
                "type": "integer",
                "index": false
            },
            "seo": {
                "properties": {
                    "pageTitle": {"type": "text", "index": false},
                    "metaDescription": {"type": "text", "index": false},
                    "anchorText": {"type": "text", "index": false},
                    "robotsMetaTag": {"type": "text", "index": false}
                }
            },
            "languages": {
                "type": "keyword",
                "store": true
            },
            "globalLaunch": {
                "type": "boolean",
                "index": false
            },
            "genre": {
                "type": "keyword",
                "store": true
            },
            "name": {
                "type": "text",
                "store": true
            },
            "slug": {
                "type": "text",
                "index": false
            },
            "movie_details_id": {
                "type": "integer",
                "index": false
            },
            "followCount": {
                "type": "integer",
                "index": false
            },
            "coverImage": {
                "type": "text",
                "index": false
            },
            "posterImage": {
                "type": "text",
                "index": false
            },
            "images": {
                "properties": {
                    "url": {
                        "type": "text",
                        "index": false
                    },
                    "width": {
                        "type": "integer",
                        "index": false
                    },
                    "height": {
                        "type": "integer",
                        "index": false
                    }
                }
            },
            "cast": {
                "type": "keyword",
                "store": true
            },
            "crew": {
                "type": "text"
            },
            "links": {
                "properties": {
                    "name": {
                        "type": "text",
                        "index": false
                    },
                    "url": {
                        "type": "text",
                        "index": false
                    }

                }
            },
            "videos": {
                "type": "text"
            },
            "songVideos": {
                "properties": {
                    "youtube_id": {
                        "type": "text",
                        "index": false
                    },
                    "youtube_title": {
                        "type": "text",
                        "index": false
                    }
                }
            },
            "shortDesc": {
                "type": "text"
            },
            "launchDate": {
                "type": "date",
                "store": true
            },
            "formattedLaunchDate": {
                "type": "text",
                "index": false
            },
            "trailerUrl": {
                "type": "text"
            },
            "videoYoutubeId": {
                "type": "text"
            },
            "content_id": {
                "type": "integer"
            },
            "launchDateEpoch": {
                "type": "integer"
            },
            "keywords": {
                "type": "text"
            },
            "popularity": {
                "type": "integer",
                "index": false
            },
            "objectID": {
                "type": "text",
                "index": false
            },
            "_highlightResult": {
                "properties": {
                    "languages": {
                        "properties": {
                            "value": {
                                "type": "text",
                                "index": false
                            },
                            "matchLevel": {
                                "type": "text",
                                "index": false
                            },
                            "matchedWords": {
                                "type": "text",
                                "index": false
                            }
                        }
                    },
                    "genre": {
                        "properties": {
                            "value": {
                                "type": "text",
                                "index": false
                            },
                            "matchLevel": {
                                "type": "text",
                                "index": false
                            },
                            "matchedWords": {
                                "type": "text",
                                "index": false
                            }
                        }
                    },
                    "name": {
                        "properties": {
                            "value": {
                                "type": "text",
                                "index": false
                            },
                            "matchLevel": {
                                "type": "text",
                                "index": false
                            },
                            "matchedWords": {
                                "type": "text",
                                "index": false
                            }
                        }
                    }
                }
            },
            "_rankingInfo": {
                "properties": {
                    "nbTypos": {"type": "integer", "index": false},
                    "firstMatchedWord": {"type": "integer", "index": false},
                    "proximityDistance": {"type": "integer", "index": false},
                    "userScore": {"type": "integer", "index": false},
                    "geoDistance": {"type": "integer", "index": false},
                    "geoPrecision": {"type": "integer", "index": false},
                    "nbExactWords": {"type": "integer", "index": false},
                    "words": {"type": "integer", "index": false},
                    "filters": {"type": "integer", "index": false}
                }
            }
        }
    }},function(err,resp,status){
        if (err) {
        console.log(err);
        }
        else {
        console.log(resp);
        }
    });
}

module.exports = {create_mapping};
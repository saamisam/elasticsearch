function generateMappingSettings() {
    movieIndex = {
        settings: {
            index: {
            analysis: {
                filter: {
                permutations: {
                    max_shingle_size: "5",
                    min_shingle_size: "2",
                    type: "shingle"
                },
                autocomplete_filter: {
                    type: "edge_ngram",
                    min_gram: "1",
                    max_gram: "20"
                },
                delimiter: {
                    catenate_all: "true",
                    type: "word_delimiter",
                    catenate_numbers: "true",
                    preserve_original: "true",
                    catenate_words: "true"
                }
                },
                analyzer: {
                autocomplete: {
                    filter: [
                    "lowercase",
                    "autocomplete_filter",
                    "delimiter",
                    "permutations"
                    ],
                    type: "custom",
                    tokenizer: "standard"
                },
                my_english: {
                    type: "standard",
                    stopwords: "_english_"
                }
                }
            }
            }
        },
        mappings: {
            "movie":{
                properties: {
                    // "launchCountries": {
                    //     "type": "keyword",
                    //     "store": true
                    // },
                    "duration": {
                        type: "integer",
                        index: false
                    },
                    // seo: {
                    //     properties: {
                    //         pageTitle: {"type": "text", "index": false},
                    //         metaDescription: {"type": "text", "index": false},
                    //         anchorText: {"type": "text", "index": false},
                    //         robotsMetaTag: {"type": "text", "index": false}
                    //     }
                    // },
                    // languages: {
                    //     type: "keyword",
                    //     store: true
                    // },
                    // globalLaunch: {
                    //     type: "boolean",
                    //     index: false
                    // },
                    // genre: {
                    //     type: "keyword",
                    //     store: true
                    // },
                    "name": {
                        type: "text",
                        store: true
                    },
                    // slug: {
                    //     type: "text",
                    //     index: false
                    // },
                    // movie_details_id: {
                    //     type: "integer",
                    //     index: false
                    // },
                    // followCount: {
                    //     type: "integer",
                    //     index: false
                    // },
                    // coverImage: {
                    //     type: "text",
                    //     index: false
                    // },
                    // posterImage: {
                    //     type: "text",
                    //     index: false
                    // },
                    // images: {
                    //     properties: {
                    //         url: {
                    //             type: "text",
                    //             index: false
                    //         },
                    //         width: {
                    //             type: "integer",
                    //             index: false
                    //         },
                    //         height: {
                    //             type: "integer",
                    //             index: false
                    //         }
                    //     }
                    // },
                    // cast: {
                    //     type: "keyword",
                    //     store: true
                    // },
                    // crew: {
                    //     type: "text"
                    // },
                    // links: {
                    //     properties: {
                    //         name: {
                    //             type: "text",
                    //             index: false
                    //         },
                    //         url: {
                    //             type: "text",
                    //             index: false
                    //         }

                    //     }
                    // },
                    // videos: {
                    //     type: "text"
                    // },
                    // songVideos: {
                    //     properties: {
                    //         youtube_id: {
                    //             type: "text",
                    //             index: false
                    //         },
                    //         youtube_title: {
                    //             type: "text",
                    //             index: false
                    //         }
                    //     }
                    // },
                    // shortDesc: {
                    //     type: "text"
                    // },
                    // launchDate: {
                    //     type: "date",
                    //     store: true
                    // },
                    // formattedLaunchDate: {
                    //     type: "text",
                    //     index: false
                    // },
                    // trailerUrl: {
                    //     type: "text"
                    // },
                    // videoYoutubeId: {
                    //     type: "text"
                    // },
                    // content_id: {
                    //     type: "integer"
                    // },
                    // launchDateEpoch: {
                    //     type: "integer"
                    // },
                    // keywords: {
                    //     type: "text"
                    // },
                    // popularity: {
                    //     type: "integer",
                    //     index: false
                    // },
                    // objectID: {
                    //     type: "text",
                    //     index: false
                    // }
                }

            }
        }
    };
    return movieIndex;
  }
  
  module.exports = {
    MOVIE_INDEX_SETTINGS_MAPPING: generateMappingSettings()
  };
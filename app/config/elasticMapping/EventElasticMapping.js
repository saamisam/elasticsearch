function generateMappingSettings() {
    eventIndex = {
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
            "event":{
                properties: {
                    launchCountries: {
                        "type": "keyword",
                        "store": true
                    },
                    tickets: {
                        properties: {
                            name: {"type": "text", "index": false},
                            startTime: {"type": "date", "index": false},
                            endTime: {"type": "date", "index": false},
                            bookingLink: {"type": "text", "index": false},
                            minPrice: {"type": "integer", "index": false},
                            maxPrice: {"type": "integer", "index": false}
                        }
                    },
                    // venue:{
                    //     properties: {
                    //         "name": {"type": "text", "index": false},
                    //         "city": {"type": "text", "index": false},
                    //         "gmap_link": {"type": "text", "index": false},
                    //         "country": {"type": "text", "index": false},
                    //         "address": {"type": "text", "index": false}
                    //     }
                    // },
                    seo: {
                        properties: {
                            pageTitle: {"type": "text", "index": false},
                            metaDescription: {"type": "text", "index": false},
                            anchorText: {"type": "text", "index": false},
                            robotsMetaTag: {"type": "text", "index": false}
                        }
                    },
                    name: {
                        type: "text",
                        store: true
                    },
                    slug: {
                        type: "text",
                        index: false
                    },
                    followCount: {
                        type: "integer",
                        index: false
                    },
                    events_details_id: {
                        type: "integer",
                        index: false
                    },
                    genre: {
                        type: "keyword",
                        store: true
                    },
                    coverImage: {
                        type: "text",
                        index: false
                    },
                    posterImage: {
                        type: "text",
                        index: false
                    },
                    images: {
                        properties: {
                            url: {"type": "text", "index": false},
                            width: {"type": "integer", "index": false},
                            height: {"type": "integer", "index": false}
                        }
                    },
                    artists: {
                        type: "keyword",
                        store: true
                    },
                    links: {
                        properties: {
                            url: {"type": "text", "index": false},
                            name: {"type": "text", "index": false}
                        }
                    },
                    videos: {
                        type: "text"
                    },
                    startTime: {
                        type: "date", index: false
                    },
                    endTime: {
                        type: "date", index: false
                    },
                    shortDesc: {
                        type: "text"
                    },
                    launchDate: {
                        type: "date",
                        store: true
                    },
                    content_id: {
                        type: "integer"
                    },
                    launchDateEpoch: {
                        type: "keyword",
                        store: true
                    },
                    endDateEpoch: {
                        type: "keyword",
                        store: true
                    },
                    keywords: {
                        type: "keyword",
                        store: true
                    },
                    popularity: {
                        type: "integer",
                        index: false
                    },
                    objectID: {
                        type: "text",
                        index: false
                    },
                    status: {
                        type: "keyword",
                        store: true
                    }
                }
            }
        }
    };
    return eventIndex;
  }
  
  module.exports = {
    EVENT_INDEX_SETTINGS_MAPPING: generateMappingSettings()
  };
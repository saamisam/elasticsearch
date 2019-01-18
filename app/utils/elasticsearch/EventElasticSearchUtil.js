const movieElasticMapping = require("../../config/elasticMapping/EventElasticMapping");
const elasticMappings = {
    mapping: movieElasticMapping.EVENT_INDEX_SETTINGS_MAPPING
};
const elasticUtil = require('./ElasticSearchUtil');
const EventService = require('../../services/EventService');
const config = require('../../config/custom');
module.exports = {
    createNewIndex: function(newIndexName) {
        currentIndexName = newIndexName;
        var promise = new Promise((resolve, reject) => {
        elasticUtil.initiateIndex(currentIndexName, elasticMappings["mapping"])
            .then(intiateIndexStatus => {
            // console.log(intiateIndexStatus);
            resolve(intiateIndexStatus);
            })
            .catch(err => {
            console.log(err);
            reject(err);
            });
        });
        return promise;
    },
    createEventDocument : async function(row){
        var EventData = {};
        var venue = {};
        var seo = {};
        return new Promise((resolve, reject)=> {
            launchCountries = EventService.getAdditionalData(row.id, async (err, data) => {
                if(err)
                    console.log('err', err);
                else{
                    if(typeof(data) == 'undefined') {
                        reject('err');
                    }else{
                        try{
                            // console.log('data', data);
                            EventData.launchCountries = []
                            venue.name = data.venue_name;
                            venue.city = data.city;
                            venue.gmap_link = data.gmap_link;
                            venue.country = data.country;
                            venue.address = data.address;
                            EventData.venue = venue;
                            seo.pageTitle = data.page_title;
                            seo.metaDescription = data.meta_description;
                            seo.anchorText = data.anchor_text;
                            seo.robotsMetaTag = (data.robotsMetaTag == 1) ? true : false;
                            EventData.seo = seo;
                            EventData.name = row.name;
                            EventData.slug = row.slug;
                            EventData.followCount = row.initial_followers_count;
                            EventData.event_details_id = row.event_details_id;
                            EventData.genre = await module.exports.genre(row.id);
                            images = await module.exports.processImage(row.id);
                            EventData.coverImage = images.cover;
                            EventData.posterImage = images.poster;
                            EventData.images = images.other;
                            EventData.artists = data.artists;
                            EventData.links = await module.exports.links(row.id);
                            EventData.videos = [];
                            EventData.startTime = data.start_time;
                            EventData.endTime = data.end_time;
                            EventData.shortDesc = row.short_description;
                            EventData.launchDate = data.start_time;
                            EventData.content_id = row.id;
                            if(data.start_time)
                                EventData.launchDateEpoch = (data.start_time).getTime() / 1000;
                            else
                                EventData.launchDateEpoch = ''
                            if(data.end_time)
                                EventData.endDateEpoch = (data.end_time).getTime() / 1000;
                            else
                                EventData.endDateEpoch = ''
                            EventData.keywords = await module.exports.keywords(row.id);
                            EventData.popularity = "";
                            EventData.objectID = "event:"+row.id;
                            EventData.tickets = await module.exports.tickets(row.id);
                            EventData.status = '1';
                            console.log("Document Prepartion DONE" + row.id);
                            resolve(EventData);
                        }catch(err){
                            console.log('err', err);
                            reject(err);
                        }
                    }
                }
            });
        })
    },
    tickets: async function(contentId){
        if(contentId){
            tickets = [];
            ticket = await EventService.getTicketData(contentId);
            ticket.forEach(data => {
                ticketdata = {};
                ticketdata.name = data.ticket_name;
                ticketdata.startTime = data.start_time;
                ticketdata.endTime = data.end_time;
                ticketdata.bookingLink = data.booking_link;
                ticketdata.minPrice = data.min_price;
                ticketdata.maxPrice = data.max_price;
                tickets.push(ticketdata);
            });
            return tickets;
        }
    },

    genre: async function(contentId){
        if(contentId){
            genres = [];
            genre = await EventService.getGenreData(contentId);
            genre.forEach(data => {
                genres.push(data['name']);
            });
            return genres;
        }
    },

    keywords: async function(contentId){
        if(contentId){
            keywords = [];
            keyword = await EventService.getKeywordData(contentId);
            keyword.forEach(data => {
                keywords.push(data['name']);
            });
            return keywords;
        }
    },

    links: async function(contentId){
        if(contentId){
            nameArray = ['FACEBOOK', 'TWITTER', 'GOOGLE_PLUS', 'YOUTUBE', 'BOOKING', 'WEBSITE']
            links = [];
            linkData = {};
            link = await EventService.getLinkData(contentId);
            link.forEach(data => {
                linkData.url = data.url;
                linkData.name = nameArray[data.link_type];
                links.push(linkData)
            });
            return links;
        }
    },

    processImage: async function(contentId){
        if(contentId){
            images = await EventService.getImageData(contentId);
            if(images == null)
                return false;
            else{
                var imageData = {};
                var cover = [];    
                var poster = [];
                var otherImage = [];
                var valImage = images
                for(let i=0; i < valImage.length; i++){
                    image = valImage[i];
                    if(image['image_type'] == '0')
                        cover.push(image['image_file_name']);
                    else if(image['image_type'] == '1'){
                        other = {};
                        dimension = image['dimensions'].replace('---\n','').replace(/\n/g,'').replace(/- /,'').split('- ');
                        other.url = image['image_file_name'];
                        other.width = dimension[0];
                        other.height = dimension[1];
                        otherImage.push(other);
                    }
                    else if(image['image_type'] == '2')
                        poster.push(image['image_file_name'])               
                }
                imageData.cover = cover;
                imageData.poster = poster;
                imageData.other = otherImage;
                return imageData;
            }
        }
    },

    images: async function(contentId){
        if(contentId){
            images = [];
            image = await EventService.getImageData(contentId);
            console.log('image', image);
            return;
            // genre.forEach(data => {
            //     genres.push(data['name']);
            // });
            // return genres;
        }
    },
    
    copyDataToNewElasticIndexFromDB: async function(newIndexName) {
        const bulkUploadAsync = bulk => {
          console.log("Content Elastic Bulk Upload started");
          return elasticUtil.bulkDocument(bulk);
        };
    
        async function copyData() {
          let contentCount = await EventService.getCountContent();
          console.log("################### Total Count "+ contentCount +"################################");
          //contentCount = 100;
          let limit = 100;
          let loopCount = contentCount / limit;
          let bulkUploadResults;
          console.log('loopcount', loopCount);
          for (i = 0; i <= loopCount; i++) {
            let start = i * limit;
            let max = i === loopCount ? contentCount % limit : limit;
            console.log("Fetching Categories %d %d", start, limit);
            const results = await EventService.getAllContentWithLimit(start, max);
            // console.log('results', results);
            // return;
            let bulk = [];
    
            for (const result of results) {
              console.log("Document Prepartiom Start" + result.id);
              actionDersciption = {
                index: {
                  _index: newIndexName,
                  _type: "event",
                  _id: result.id
                }
              };
              let documentContent;
              try{
                  documentContent = await module.exports.createEventDocument(result);
                  bulk.push(actionDersciption);
                  bulk.push(documentContent);
              }catch(err){
                  console.log('err', err);
              }
            }
            if (bulk.length > 0) {
              bulkUploadResults = await bulkUploadAsync(bulk);
            }
          }
          return bulkUploadResults;
        }
    
        var promise = new Promise((resolve, reject) => {
          copyData()
          .then(bulkUploadResult => { resolve(bulkUploadResult);})
          .catch(err => {
            console.log(err);
            reject(err);
          });
        });
        return promise;
    },

    toggleAlliasName: async function(newindex) {
        async function removeAndUpdateAliasFromIndex(aliasNameContent, newindex) {
          return elasticUtil.removeUpdateAlias(aliasNameContent, newindex);
        }
    
        console.log(newindex);
        let aliasNameContent = config.custom.EVENT_INDEX_NAME;
        console.log('aliasName', aliasNameContent);
        var promise = new Promise((resolve, reject) => {
          removeAndUpdateAliasFromIndex(aliasNameContent, newindex)
            .then(removeAliasStatus => {
              console.log("list of indexex removwd");
              console.log(removeAliasStatus);
              resolve(removeAliasStatus);
            })
            .catch(err => {
              console.log(err);
              reject(err);
            });
        });
        return promise;
    },
    
    documentUpdateDelete: async function(data){
        data.index = "events_1546135013678"
        if(data.action == 'update'){
            const checkExists = await elasticUtil.singleExistEntity(data.index, data.type, data.id);
            if(checkExists == true)
                await elasticUtil.singleDeleteEntity(data.index, data.type, data.id)    
            await elasticUtil.singleCreateEntity(data.index, data.type, data.id, data.body)
        }else if(data.action == 'delete'){
            const checkExists = await elasticUtil.singleExistEntity(data.index, data.type, data.id);
            if(checkExists == true)
                await elasticUtil.singleDeleteEntity(data.index, data.type, data.id);
        }
        return true;
    }
    // toggleAlliasName: async function(newindex) {
    //     async function removeAndUpdateAliasFromIndex(aliasNameContent, newindex) {
    //       return elasticUtil.removeUpdateAlias(aliasNameContent, newindex);
    //     }
    
    //     console.log(newindex);
    //     let aliasNameContent = sails.config.custom.CONTENT_INDEX_NAME;
    
    //     var promise = new Promise((resolve, reject) => {
    //       removeAndUpdateAliasFromIndex(aliasNameContent, newindex)
    //         .then(removeAliasStatus => {
    //           console.log("list of indexex removwd");
    //           console.log(removeAliasStatus);
    //           resolve(removeAliasStatus);
    //         })
    //         .catch(err => {
    //           console.log(err);
    //           reject(err);
    //         });
    //     });
    //     return promise;
    // }
    
    
}

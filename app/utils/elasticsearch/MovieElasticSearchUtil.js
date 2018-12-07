const movieElasticMapping = require("../../config/elasticMapping/MovieElasticMapping");
const elasticMappings = {
    mapping: movieElasticMapping.MOVIE_INDEX_SETTINGS_MAPPING
};
const elasticUtil = require('./ElasticSearchUtil');
const MovieService = require('../../services/MovieService')
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
    createMovieDocument : async function(row){
        var MovieData = {};
        return new Promise((resolve, reject)=> {
            launchCountries = MovieService.getAdditionalData(row.id, (err, data) => {  
                if(err)
                    console.log('err', err);
                else{
                    // images = images(data.image_name, function(err, val){
                    //     console.log('val', val);
                    // });
                    // images = module.exports.processImage(data.image_name);
                    // cast_crew = module.exports.processCast(data.cast_crew);
                    MovieData.duration = row.duration;
                    // var seo = {}
                    // seo.pageTitle = row.pageTitle;
                    // seo.metaDescription = row.metaDescription;
                    // seo.anchorText = row.anchorText;
                    // seo.robotsMetaTag = row.robotsMetaTag;
                    // MovieData.seo = seo;
                    // MovieData.languages = [data.languages];
                    // MovieData.globalLaunch = row.global_launch;
                    // MovieData.genre = [data.genres];
                    MovieData.name = row.name;
                    // MovieData.slug = row.slug;
                    // MovieData.movie_details_id = row.movie_details_id;
                    // MovieData.followCount = row.initial_followers_count;
                    // MovieData.coverImage = images.cover;
                    // MovieData.posterImage = images.poster;
                    // MovieData.images = images.other;
                    // MovieData.cast = cast_crew.cast;
                    // MovieData.crew = cast_crew.crew;
                    // MovieData.links = [data.links];
                    // MovieData.videos = [];
                    // MovieData.songVideos = [];
                    // MovieData.shortDesc = row.short_description;
                    // MovieData.launchDate =  row.launch_date;
                    // MovieData.formattedLaunchDate = "";
                    // MovieData.trailerUrl = "";
                    // MovieData.videoYoutubeId = "";
                    // MovieData.content_id = "";
                    // MovieData.launchDateEpoch = "";
                    // MovieData.keywords = "";
                    // MovieData.popularity = "";
                    // MovieData.objectID = row.id;
                    console.log("Document Prepartion DONE" + row.id);
        
                    resolve(MovieData);
                }
            });
        })
    },
    processImage: function(images){
        if(images == null)
            return false;
        else{
            var imageData = {};
            var cover = [];    
            var poster = [];
            var otherImage = [];
            var valImage = images.split(',');
            for(let i=0; i < valImage.length; i++){
                image = valImage[i].split('  ');
                if(image[1] == '0')
                    cover.push(image[0]);
                else if(image[1] == '1'){
                    // console.log('beforesplit', image[2]);
                    dimension = image[2].replace('---\n','').replace('\n','').split('- ');
    
                    console.log('dimension', dimension);
                    otherImage.push(image[0]);
                }
                else if(image[1] == '2')
                    poster.push(image[0])               
            }
            imageData.cover = cover;
            imageData.poster = poster;
            imageData.other = otherImage;
            return imageData;
        }
    },
    
    processCast: function(cast_crew){
        if(cast_crew == null)
            return false;
        else{
            var castCrew = {};
            var cast = [];
            var crew = [];
            var cast_crewData = cast_crew.split(',');
            for(let i=0; i<cast_crewData.length; i++){
                crew_cast = cast_crewData[i].split('  ');
                if(crew_cast[1] == '1')
                    cast.push(crew_cast[0]);
                else if(crew_cast[1] == '0')
                    crew.push(crew_cast[0]);
            }
            castCrew.cast = cast;
            castCrew.crew = crew;
            return castCrew;
        }
    },
     
    
    copyDataToNewElasticIndexFromDB: async function(newIndexName) {
        const bulkUploadAsync = bulk => {
          console.log("Content Elastic Bulk Upload started");
          return elasticUtil.bulkDocument(bulk);
        };
    
        async function copyData() {
          let contentCount = await MovieService.getCountContent();
          console.log("################### Total Count "+ contentCount +"################################");
          //contentCount = 100;
          let limit = 2;
          let loopCount = contentCount / limit;
          let bulkUploadResults;
          console.log('loopcount', loopCount);
          for (i = 0; i <= loopCount; i++) {
            let start = i * limit;
            let max = i === loopCount ? contentCount % limit : limit;
            console.log("Fetching Categories %d %d", start, limit);
            const results = await MovieService.getAllContentWithLimit(start, max);
            let bulk = [];
    
            for (const result of results) {
              console.log("Document Prepartiom Start" + result.id);
              actionDersciption = {
                index: {_index: newIndexName,_type: "movie",_id: result.id}
              };
              let documentContent = null;
              documentContent = await module.exports.createMovieDocument(result);
              bulk.push(actionDersciption);
              bulk.push(documentContent);
              console.log('aaaaaa');
            }
            console.log('bulk', bulk);
            if (bulk.length > 0) {
              bulkUploadResults = await bulkUploadAsync(bulk);
            }
            return;
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
      }
    
}

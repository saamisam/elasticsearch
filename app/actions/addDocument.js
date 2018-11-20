const db = require('../config/db');
const client = require('../config/connection.js');

function add_document(req){
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
}

function processImage(images){
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
}

function processCast(cast_crew){
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
}

function getAdditionalData(id, callback) {
    db.query("SELECT GROUP_CONCAT(distinct c.name) AS country, GROUP_CONCAT(distinct e.name) AS languages, GROUP_CONCAT(distinct g.name) AS genres, GROUP_CONCAT(distinct h.image_file_name,'  ', h.image_type, '  ', h.dimensions) AS image_name, GROUP_CONCAT(distinct j.first_name,' ',j.last_name,'  ', j.actor_or_not) AS  cast_crew, GROUP_CONCAT(distinct k.url) AS links, GROUP_CONCAT(distinct l.video_url,' ',l.video_type,' ',l.video_title,' ', l.UrlId) AS videos FROM contents a INNER JOIN content_countries b ON a.id = b.content_id INNER JOIN countries c ON b.country_id = c.id INNER JOIN movie_languages d ON d.content_id = a.id INNER JOIN languages e ON d.language_id = e.id INNER JOIN movie_genres f ON f.content_id = a.id INNER JOIN genres g ON f.genre_id = g.id INNER JOIN images h ON h.content_id = a.id INNER JOIN content_role_people i ON i.content_id = a.id INNER JOIN people j ON j.id = i.person_id INNER JOIN links k ON k.content_id = a.id INNER JOIN videos l ON l.content_id = a.id WHERE a.id = "+id, function (err, result, fields) {
        if (err) 
            callback(err, null);
        else
            callback(null, result[0]);
    });
}

module.exports = {add_document}

// {
//     "launchCountries": [
//       "India"
//     ],
//     "duration": 0,
//     "seo": {
//       "pageTitle": "Kandupidi Kandupidi | Upcomingg",
//       "metaDescription": "Kandupidi Kandupidi is a thriller film written and directed by  Rama Subburayan. Seeman, Murali, Tarun Shatriya are playing prominent roles in this film.",
//       "anchorText": "Kandupidi Kandupidi | Upcomingg",
//       "robotsMetaTag": true
//     },
//     "languages": [
//       "Tamil"
//     ],
//     "globalLaunch": false,
//     "genre": [
//       "Thriller",
//       "Drama"
//     ],
//     "name": "Kandupidi Kandupidi",
//     "slug": "kandupidi-kandupidi",
//     "movie_details_id": 4048,
//     "followCount": 962,
//     "coverImage": "/system/images/images/000/020/247/original/cover.jpg?1538123091",
//     "posterImage": "/system/images/images/000/020/246/original/Poster.jpg?1538123091",
//     "images": [
//       {
//         "url": "/system/images/images/000/020/238/original/21034362_1474174479331416_1182812578405964513_n.jpg?1538123086",
//         "width": 960,
//         "height": 960
//       },
//       {
//         "url": "/system/images/images/000/020/239/original/10421527_784984788250392_2697680550412881933_n.jpg?1538123086",
//         "width": 728,
//         "height": 960
//       },
//       {
//         "url": "/system/images/images/000/020/240/original/523524_378889075526634_1797278018_n.jpg?1538123087",
//         "width": 703,
//         "height": 960
//       },
//       {
//         "url": "/system/images/images/000/020/241/original/298801_175440349204842_981195253_n.jpg?1538123087",
//         "width": 704,
//         "height": 960
//       },
//       {
//         "url": "/system/images/images/000/020/242/original/312035_175323269216550_919145727_n.jpg?1538123087",
//         "width": 720,
//         "height": 342
//       },
//       {
//         "url": "/system/images/images/000/020/243/original/BplNIIWCYAAzCUi.jpg?1538123088",
//         "width": 598,
//         "height": 285
//       },
//       {
//         "url": "/system/images/images/000/020/244/original/BplNIIWCYAAzCUi.jpg?1538123089",
//         "width": 598,
//         "height": 285
//       },
//       {
//         "url": "/system/images/images/000/020/245/original/BplNH60CcAArXm7.jpg?1538123089",
//         "width": 598,
//         "height": 253
//       },
//       {
//         "url": "/system/images/images/000/020/246/original/Poster.jpg?1538123091",
//         "width": 400,
//         "height": 600
//       },
//       {
//         "url": "/system/images/images/000/020/247/original/cover.jpg?1538123091",
//         "width": 1200,
//         "height": 400
//       }
//     ],
//     "cast": [],
//     "crew": [],
//     "links": [
//       {
//         "name": "FACEBOOK",
//         "url": "https://www.facebook.com/Kandupidi-Kandupidi-175323115883232/"
//       },
//       {
//         "name": "TWITTER",
//         "url": "https://twitter.com/hashtag/KandupidiKandupidi"
//       }
//     ],
//     "videos": [],
//     "songVideos": [
//       {
//         "youtube_id": "nReBaAsJPK0",
//         "youtube_title": "kandupidi kandupidi | Tamil Movie Audio Jukebox | (Full Songs)"
//       }
//     ],
//     "shortDesc": "Kandupidi Kandupidi is a thriller film written and directed by  Rama Subburayan. Seeman, Murali, Tarun Shatriya are playing prominent roles in this film.",
//     "launchDate": "2018-12-14",
//     "formattedLaunchDate": "14 Dec 2018",
//     "trailerUrl": null,
//     "videoYoutubeId": null,
//     "content_id": 9990,
//     "launchDateEpoch": 1544745600,
//     "keywords": [],
//     "popularity": 1,
//     "objectID": "movie:9990",
//     "_highlightResult": {
//       "languages": [
//         {
//           "value": "Tamil",
//           "matchLevel": "none",
//           "matchedWords": []
//         }
//       ],
//       "genre": [
//         {
//           "value": "Thriller",
//           "matchLevel": "none",
//           "matchedWords": []
//         },
//         {
//           "value": "Drama",
//           "matchLevel": "none",
//           "matchedWords": []
//         }
//       ],
//       "name": {
//         "value": "Kandupidi Kandupidi",
//         "matchLevel": "none",
//         "matchedWords": []
//       }
//     },
//     "_rankingInfo": {
//       "nbTypos": 0,
//       "firstMatchedWord": 0,
//       "proximityDistance": 0,
//       "userScore": 1418,
//       "geoDistance": 0,
//       "geoPrecision": 0,
//       "nbExactWords": 0,
//       "words": 0,
//       "filters": 0
//     }
//   }
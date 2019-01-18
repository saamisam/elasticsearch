const db = require('../config/db');
module.exports = {
    getCountContent: ()=> {
        return new Promise((resolve, reject)=> {
            db.query("SELECT count(*) as total_count FROM contents where content_type = 2", function (err, result, fields) {
                resolve(result[0].total_count);
            });            
        });
    },

    getAllContentWithLimit: function(start, max) {
        return new Promise((resolve, reject)=> {
            db.query("SELECT a.name, a.slug, a.global_launch, a.initial_followers_count, a.short_description, a.launch_date, a.id, d.id as event_details_id, e.robots_meta_tag, e.anchor_text, e.meta_description, e.page_title FROM contents a INNER JOIN event_details d ON a.id = d.content_id INNER JOIN seo_informations e ON a.id = e.content_id WHERE a.content_type = 2 LIMIT "+max+" OFFSET "+start, function(err, result, fields){
                resolve(result);
            });
        });
    },

    getAdditionalData: function(id, callback) {
        db.query("SELECT a.id,a.content_id,a.start_time,a.end_time,b.city, b.name as venue_name, b.gmap_link, b.address, c.name AS country, e.anchor_text, e.page_title, e.meta_description,e.robots_meta_tag, a.start_time, a.end_time, g.name as artists FROM event_details a INNER JOIN venues b ON a.venue_id = b.id INNER JOIN countries c ON b.country_id = c.id INNER JOIN seo_informations e ON a.content_id = e.content_id INNER JOIN artist_event_mappings f ON a.content_id = f.content_id INNER JOIN artists g ON f.artist_id = g.id WHERE a.content_id ="+id, function (err, result, fields) {
            if (err) 
                callback(err, null);
            else
                callback(null, result[0]);
        });
    },

    getTicketData: function(id) {
        return new Promise((resolve, reject)=>{
            db.query("SELECT start_time, end_time, name as ticket_name, booking_link, max_price, min_price FROM event_tickets where content_id = "+id, function (err, result, fields) {
                resolve(result);
            });
        });
    },

    getGenreData: function(id) {
        return new Promise((resolve, reject)=>{
            db.query("SELECT b.name FROM movie_genres a INNER JOIN genres b ON a.genre_id = b.id where a.content_id = "+id, function (err, result, fields) {
                resolve(result);
            });
        });
    },

    getLinkData: function(id) {
        return new Promise((resolve, reject)=>{
            db.query("SELECT url, link_type FROM links where content_id = "+id, function (err, result, fields) {
                resolve(result);
            });
        });
    },

    getImageData: function(id) {
        return new Promise((resolve, reject)=>{
            db.query(" SELECT image_file_name, image_type, dimensions FROM images WHERE content_id ="+id, function (err, result, fields) {
                resolve(result);
            });
        });
    },

    getKeywordData: function(id){
        return new Promise((resolve, reject)=>{
            db.query(" SELECT b.name FROM movie_keywords a INNER JOIN keywords b ON a.keyword_id = b.id where a.content_id = "+id, function (err, result, fields) {
                resolve(result);
            });
        });
    }
}
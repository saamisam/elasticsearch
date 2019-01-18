const db = require('../config/db');
module.exports = {
    getCountContent: ()=> {
        return new Promise((resolve, reject)=> {
            db.query("SELECT count(*) as total_count FROM contents where content_type = 0", function (err, result, fields) {
                resolve(result[0].total_count);
            });            
        });
    },

    getAllContentWithLimit: function(start, max) {
        return new Promise((resolve, reject)=> {
            db.query("SELECT a.name, a.slug, a.global_launch, a.initial_followers_count, a.short_description, a.launch_date, a.id, d.duration, d.id as movie_details_id, e.robots_meta_tag, e.anchor_text, e.meta_description, e.page_title FROM contents a INNER JOIN movie_details d ON a.id = d.content_id INNER JOIN seo_informations e ON a.id = e.content_id WHERE a.content_type = 0 LIMIT "+max+" OFFSET "+start, function(err, result, fields){
                resolve(result);
            });
        });
    },

    getAdditionalData: function(id, callback) {
        db.query("SELECT GROUP_CONCAT(distinct c.name) AS country, GROUP_CONCAT(distinct e.name) AS languages, GROUP_CONCAT(distinct g.name) AS genres, GROUP_CONCAT(distinct h.image_file_name,'  ', h.image_type, '  ', h.dimensions) AS image_name, GROUP_CONCAT(distinct j.first_name,' ',j.last_name,'  ', j.actor_or_not) AS  cast_crew, GROUP_CONCAT(distinct k.url) AS links, GROUP_CONCAT(distinct l.video_url,' ',l.video_type,' ',l.video_title,' ', l.UrlId) AS videos FROM contents a INNER JOIN content_countries b ON a.id = b.content_id INNER JOIN countries c ON b.country_id = c.id INNER JOIN movie_languages d ON d.content_id = a.id INNER JOIN languages e ON d.language_id = e.id INNER JOIN movie_genres f ON f.content_id = a.id INNER JOIN genres g ON f.genre_id = g.id INNER JOIN images h ON h.content_id = a.id INNER JOIN content_role_people i ON i.content_id = a.id INNER JOIN people j ON j.id = i.person_id INNER JOIN links k ON k.content_id = a.id INNER JOIN videos l ON l.content_id = a.id WHERE a.content_type = 0 and a.id = "+id, function (err, result, fields) {
            if (err) 
                callback(err, null);
            else
                callback(null, result[0]);
        });
    }
    
}


class eventListResponse {

    getEventListResponse(ElasticListResponseUtilsObj) {
        var responseDetail = {};
        responseDetail["name"]                  = ElasticListResponseUtilsObj.getName();
        responseDetail["content_id"]            = ElasticListResponseUtilsObj.getcontent_id();
        responseDetail["seo"]                   = ElasticListResponseUtilsObj.getseo();
        responseDetail["slug"]                  = ElasticListResponseUtilsObj.getslug();
        responseDetail["followCount"]           = ElasticListResponseUtilsObj.getfollowCount();
        responseDetail["event_details_id"]      = ElasticListResponseUtilsObj.getevent_details_id();
        responseDetail["genre"]                 = ElasticListResponseUtilsObj.getgenre();
        responseDetail["coverImage"]            = ElasticListResponseUtilsObj.getcoverImage();
        responseDetail["posterImage"]           = ElasticListResponseUtilsObj.getposterImage();
        responseDetail["images"]                = ElasticListResponseUtilsObj.getimages();
        responseDetail["artists"]               = ElasticListResponseUtilsObj.getartists();
        responseDetail["links"]                 = ElasticListResponseUtilsObj.getlinks();
        responseDetail["videos"]                = ElasticListResponseUtilsObj.getvideos();
        responseDetail["startTime"]             = ElasticListResponseUtilsObj.getstartTime();
        responseDetail["endTime"]               = ElasticListResponseUtilsObj.getendTime();
        responseDetail["launchDate"]            = ElasticListResponseUtilsObj.getlaunchDate();
        responseDetail["content_id"]            = ElasticListResponseUtilsObj.getcontent_id();
        responseDetail["launchDateEpoch"]       = ElasticListResponseUtilsObj.getlaunchDateEpoch();
        responseDetail["endDateEpoch"]          = ElasticListResponseUtilsObj.getendDateEpoch();
        responseDetail["keywords"]              = ElasticListResponseUtilsObj.getkeywords();
        responseDetail["popularity"]            = ElasticListResponseUtilsObj.getpopularity();
        responseDetail["objectID"]              = ElasticListResponseUtilsObj.getobjectID();
        responseDetail["tickets"]               = ElasticListResponseUtilsObj.gettickets();
        return responseDetail;
      }
  }
  
  module.exports = eventListResponse;
  
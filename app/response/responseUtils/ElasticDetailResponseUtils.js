class ElasticDetailResponseUtils {
    constructor(args) {
          this.resultSet     = (args._source) ? args._source : null;  
          // this.totalResultsSet = (args.hits.total) ? args.hits.total : 0; 

          this.name                 = (this.resultSet.name) ? this.resultSet.name : null;
          this.content_id           = (this.resultSet.content_id) ? this.resultSet.content_id : null;
          this.seo                  = (this.resultSet.seo) ? this.resultSet.seo : null;
          this.slug                 = (this.resultSet.slug    ) ? this.resultSet.slug  : null    ;
          this.followCount          = (this.resultSet.followCount)?this.resultSet.followCount : null;
          this.event_details_id     = (this.resultSet.event_details_id) ? this.resultSet.event_details_id : null;
          this.genre                = (this.resultSet.genre) ? this.resultSet.genre : null;
          this.coverImage           = (this.resultSet.coverImage) ? this.resultSet.coverImage : null;
          this.posterImage          = (this.resultSet.posterImage) ? this.resultSet.posterImage : null;
          this.images               = (this.resultSet.images) ? this.resultSet.images : null;
          this.artists              = (this.resultSet.artists) ? this.resultSet.artists : null;
          this.links                = (this.resultSet.links) ? this.resultSet.links : null;
          this.videos               = (this.resultSet.videos) ? this.resultSet.videos : null;
          this.startTime            = (this.resultSet.startTime) ? this.resultSet.startTime : null;
          this.endTime              = (this.resultSet.endTime) ? this.resultSet.endTime : null;
          this.launchDate           = (this.resultSet.launchDate) ? this.resultSet.launchDate : null;
          this.content_id           = (this.resultSet.content_id) ? this.resultSet.content_id : null;
          this.launchDateEpoch      = (this.resultSet.launchDateEpoch) ? this.resultSet.launchDateEpoch : null;
          this.endDateEpoch         = (this.resultSet.endDateEpoch) ? this.resultSet.endDateEpoch : null;
          this.keywords             = (this.resultSet.keywords) ? this.resultSet.keywords : null;
          this.popularity           = (this.resultSet.popularity) ? this.resultSet.popularity : null;
          this.objectID             = (this.resultSet.objectID) ? this.resultSet.objectID : null;
          this.tickets              = (this.resultSet.tickets) ? this.resultSet.tickets : null;
      }
    
    
    getDataSet() {
        return this.resultSet;
    }
    getTotalresults(){
        return this.totalResultsSet;
    }
   
    getName(){
        return this.name;
    }

    getcontent_id(){
        return this.content_id;
    }
    
    getseo(){
        return this.seo;
    }

    getslug(){
        return this.slug;
    }

    getfollowCount(){
        return this.followCount;
    }
    
    getevent_details_id(){
        return this.event_details_id;
    }

    getgenre(){
        return this.genre;
    }

    getcoverImage(){
        return this.coverImage;
    }

    getposterImage(){
        return this.posterImage;
    }

    getimages(){
        return this.images;
    }

    getartists(){
        return this.artists;
    }

    getlinks(){
        return this.links;
    }

    getvideos(){
        return this.videos;
    }
    
    getstartTime(){
        return this.startTime;
    }
    
    getendTime(){
        return this.endTime;
    }

    getlaunchDate(){
        return this.launchDate;
    }

    getcontent_id(){
        return this.content_id;
    }
    getlaunchDateEpoch(){
        return this.launchDateEpoch;
    }
    
    getendDateEpoch(){
        return this.endDateEpoch;
    }

    getkeywords(){
        return this.keywords;
    }
    getpopularity(){
        return this.popularity;
    }
    getobjectID(){
        return this.objectID;
    }

    gettickets(){
        return this.tickets;
    }

    // getShowStreamersCount(){
    //   return this.showStreamerscount;
    // }

    // getLanguageObject(){
    //  return this.language;
    // }

}   

module.exports = ElasticDetailResponseUtils;
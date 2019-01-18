var esb = require('elastic-builder');
const util = require('util')

// const FRONTEND_SERVICE = sails.config.custom.FRONTEND_SERVICE_PATH;
// const BACKEND_SERVICE = sails.config.custom.BACKEND_SERVICE_PATH;
const BACKEND_SERVICE = '/var/www/html/prod/streama2z-api/api/services/backend/';
const FRONTEND_SERVICE = '/var/www/html/prod/streama2z-api/api/services/frontend/';

// const SeoService                 = require(BACKEND_SERVICE + 'seo/SeoService.js');
const ContentService             = require('./contentService.js');
// const FiltersService             = require(BACKEND_SERVICE + 'filters/FiltersService.js');
const FilterGroupService         = require('./filterGroupService');
const dynamicService             = require('./dynamicService.js');
// const PeopleService              = require(BACKEND_SERVICE + 'people/PeopleService.js');
// const StreamersService           = require(BACKEND_SERVICE + 'streamer/StreamerService.js');

const ElasticDetailResponseUtils = require('../response/responseUtils/ElasticDetailResponseUtils');
const EventListResponse      = require('../response/eventList/eventListResponse');
// const SeoResponse                = require('./../../../response/seo/SeoResponse.js');

const CONSTANT_YES                             = 'yes';
const CONSTANT_NO                              = 'no';
const CURRENT_YEAR                             = (new Date()).getFullYear();
const AGGREGATION_LIMIT                        = 15;
const LIST_PER_PAGE_COUNT                      = 24;
const LIST_PER_PAGE_START                      = 0;
const DEFAULT_SORT_BY_TMDB_RATING              = 'launchDateEpoch';
const DEFAULT_SORT_BY_IMDB_RATING              = 'imdbRating';
const FILTER_INTERNAL_NAME_CONTENT_TYPE        = 'contentTypes';
const FILTER_INTERNAL_NAME_GENRES              = 'genres';
const FILTER_INTERNAL_NAME_LANGUAGES           = 'languages';
const FILTER_INTERNAL_NAME_RELEASE_YEAR        = 'releaseYear';
const FILTER_INTERNAL_NAME_STREAMING_PROVIDERS = 'streamers';

module.exports = {

    getListdynamic: async function(params) {
        let slug = params.slug;
        var requestFilter = {};
        let venue = (params.venue)?params.venue:null;
        requestFilter['venue'] = venue;
        var aggregationsName = Array(
          {'aggName':'genres', 'elasticFieldName':"genre"},
          {'aggName':'venue', 'elasticFieldName':"venue.city.keyword"},
          {'aggName':'artist', 'elasticFieldName':"artists"}
        );

        // Get filter data  
        let results = await dynamicService.dynamicListPages(slug);
        filters = JSON.parse(results[0]['filters']);

        //Get ElasticFieldName value based on aggregationName
        for(var y=0;y<aggregationsName.length;y++){
          let object = {};
          let field = aggregationsName[y]['elasticFieldName'];
          let value = filters[field];
          aggregationsName[y].elasticFieldValue =  (value)?value:null; 
        }
        
        let filtersArray = [];
        
        //Generate Main Query
        let mainQueryData = await module.exports.mainQuery(filters, null);
        let mainQuery = mainQueryData['mainQuery'];

        //Generate Aggregation Query
        let getaggregationQuery = await module.exports.aggregationQuery(aggregationsName, filters, requestFilter );
        var finalQuery = esb.requestBodySearch()
                      .query(mainQuery)
                      .aggregations(getaggregationQuery)
                      .from(0)
                      .size(10);
                    //   .sorts([
                    //     esb.sort(sortBy, sortOrder),
                    //     esb.sort('releaseYear', 'desc'),
                    //   ]);
        let queryResult     = await ContentService.getESContent(finalQuery);
        let hits            = (queryResult.hits !== null)?queryResult.hits.hits:null;
        let aggregations    = (queryResult.aggregations !== null)?queryResult.aggregations:null;
        var contents = [];
        var listResponse = {};
        if(hits !== null){
          var resultLength = hits.length;
          for(let i=0; i<resultLength; i++){
            let contentData = await this.getListPageResponse(hits[i]);
                contents.push(contentData);
          }
        }
    
        listResponse.totalCount   = queryResult.hits.total;
        listResponse.contents     = contents;
        // listResponse.aggregations = await this.getAggregationResponse('', aggregations, '');
        listResponse.aggregations = queryResult.aggregations;
        // listResponse.streamers    = listResponse.aggregations[4];
        listResponse.start        = 0;
        // listResponse.start        = listQuery.start;
        // listResponse.max          = listQuery.max;
        listResponse.max          = 10;
        // listResponse.sortBy       = listQuery.sortBy;
        // listResponse.sortOrder    = listQuery.sortOrder;
        // listResponse.heading      = listQuery.heading;
        // listResponse.description  = listQuery.description;
        // listResponse.seo          = listQuery.seo;
    
        return listResponse;
          

        // return queryResult;
    },

    mainQuery: async function(filters, elasticFieldName){
      var termqueries = [];  
      var filtersName = [];
      var keys = Object.keys(filters);
      // console.log(keys);
      for(var i=0; i<keys.length;i++){
        var value = filters[keys[i]];
        if((keys[i] == elasticFieldName) || (keys[i] == 'launchDateEpoch') || (keys[i] == 'showOnlyUpcomingMovies') || (keys[i] == 'sort_order') || (keys[i] == 'dateLimit')){

        }
        else{
          let term = esb.termsQuery(
            keys[i],
            value
        );
        termqueries.push(term);
        }
      }

    //   for(var i=0; i< filtersArray.length; i++){
    //     if(filtersArray[i] !== null){
    //         if(filtersArray[i][0] == 'dateLimit'){

    //         }else if(filtersArray[i][0] == 'sort_order'){

    //         }else if(filtersArray[i][0] == 'launchDateEpoch'){

    //         }else if(filtersArray[i][0] == 'showOnlyUpcomingMovies'){

    //         }else{
    //             if(Array.isArray(filtersArray[i][1])){
    //                 if(filtersArray[i][1].length == 1){
    //                     var split = filtersArray[i][1][0];   
    //                 }else{
    //                     var split = filtersArray[i][1].split(',');   
    //                 }
    //             }else{
    //                 var split = filtersArray[i][1];
    //             }
    //             filtersName.push(filtersArray[i][0]);
    //             let term = esb.termQuery(
    //                 filtersArray[i][0],
    //                 split
    //             );
    //             termqueries.push(term);
    //         }
    //     }
    // }
    // console.log('term', termqueries);
    let mainQuery   = esb.boolQuery()
    .must(termqueries)
    // .should(mainQueries.should)
    .boost(1.0);

    var data = [];
    data['mainQuery'] = mainQuery;
    data['filtersName'] = keys;
    return data;
    },

    aggregationQuery: async function(aggregationsName, filters, requestFilter ) {
        // console.log('requestFilter', requestFilter);
        console.log('aggregationsName', aggregationsName);
        let aggregation = [];
        let filterBasedQuery = {};
        
        for(var i=0;i<aggregationsName.length;i++){
           let aggName = aggregationsName[i].aggName;
           let elasticFieldName = aggregationsName[i].elasticFieldName;
           let elasticFieldValue = aggregationsName[i].elasticFieldValue; 
           //  filtersArray.filter( filterName => {
          //    if(filterName == elasticFieldName){
          let filterBasedQuery = await module.exports.mainQuery(filters, elasticFieldName);
          let aggMainQuery = filterBasedQuery['mainQuery'];
          //      return true;
          //    }
          
          //  });

        // var requestFilterQuery = esb.termQuery()

        subAggregation = esb.termsAggregation(aggName,elasticFieldName)
                .size(AGGREGATION_LIMIT);
        //let filterName = 'genres';  
          let filter = esb.globalAggregation(aggName).aggregations([
                 esb.filterAggregation(aggName,
                  esb.boolQuery()
                    .must(aggMainQuery)
                    // .should(filterBasedQuery.should)
                    .boost(1.0)
                )
                .aggregations([subAggregation])
          ]);
             aggregation.push(filter);

             
   
        }
        // console.log('aggregation', aggregation);
        // aggregation.push(filter1);

        return aggregation;
      },
      
    getFiltersSelected: async function(queryParams) {
      var paramsArray = {};
      if (queryParams != null) {
        paramsArray = queryParams.split('~').reduce((obj, str, index) => {
        let strParts = str.split(':');
      if (strParts[0] && strParts[1]) {
        //<-- Make sure the key & value are not undefined
        obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of value strings
      }
      return obj;
      }, {});
      }
      return paramsArray;
    },
  getListPageContentResult: async function(params){
    let listResponse = {};
    let contents = [];
    var allFilterGroups = await FilterGroupService.getAllFilterGroups();
    let listQuery       = await getListQuery(params, allFilterGroups);
    let queryResult     = await ContentService.getESContent(listQuery.finalQuery);
    let hits            = (!_.isEmpty(queryResult.hits))?queryResult.hits.hits:null;
    let aggregations    = (!_.isEmpty(queryResult.aggregations))?queryResult.aggregations:null;

    if(!_.isEmpty(hits)){
      var resultLength = hits.length;
      for(let i=0; i<resultLength; i++){
        let contentData = await this.getListPageResponse(hits[i]);
        contents.push(contentData);
      }
    }

    listResponse.totalCount   = queryResult.hits.total;
    listResponse.contents     = contents;
    listResponse.aggregations = await this.getAggregationResponse(allFilterGroups, aggregations, listQuery.filterSelected);
    listResponse.streamers    = listResponse.aggregations[4];
    listResponse.sortBy       = listQuery.sortBy;
    listResponse.sortOrder    = listQuery.sortOrder;
    listResponse.heading      = listQuery.heading;
    listResponse.description  = listQuery.description;
    return listResponse;
  },

  getListPageResponse: async function(result) {
    var ElasticDetailResponseUtilsObj = new ElasticDetailResponseUtils(result);
    var EventListResponseObj      = new EventListResponse();
    let contentData = EventListResponseObj.getEventListResponse(ElasticDetailResponseUtilsObj);
    return contentData;
  },

};


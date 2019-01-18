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

  getListPageResult: async function(params) {
    let listResponse = {};
    let contents = [];
    var allFilterGroups = await FilterGroupService.getAllFilterGroups();
    let listQuery       = await getListQuery(params, allFilterGroups);
    // let listQuery = {
    //     "query": {
    //       "match_all": {}
    //     },
    //     "from": 0,
    //     "size": 10,
    //     "sort": [],
    //     "aggregations": {
    //       "genre": {
    //         "global": {},
    //         "aggregations": {
    //           "genres": {
    //             "filter": {
    //               "bool": {
    //                 "must": {
    //                   "term": {
    //                     "venue.country.keyword": "India"
    //                   }
    //                 },
    //                 "adjust_pure_negative": true,
    //                 "boost": 1
    //               }
    //             },
    //             "aggregations": {
    //               "genres": {
    //                 "terms": {
    //                   "field": "genre"
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       },
    //       "city": {
    //         "global": {},
    //         "aggregations": {
    //           "cities": {
    //             "filter": {
    //               "bool": {
    //                 "must": {
    //                   "term": {
    //                     "venue.country.keyword": "India"
    //                   }
    //                 },
    //                 "adjust_pure_negative": true,
    //                 "boost": 1
    //               }
    //             },
    //             "aggregations": {
    //               "cities": {
    //                 "terms": {
    //                   "field": "venue.city.keyword"
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       },
    //       "date_range": {
    //         "global": {},
    //         "aggregations": {
    //           "date_ranges": {
    //             "filter": {
    //               "bool": {
    //                 "must": {
    //                   "term": {
    //                     "venue.country.keyword": "India"
    //                   }
    //                 },
    //                 "adjust_pure_negative": true,
    //                 "boost": 1
    //               }
    //             },
    //             "aggregations": {
    //               "date_ranges": {
    //                 "range": {
    //                   "field": "launchDateEpoch",
    //                   "ranges": [
    //                     {
    //                       "from": "1529478000",
    //                       "to": "1535810400"
    //                     },
    //                     {
    //                       "from": "1530455400",
    //                       "to": "1532782800"
    //                     }
    //                   ]
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   };

    console.log('listQuery', util.inspect(listQuery, {showHidden: false, depth: null}))
    // console.log('listQuery', listQuery);
    // return;
    let queryResult     = await ContentService.getESContent(listQuery);
    let hits            = (queryResult.hits !== null)?queryResult.hits.hits:null;
    let aggregations    = (queryResult.aggregations !== null)?queryResult.aggregations:null;

    if(hits !== null){
      var resultLength = hits.length;
      for(let i=0; i<resultLength; i++){
        let contentData = await this.getListPageResponse(hits[i]);
            contents.push(contentData);
      }
    }

    listResponse.totalCount   = queryResult.hits.total;
    listResponse.contents     = contents;
    // listResponse.aggregations = await this.getAggregationResponse(allFilterGroups, aggregations, listQuery.filterSelected);
    // listResponse.aggregations = queryResult.aggregations;
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

  getAggregationResponse: async function(allFilterGroups, aggregations, filterSelected){
    let filterOptions = [];
    if(aggregations !== null){
      for(let i=0; i<allFilterGroups.length; i++){
        let internalName = allFilterGroups[i].internalName;
        let aggregate    = aggregations[internalName][internalName];
        let fieldValues  = aggregate[internalName]['buckets'];
        for(let k=0; k<fieldValues.length; k++){
          let key       = fieldValues[k].key;
          let keyData   = await getFilterGroupKeyName(internalName, key);
          let count     = fieldValues[k].doc_count;
          keyData.count = count;
          keyData.selected = false;
          if(filterSelected.hasOwnProperty(internalName)){
            key = key.toString();
            if(filterSelected[internalName].indexOf(key) > -1){
              keyData.selected = true;
            }
          }
          filterOptions.push(keyData);
        }
        if(allFilterGroups[i].filterType == 'TERM'){
          allFilterGroups[i].termFilters = filterOptions;
          allFilterGroups[i].rangeFilters = null;
        }
        else{
          allFilterGroups[i].rangeFilters = filterOptions;
          allFilterGroups[i].termFilters = null;
        }
        allFilterGroups[i].successCount = aggregate['doc_count'];
        filterOptions = [];
      }
    }
    return allFilterGroups;
  },

  getTopTenContent: async function(params){
    let listResponse = {};
    let contents = [];
    var allFilterGroups = await FilterGroupService.getAllFilterGroups();
    let listQuery       = await getTopTenContentListQuery(params, allFilterGroups);
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

    listResponse.totalCount   = 10;//queryResult.hits.total;
    listResponse.contents     = contents;
    listResponse.aggregations = await this.getAggregationResponse(allFilterGroups, aggregations, listQuery.filterSelected);
    listResponse.streamers    = listResponse.aggregations[4];
    listResponse.sortBy       = listQuery.sortBy;
    listResponse.sortOrder    = listQuery.sortOrder;
    listResponse.heading      = listQuery.heading;
    listResponse.description  = listQuery.description;
    return listResponse;
  },

  getPopularStoreContent: async function(params){
    let listResponse = {};
    let contents = [];
    var allFilterGroups = await FilterGroupService.getAllFilterGroups();
    let listQuery       = await getPopularStoreContentQuery(params, allFilterGroups);
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
  
  getSeoRules             : getSeoRules,
  getListQuery            : getListQuery,
  getMainQuery            : getMainQuery,
  getFiltersSelected      : getFiltersSelected,
  getAggregationQuery     : getAggregationQuery,
  getFilterGroupKeyName   : getFilterGroupKeyName,
  getCompleteFiltersArray : getCompleteFiltersArray,

};

//Get all Seo Rules based on seo source passed
async function getSeoRules(pageSeo) {
  let seoRulesData = {seo:null, seoRules: null, heading:null, description:null};
  if (pageSeo !== null) {
    let complete_seo = '/list' + pageSeo;
    let seoData      = await SeoService.getSeoId(complete_seo);
    let seo = { id: seoData[0].id, pageType: seoData[0].pageType, entityId: seoData[0].entityId, 
                seoSource: seoData[0].seoSource, indexable: seoData[0].indexable,
                anchorText: seoData[0].anchorText, metaTitle: seoData[0].metaPageTitle,
                metaDescription: seoData[0].metaDesc, metaKeywords: seoData[0].metaKeywords,
                redirectionUrl: seoData[0].redirectionUrl, createdAt: seoData[0].createdAt, 
                updatedAt: seoData[0].updatedAt, status: seoData[0].status }

    seoRulesData.seo             = seo;
    seoRulesData.seoRules        = seoData[0].seoRules;
    seoRulesData.heading         = seoData[0].heading;
    seoRulesData.description     = seoData[0].description;
  }
  return seoRulesData;
}

async function getCustomSeoRules(contentType){
  let seoRules = [];
  if(contentType != null){
    seoRules = [{
      internalName: 'status',
      elasticFieldName: 'status',
      fieldValue:contentType,
      ruleElasticFieldValue:'status.keyword',
      ruleOperator:'AND',
      ruleIdentifier:'query',
      ruleQueryType:'term_query',
      ruleSortBy:null,
      seoId:null,
    }];
  }
  return seoRules;
}

//Get Selected Filters
async function getFiltersSelected(queryParams) {
  var paramsArray = {};
  if (queryParams !== null) {
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
}

//Create Complete Query
async function getListQuery(params, allFilterGroups){
  let pageSeo     = params.seo ? params.seo : null;
  let queryParams = params.qp ? params.qp : null;
  let start       = params.start ? params.start : LIST_PER_PAGE_START;
  let max         = params.max ? params.max : LIST_PER_PAGE_COUNT;
  let fromNo      = (start * max);
  let sortBy      = params.sortBy ? params.sortBy : DEFAULT_SORT_BY_TMDB_RATING;
  let sortOrder   = params.sortOrder ? params.sortOrder : 'desc';
  let seoRules;
  let listPageHeading = null;
  let listPageDescription = null;
  let listSeo = null;
  if(pageSeo == null){
    let contentType = params.content ? params.content:null;
    seoRules  = await getCustomSeoRules(contentType);
  }
  else{
    let seoRulesData  = await getSeoRules('/' + pageSeo);  //Get Seo Rules From Table
    listSeo = seoRulesData.seo;
    seoRules = seoRulesData.seoRules;
    listPageHeading = seoRulesData.heading;
    listPageDescription = seoRulesData.description;
  }

  let filters     = await getFiltersSelected(queryParams);   //Get Filters Applied
  let dataArray   = await getCompleteFiltersArray(allFilterGroups, filters, seoRules);
  let completeFilters  = dataArray.filtersGroup;
//   let completeFilters  = [];
  let filtersNameArray = dataArray.internalsName;
  let filtersSelected  = dataArray.filterSelected;

  let mainQueries = await getMainQuery(completeFilters, null);  //Build list query
  let mainQuery   = esb.boolQuery()
                    .must(mainQueries.must)
                    .should(mainQueries.should)
                    .boost(1.0);
console.log('mainQuery', util.inspect(mainQuery, {showHidden: false, depth: null}));
return;
  let aggregationQuery = await getAggregationQuery(completeFilters,filtersNameArray);
  var finalQuery = esb.requestBodySearch()
                .query(mainQuery)
                // .aggregations(aggregationQuery)
                .from(fromNo)
                .size(max)
                .sorts([
                  esb.sort(sortBy, sortOrder),
                //   esb.sort('genre', 'desc'),
                  esb.sort(DEFAULT_SORT_BY_TMDB_RATING, 'desc'),
                ]);
  let listQuery = {};
  listQuery.finalQuery     = finalQuery;
  listQuery.filterSelected = filtersSelected;
  listQuery.sortBy         = sortBy;
  listQuery.sortOrder      = sortOrder;
  listQuery.start          = start;
  listQuery.max            = max;
  listQuery.heading        = listPageHeading;
  listQuery.description    = listPageDescription;
  listQuery.seo            = listSeo;

  return listQuery;
}

//Prepare complete Filters
async function getCompleteFiltersArray(allFilterGroups, filtersSelected, seoRules) {
  let filtersGroup = []; let fieldValues = []; let internalNamesArray=[];
  let fieldValue; let filterInternalName;
  let ruleQueryType = 'term_query';
  let filterSelectedValues={};
  for (let i = 0; i < allFilterGroups.length; i++) {
    filterInternalName = allFilterGroups[i].internal_name;  //Get internal name
    internalNamesArray.push(filterInternalName);
    let filter_exist = filtersSelected.hasOwnProperty(filterInternalName);
    if (filter_exist == true) {
      if(filtersSelected[filterInternalName].indexOf(',') > -1) {      //Get selected values
        ruleQueryType = 'term_query';
        fieldValue    = filtersSelected[filterInternalName].split(',');
        fieldValue.forEach(element => {
          if(element.indexOf(';') > -1) {
            ruleQueryType = 'range_query';
          }
          fieldValues.push(element);
        });
      }
      else{
        if(filtersSelected[filterInternalName].indexOf(';') > -1) {
          ruleQueryType = 'range_query';
          fieldValues.push(filtersSelected[filterInternalName]);
        }
        else{
          ruleQueryType = 'term_query';
          fieldValue    = filtersSelected[filterInternalName];
          fieldValues.push(filtersSelected[filterInternalName]);
        }
      }
    }
    else{
    }
      //Fetch if same field rules exist in seoRules if yes tehn get the values and delete that field from seoRules
    let deleteValue = -1;
    if(seoRules !== null){
      for (let j = 0, len = seoRules.length; j < len; j++) {
        if (filterInternalName == seoRules[j].internalName) {
          deleteValue = j;
          fieldValue = seoRules[j].fieldValue;
          if(fieldValues.indexOf(fieldValue) == -1) {
            fieldValues.push(fieldValue);
          }
        }
      }
      if (deleteValue > -1) {
        seoRules.splice(deleteValue, 1);
      }
    }

    let filterDataObject = {
      internalName     : filterInternalName,
      elasticFieldName : allFilterGroups[i].elastic_field_name,
      fieldValue       : fieldValues,
      ruleOperator     : allFilterGroups[i].composer_type,
      ruleIdentifier   : 'query',
      ruleQueryType    : ruleQueryType,
    };

    if(fieldValues !== null){
      filterSelectedValues[filterInternalName] = (fieldValues);
    }

    fieldValues = [];
    filtersGroup.push(filterDataObject);
  }

  //Atlast check if any field in seoRules is not left out
  if (seoRules !== null) {
    for (let k = 0; k < seoRules.length; k++) {
      filtersGroup.push(seoRules[k]);
    }
  }
  let return_array = {};
  return_array.filtersGroup   = filtersGroup;
  return_array.internalsName  = internalNamesArray;
  return_array.filterSelected = filterSelectedValues;
  return return_array;
}

//Create Query
async function getMainQuery(completeFilters, exclude) {
  let i = 0;
  let mainQueries = [];
  let mustQuery = [];
//   mustQuery.push(esb.termQuery('offersAvailable',CONSTANT_YES));
  let shouldQuery = [];
  for (let i = 0; i < completeFilters.length; i++) {
    if ((completeFilters[i].fieldValue !== null) && (completeFilters[i].internalName !== exclude) ) {
      if (completeFilters[i].ruleQueryType == 'term_query') {
        if (completeFilters[i].ruleOperator == 'AND') {
          mustQuery.push(
              esb.termsQuery(
                completeFilters[i].elasticFieldName,
                completeFilters[i].fieldValue
              )
          );
        }
        else{
          shouldQuery.push(
              esb.termsQuery(
                completeFilters[i].elasticFieldName,
                completeFilters[i].fieldValue
              )
          );
        }
      }
      else if(completeFilters[i].ruleQueryType == 'range_query') {
        for(let j=0; j<completeFilters[i].fieldValue.length; j++){
          let valuesArray = completeFilters[i].fieldValue[j].split(';');
          if(valuesArray[0] > valuesArray[1]){
            gte = valuesArray[0];
            lte = valuesArray[1]; }

          else{
            gte = valuesArray[1];
            lte = valuesArray[0];
          }
          mustQuery.push(esb.rangeQuery( completeFilters[i].elasticFieldName)
              .gte(valuesArray[0])
              .lte(valuesArray[1])
          );
        }
      }
    }
  }

  mainQueries.must = mustQuery;
  mainQueries.should = shouldQuery;
  return mainQueries;
}

//Create Aggregation
async function getAggregationQuery(completeFilters, filtersNameArray) {
  let aggregation = [];
  let filterBasedQuery = {};
  for (let i = 0; i < completeFilters.length; i++) {
    let filterName = completeFilters[i].internalName;
    if (filtersNameArray.indexOf(filterName) > -1) {
      filterBasedQuery = await getMainQuery(completeFilters, filterName);
      let subAggregation = esb.termsAggregation(filterName,completeFilters[i].elasticFieldName)
           .size(AGGREGATION_LIMIT);
      if(filterName == 'peopleId'){
        subAggregation = esb.termsAggregation(filterName,completeFilters[i].elasticFieldName)
             .size(AGGREGATION_LIMIT)
             //.order('cast.popularity','desc');
      }
      
      let filter = esb.globalAggregation(filterName).aggregations([
             esb.filterAggregation(filterName,
              esb.boolQuery()
                .must(filterBasedQuery.must)
                .should(filterBasedQuery.should)
                .boost(1.0)
            )
            .aggregations([subAggregation])
      ]);
      aggregation.push(filter);
    }
  }
  return aggregation;
}

//Get Filter Group Key Name
async function getFilterGroupKeyName(internalName, key){
  let data = await FiltersService.getFilter(key, internalName);
  let filterName = key;
  if(internalName == 'peopleId'){
    let peopleData = await PeopleService.getPeople(key);
    filterName = peopleData[0].firstName + " " + peopleData[0].lastName;
  }
  if(data !== null){
    return data[0];
  }
  else{
    return { filterName: filterName,
      filterValue: key
    };
  }
}

async function getTopTenContentListQuery(params, allFilterGroups){
  let pageSeo     = params.seo ? params.seo : null;
  let queryParams = params.qp ? params.qp : null;
  let start       = LIST_PER_PAGE_START;
  let max         = 10;
  let fromNo      = (start * max);
  let sortBy      = params.sortBy ? params.sortBy : DEFAULT_SORT_BY_TMDB_RATING;
  let sortOrder   = params.sortOrder ? params.sortOrder : 'desc';
  let seoRules;
  let listPageHeading = null;
  let listPageDescription = null;
  let listSeo = null;
  if(pageSeo == null){
    let contentType = params.content ? params.content:null;
    seoRules  = await getCustomSeoRules(contentType);
  }
  else{
    let seoRulesData  = await getSeoRules('/' + pageSeo);  //Get Seo Rules From Table
    listSeo = seoRulesData.seo;
    seoRules = seoRulesData.seoRules;
    listPageHeading = seoRulesData.heading;
    listPageDescription = seoRulesData.description;
  }

  let filters     = await getFiltersSelected(queryParams);   //Get Filters Applied
  let dataArray   = await getCompleteFiltersArray(allFilterGroups, filters, seoRules);
  let completeFilters  = dataArray.filtersGroup;
  let filtersNameArray = dataArray.internalsName;
  let filtersSelected  = dataArray.filterSelected;

  let mainQueries = await getMainQuery(completeFilters, null);  //Build list query
  let mainQuery   = esb.boolQuery()
                    .must(mainQueries.must)
                    .should(mainQueries.should)
                    .boost(1.0);

  let aggregationQuery = await getAggregationQuery(completeFilters,filtersNameArray);
  var finalQuery = esb.requestBodySearch()
                .query(mainQuery)
                .aggregations(aggregationQuery)
                .from(fromNo)
                .size(max)
                .sorts([
                  esb.sort(sortBy, sortOrder),
                  esb.sort('releaseYear', 'desc'),
                ]);

  let listQuery = {};
  listQuery.finalQuery     = finalQuery;
  listQuery.filterSelected = filtersSelected;
  listQuery.sortBy         = sortBy;
  listQuery.sortOrder      = sortOrder;
  listQuery.start          = start;
  listQuery.max            = max;
  listQuery.heading        = listPageHeading;
  listQuery.description    = listPageDescription;
  listQuery.seo            = listSeo;

  return listQuery;
}

async function getPopularStoreContentQuery(params, allFilterGroups){
  let providerName  = params.storeName ? params.storeName : null;
  providerName      = providerName.replace(/-/g, ' ');
  //let storeData   = await StreamersService.get""StoreName(storeId);
  let providerData   = await sails.sendNativeQuery("Select * from streaming_provider where provider like '"+providerName+"' ;");
  let storeData   = providerData.rows;
  let storeName   = (!_.isEmpty(storeData[0]))?storeData[0].provider:null;
  let pageSeo     = params.seo ? params.seo : null;
  let queryParams = params.qp ? params.qp : null;
  if(queryParams!=null){
    queryParams     = queryParams + '~'+FILTER_INTERNAL_NAME_STREAMING_PROVIDERS+':'+storeName;
  }
  else{
    queryParams     = FILTER_INTERNAL_NAME_STREAMING_PROVIDERS+':'+storeName;
  }
  console.log(queryParams);
  let start       = params.start ? params.start : LIST_PER_PAGE_START;
  let max         = params.max ? params.max : LIST_PER_PAGE_COUNT;
  let fromNo      = (start * max);
  let sortBy      = params.sortBy ? params.sortBy : DEFAULT_SORT_BY_TMDB_RATING;
  let sortOrder   = params.sortOrder ? params.sortOrder : 'desc';
  let seoRules;
  let listPageHeading = null;
  let listPageDescription = null;
  let listSeo = null;
  if(pageSeo == null){
    let contentType = params.content ? params.content:null;
    seoRules  = await getCustomSeoRules(contentType);
  }
  else{
    let seoRulesData  = await getSeoRules('/' + pageSeo);  //Get Seo Rules From Table
    listSeo = seoRulesData.seo;
    seoRules = seoRulesData.seoRules;
    listPageHeading = seoRulesData.heading;
    listPageDescription = seoRulesData.description;
  }

  let filters     = await getFiltersSelected(queryParams);   //Get Filters Applied
  let dataArray   = await getCompleteFiltersArray(allFilterGroups, filters, seoRules);
  let completeFilters  = dataArray.filtersGroup;
  let filtersNameArray = dataArray.internalsName;
  let filtersSelected  = dataArray.filterSelected;

  let mainQueries = await getMainQuery(completeFilters, null);  //Build list query
  let mainQuery   = esb.boolQuery()
                    .must(mainQueries.must)
                    .should(mainQueries.should)
                    .boost(1.0);

  let aggregationQuery = await getAggregationQuery(completeFilters,filtersNameArray);
  var finalQuery = esb.requestBodySearch()
                .query(mainQuery)
                .aggregations(aggregationQuery)
                .from(fromNo)
                .size(max)
                .sorts([
                  esb.sort(sortBy, sortOrder),
                  esb.sort('releaseYear', 'desc'),
                ]);

  let listQuery = {};
  listQuery.finalQuery     = finalQuery;
  listQuery.filterSelected = filtersSelected;
  listQuery.sortBy         = sortBy;
  listQuery.sortOrder      = sortOrder;
  listQuery.start          = start;
  listQuery.max            = max;
  listQuery.heading        = listPageHeading;
  listQuery.description    = listPageDescription;
  listQuery.seo            = listSeo;

  return listQuery;
}

function dynamic_list(){

}
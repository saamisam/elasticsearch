// const FRONTEND_SERVICE = sails.config.custom.FRONTEND_SERVICE_PATH;
// const BACKEND_SERVICE = sails.config.custom.BACKEND_SERVICE_PATH;
// const BACKEND_SERVICE = "/var/www/html/prod/streama2z-api/api/services/backend/";
// const FRONTEND_SERVICE = "/var/www/html/prod/streama2z-api/api/services/frontend/";

var ListPageService = require("../services/listPageService");
// const UsersController = require('./UsersController.js');
const ResponseService = require("../services/ResponseService");
const dynamicListPageService = require("../services/dynamicListPageService");

module.exports = {

  getlist: async function(req, res) {
    let params = req;
    var formatedResult = await ListPageService.getListPageResult(params);
    // formatedResult = await UsersController.getUserDetails(req, formatedResult);
    ResponseService.cndResponse(res, 200, "Success", formatedResult);
  },

  dynamic: async function(req, res) {
    let params = req;
    var formatedResult = await dynamicListPageService.getListdynamic(params);
    // formatedResult = await UsersController.getUserDetails(req, formatedResult);
    ResponseService.cndResponse(res, 200, "Success", formatedResult);

  }

};

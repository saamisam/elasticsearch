module.exports = {
  cndResponse:function(res, responseCode, message, records){
    return res.send({status: responseCode, message:message, data:records});
  },
};

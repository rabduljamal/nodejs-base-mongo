var express = require('express');
var router = express.Router();
const repEvent = require(appDir + '/app/repository/Event/Event');

/* GET ALL events */
router.get('/', function(req, res, next) {
  repEvent.get(req, res, async(data, error) =>{
    if(!error){
      Responser.success(res, "Get Event Successfully", await data)
    }else{
      Responser.error(res, "Error Get Event", error)
    }
  })
});

/* GET SINGLE EVENT BY ID */
router.get('/:id', function(req, res, next) {
  repEvent.getById(req, res, async(data, error) =>{
    if(!error){
      Responser.success(res, "Get Event Successfully", await data)
    }else{
      Responser.error(res, "Error Get Event", error)
    }
  })
});

/* SAVE EVENT */
router.post('/', function(req, res, next) {
  repEvent.create(req, res, async(data, error) =>{
    if(!error){
      Responser.success(res, "Create Event Successfully", await data)
    }else{
      Responser.error(res, "Error Create Event", error)
    }
  })
});

/* UPDATE EVENT */
router.patch('/:id', function(req, res, next) {
  repEvent.patch(req, res, async(data, error) =>{
    if(!error){
      Responser.success(res, "Update Event Successfully", await data)
    }else{
      Responser.error(res, "Error Update Event", error)
    }
  })
});

/* DELETE EVENT */
router.delete('/:id', function(req, res, next) {
 repEvent.destroy(req, res, async(data, error) =>{
    if(!error){
      Responser.success(res, "Delete Event Successfully", await data)
    }else{
      Responser.error(res, "Error Delete Event", error)
    }
  })
});

module.exports = router;
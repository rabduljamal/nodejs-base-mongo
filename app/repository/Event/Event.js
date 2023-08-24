
var Event = require(appDir+'/app/models/Event');

const get = async (req, res, callback) =>{
  try {
    let events = await Event.find({})
    callback(await events, '')
  } catch (error) {
    log.error(error)
    callback('', error)
  }
}

const getById = async (req, res, callback) =>{
  try {
    let event = await Event.findById(req.params.id)
    callback(await event, '')
  } catch (error) {
    log.error(error)
    callback('', error)
  }
}

const create = async (req, res, callback) =>{
  try {
    let event = await  Event.create(req.body)
      callback(await event, '')
  } catch (error) {
    log.error(error)
    callback('', error)
  }
}

const patch = async (req, res, callback) =>{
  try {
    let event = await Event.findByIdAndUpdate(req.params.id, req.body, {new: true})
    console.info(await event);
    callback(await event, '')
  } catch (error) {
    log.error(error)
    callback('', error)
  }
}

const destroy = async (req, res, callback) =>{
  try {
    let event = await Event.findByIdAndUpdate(req.params.id, {isDeleted:Date.now()}, {new: true})
    console.info(await event);
    callback(await event, '')
  } catch (error) {
    log.error(error)
    callback('', error)
  }
}

module.exports = { get, create, patch, destroy, getById };
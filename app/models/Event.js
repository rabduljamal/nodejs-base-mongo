var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  name: String,
  desctription: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  isDeleted: { type: Date, defaults: null }
})

EventSchema.pre('find', function() {
  this.where({ isDeleted: null });
});

EventSchema.pre('findOne', function() {
  this.where({ isDeleted: null });
});

module.exports = mongoose.model('Event', EventSchema);
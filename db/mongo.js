const mongoose = require('mongoose')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // reconnectTries: 30, // Retry up to 30 times
  // reconnectInterval: 500, // Reconnect every 500ms
  // poolSize: 10, // Maintain up to 10 socket connections
  // // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries: 0
}

exports.init = ({ onConnect, onDisconnect, onError }) => {
  const mongoCred = {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    name: process.env.MONGO_DBNAME,
    auth: process.env.MONGO_AUTH
  }
  mongoose.set("strictQuery", false);
  mongoose.connect('mongodb://' + mongoCred.user + ':' + mongoCred.password + '@' + mongoCred.host + ':' + mongoCred.port + '/' + mongoCred.name + '?authSource='+mongoCred.auth, options)
  // mongoose.connect("mongodb+srv://" + mongoCred.user + ":" + mongoCred.password + "@" + mongoCred.host + "/" + mongoCred.name + "?retryWrites=true&w=majority",  { useNewUrlParser: true });
  mongoose.connection.on('connected', onConnect)
  mongoose.connection.on('disconnected', onDisconnect)
  mongoose.connection.on('error', onError)
}

exports.disconnect = () => {
  mongoose.disconnect()
}
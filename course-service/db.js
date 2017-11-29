const Datastore = require('nedb');

const db = {};
db.courses = new Datastore('database/courses.db');
db.videos = new Datastore('database/videos.db');

db.courses.loadDatabase();
db.videos.loadDatabase();

module.exports = db;

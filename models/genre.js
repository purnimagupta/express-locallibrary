// var mongoose = require('mongoose');

// var Schema = mongoose.Schema;
// // console.log(Schema)
// var GenreSchema = new Schema(
//   {
//    name: {type: String, min: 3, max: 100, required: true }
//   }
// )

// GenreSchema.virtual('url').get(function(){
//     return '/catelog/genre/' + this._id
// })

// module.export = mongoose.model('Genre', GenreSchema)

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    name: {type: String, required: true, min: 3, max: 100}
});

// Virtual for this genre instance URL.
GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/genre/'+this._id;
});

// Export model.
module.exports = mongoose.model('Genre', GenreSchema);
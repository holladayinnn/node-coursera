var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	dishes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dish'
	}]
}, {
	timestamps: true
});

var favorites = mongoose.model('Favorites', favoriteSchema);
module.exports = favorites;
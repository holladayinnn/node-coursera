var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var promotionSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	image: {
		type: String,
		required: true
	},
	label: {
		type: String,
		required: true,
		default: ""
	},
	price: {
		type: Currency,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	featured: {
        type: Boolean,
        default:false
    } 
}, {
	timestamps: true
	});

var promotions = mongoose.model('Promotion', promotionSchema);

//make this available to our Node applications
module.exports = promotions;
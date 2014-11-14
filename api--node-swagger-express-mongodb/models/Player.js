/**
* The schema and model for user data
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var playerSchema = new mongoose.Schema({
	id: Number,
	name: String,
	email: String
});

exports.def =
	{
		"Player":{
			"id":"Player",
			"required": ["id", "team", "name"],
			"properties":{
				"id":{
					"type":"integer",
					"format": "int64",
					"description": "User unique identifier",
					"minimum": "0.0",
					"maximum": "100.0"
				},
                "team":{
                    "type":"integer",
                    "format": "int64",
                    "description": "Player's Team",
                    "minimum": "0.0",
                    "maximum": "100.0"
                },
				"name":{
					"type":"string",
					"description": "Player's name"
				},
                "number":{
                    "type":"string",
                    "description": "Player's number"
                },
                "position":{
                    "type":"string",
                    "description": "Player's position"
                },
				"email":{
					"type":"string",
					"description": "Player's email address"
				}
			}
		}
	};


// Don't create model if model is exists
if(!mongoose.modelSchemas.users) {
	exports.model = mongoose.model('players', playerSchema);
} else {
	exports.model = '';
}

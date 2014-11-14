/**
* The schema and model for user data
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var teamSchema = new mongoose.Schema({
	id: Number,
	name: String,
	email: String
});

exports.def =
	{
		"Team":{
			"id":"Team",
			"required": ["id", "school", "sport", "gender", "mascot"],
			"properties":{
				"id":{
					"type":"integer",
					"format": "int64",
					"description": "User unique identifier",
					"minimum": "0.0",
					"maximum": "100.0"
				},
				"school":{
					"type":"integer",
                    "format": "int64",
					"description": "School of the team"
				},
				"gender":{
					"type":"string",
					"description": "Team's Gender"
				},
                "division":{
                    "type":"string",
                    "description": "Team's Division"
                },
                "mascot":{
                    "type":"string",
                    "description": "Team's Mascot Name"
                },
                "venue.name":{
                    "type":"string",
                    "description": "Team's Venue Name"
                },
                "venue.address":{
                    "type":"string",
                    "description": "Team's Venue Address"
                },
                "logo":{
                    "type":"string",
                    "description": "Team's Logo"
                },
                "color_dark":{
                    "type":"string",
                    "description": "Team's Colors - Dark"
                },
                "color_light":{
                    "type":"string",
                    "description": "Team's Colors - Light"
                }
			}
		}
	};


// Don't create model if model is exists
if(!mongoose.modelSchemas.users) {
	exports.model = mongoose.model('teams', teamSchema);
} else {
	exports.model = '';
}

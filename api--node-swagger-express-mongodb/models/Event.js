/**
* The schema and model for user data
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var eventSchema = new mongoose.Schema({
	id: Number,
	name: String,
	email: String
});

exports.def =
	{
		"User":{
			"id":"User",
			"required": ["id", "name", "email"],
			"properties":{
				"id":{
					"type":"integer",
					"format": "int64",
					"description": "Unique identifier",
					"minimum": "0.0",
					"maximum": "100.0"
				},
                "team":{
                    "type":"integer",
                    "format": "int64",
                    "description": "Event Team Association",
                    "minimum": "0.0",
                    "maximum": "100.0"
                },
				"name":{
					"type":"string",
					"description": "School's name"
				},
				"description":{
					"type":"string",
					"description": "Event Description"
				},
                "type":{
                    "type":"string",
                    "description": "Event type"
                },
                "datetime.start":{
                    "type":"string",
                    "description": "Event Start"
                },
                "datetime.end":{
                    "type":"string",
                    "description": "Event End"
                },
                "rescheduled":{
                    "type":"boolean",
                    "description": "Was the event rescheduled?"
                },
                "opponent":{
                    "type":"integer",
                    "format": "int64",
                    "description": "Event Opponent (For Games)",
                    "minimum": "0.0",
                    "maximum": "100.0"
                },
                "score.team":{
                    "type":"string",
                    "description": "Event Score - Team"
                },
                "score.opponent":{
                    "type":"string",
                    "description": "Event Score - Opponent"
                },
			}
		}
	};


// Don't create model if model is exists
if(!mongoose.modelSchemas.users) {
	exports.model = mongoose.model('users', eventSchema);
} else {
	exports.model = '';
}

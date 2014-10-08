/**
* The schema and model for user data
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schoolSchema = new mongoose.Schema({
	id: Number,
	name: String,
	address: {
        city: String,
        state: String,
        zip: String,
    },
    division: String,
    mascot: String,
    logo: String,
    color_dark: String,
    color_light: String,
    ecom_link: String
});

exports.def =
	{
		"School":{
			"id":"School",
			"required": ["id", "name", "mascot"],
			"properties":{
				"id":{
					"type":"integer",
					"format": "int64",
					"description": "School unique identifier",
					"minimum": "0.0",
					"maximum": "100.0"
				},
				"name":{
					"type":"string",
					"description": "School's name"
				},
				"address.city":{
					"type":"string",
					"description": "School Address - City"
				},
                "address.state":{
                    "type":"string",
                    "description": "School Address - State"
                },
                "address.zip":{
                    "type":"string",
                    "description": "School Address - Zip"
                },
                "division":{
                    "type":"string",
                    "description": "School Division"
                },
                "mascot":{
                    "type":"string",
                    "description": "School Mascot Name"
                },
                "logo":{
                    "type":"string",
                    "description": "School Logo"
                },
                "color_dark":{
                    "type":"string",
                    "description": "School Colors - Dark"
                },
                "color_light":{
                    "type":"string",
                    "description": "School Colors - Light"
                },
                "ecom_link":{
                    "type":"string",
                    "description": "Link to e-commerce"
                }
			}
		}
	};


// Don't create model if model is exists
if(!mongoose.modelSchemas.users) {
	exports.model = mongoose.model('schools', schoolSchema);
} else {
	exports.model = '';
}

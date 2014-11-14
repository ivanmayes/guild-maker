var sw = require("../Common/node/swagger.js"),
    param = require("../Common/node/paramTypes.js"),
    swe = sw.errors,
    School = require('../models/school.js');

/**
* List methods
*/
exports.getAllSchools = {
    'spec': {
        description: "List all schools",
        path: "/school/list",
        method: "GET",
        summary: "List all schools",
        notes: "Returns a list of all schools",
        type: "School",
        nickname: "getAllSchools",
        produces: ["application/json"],
        parameters: [],
        responseMessages: [swe.invalid('schools'), swe.notFound('schools')]
    },
    'action': function(req, res) {
        School.model.find(function(err, schools) {
            if (err) return next(swe.invalid('schools'))

            if (schools) {
                res.send(schools);
            } else {
                res.send(404, swe.notFound('schools'));
            }
            ;
        });
    }
};


/**
* Get record by ID methods
*/
exports.getSchoolById = {
    'spec': {
        description: "Operations about schools",
        path: "/school/{schoolId}",
        method: "GET",
        summary: "Find school by ID",
        notes: "Returns a school based on ID",
        type: "School",
        nickname: "getSchoolById",
        produces: ["application/json"],
        parameters: [param.path("schoolId", "ID of the school to return", "string")],
        responseMessages: [swe.invalid('id'), swe.notFound('school')]
    },
    'action': function(req, res) {
        School.model.findOne({
            _id: req.params.schoolId
        }, function(err, school) {
                if (err) return res.send(404, {
                        error: 'invalid id'
                    });

                if (school) {
                    res.send(school);
                } else {
                    res.send(404, new Error('school not found'));
                }
            });
    }
};



/**
* Add/create methods
*/
exports.addSchool = {
    'spec': {
        path: "/school",
        notes: "Adds a new school",
        summary: "Add a new school",
        method: "POST",
        parameters: [param.body("School name", "JSON object representing the school to add", "School")],
        responseMessages: [swe.invalid('input')],
        nickname: "addSchool"
    },
    'action': function(req, res, next) {
        var body = req.body;
        if (!body || !body.name) {
            throw swe.invalid('school name');
        } else {
            // Create the new document (database will be updated automatically)
            School.model.create({
                name: body.name
            }, function(err, name) {
                    if (err) return res.send(500, {
                            error: err
                        });

                    if (name) {
                        res.send(name);
                    } else {
                        res.send(500, {
                            error: 'school not added'
                        });
                    }
                    ;
                });
        }
    }
};


/**
* Update methods
*/
exports.updateSchool = {
    'spec': {
        path: "/school",
        notes: "Update an existing school",
        summary: "Update an existing school",
        method: "PUT",
        //parameters : [param.body("School ID", "School ID to update", "School"), param.body("School name", "New school name", "School")],
        parameters: [
            param.query("id", "School ID to update", "string", true),
            param.query("name", "New school name to use", "string", true)
        ],
        responseMessages: [swe.invalid('input')],
        type: "School",
        nickname: "updateSchool"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if (!query || !query.id) {
            throw swe.invalid('school id');
        } else if (!query || !query.name) {
            throw swe.invalid('school name');
        } else {
            // Update an existing document (database will be updated automatically)
            School.model.update({
                _id: query.id
            }, {
                    name: query.name
                }, function(err, numRowsAffected, raw) {
                    if (err) return res.send(500, {
                            error: err
                        });

                    if (numRowsAffected > 0) {
                        res.send(raw);
                    } else {
                        res.send(500, {
                            error: 'school not updated'
                        });
                    }
                    ;
                });
        }
    }
};


/**
* Delete methods
*/
exports.deleteSchool = {
    'spec': {
        path: "/school",
        notes: "Delete an existing school",
        summary: "Delete an existing school",
        method: "DELETE",
        parameters: [
            param.query("id", "School ID to delete", "string", true)
        ],
        responseMessages: [swe.invalid('input')],
        type: "School",
        nickname: "updateSchool"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if (!query || !query.id) {
            throw swe.invalid('school id');
        } else {
            // Delete an existing document (database will be updated automatically)
            School.model.remove({
                _id: query.id
            }, function(err) {
                    if (err) return res.send(500, {
                            error: err
                        });

                    res.send(200, {
                        'msg': 'ok'
                    });
                });
        }
    }
};

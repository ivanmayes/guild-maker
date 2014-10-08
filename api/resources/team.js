var sw = require("../Common/node/swagger.js"),
    param = require("../Common/node/paramTypes.js"),
    swe = sw.errors,
    Team = require('../models/team.js');

/**
* List methods
*/
exports.getAllTeams = {
    'spec': {
        description: "List all teams",
        path: "/team/list",
        method: "GET",
        summary: "List all teams",
        notes: "Returns a list of all teams",
        type: "Team",
        nickname: "getAllTeams",
        produces: ["application/json"],
        parameters: [],
        responseMessages: [swe.invalid('teams'), swe.notFound('teams')]
    },
    'action': function(req, res) {
        Team.model.find(function(err, teams) {
            if (err) return next(swe.invalid('teams'))

            if (teams) {
                res.send(teams);
            } else {
                res.send(404, swe.notFound('teams'));
            }
            ;
        });
    }
};


/**
* Get record by ID methods
*/
exports.getTeamById = {
    'spec': {
        description: "Operations about teams",
        path: "/team/{teamId}",
        method: "GET",
        summary: "Find team by ID",
        notes: "Returns a team based on ID",
        type: "Team",
        nickname: "getTeamById",
        produces: ["application/json"],
        parameters: [param.path("teamId", "ID of the team to return", "string")],
        responseMessages: [swe.invalid('id'), swe.notFound('team')]
    },
    'action': function(req, res) {
        Team.model.findOne({
            _id: req.params.teamId
        }, function(err, team) {
                if (err) return res.send(404, {
                        error: 'invalid id'
                    });

                if (team) {
                    res.send(team);
                } else {
                    res.send(404, new Error('team not found'));
                }
            });
    }
};



/**
* Add/create methods
*/
exports.addTeam = {
    'spec': {
        path: "/team",
        notes: "Adds a new team",
        summary: "Add a new team",
        method: "POST",
        parameters: [param.body("Team name", "JSON object representing the team to add", "Team")],
        responseMessages: [swe.invalid('input')],
        nickname: "addTeam"
    },
    'action': function(req, res, next) {
        var body = req.body;
        if (!body || !body.name) {
            throw swe.invalid('team name');
        } else {
            // Create the new document (database will be updated automatically)
            Team.model.create({
                name: body.name
            }, function(err, name) {
                    if (err) return res.send(500, {
                            error: err
                        });

                    if (name) {
                        res.send(name);
                    } else {
                        res.send(500, {
                            error: 'team not added'
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
exports.updateTeam = {
    'spec': {
        path: "/team",
        notes: "Update an existing team",
        summary: "Update an existing team",
        method: "PUT",
        //parameters : [param.body("Team ID", "Team ID to update", "Team"), param.body("Team name", "New team name", "Team")],
        parameters: [
            param.query("id", "Team ID to update", "string", true),
            param.query("name", "New team name to use", "string", true)
        ],
        responseMessages: [swe.invalid('input')],
        type: "Team",
        nickname: "updateTeam"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if (!query || !query.id) {
            throw swe.invalid('team id');
        } else if (!query || !query.name) {
            throw swe.invalid('team name');
        } else {
            // Update an existing document (database will be updated automatically)
            Team.model.update({
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
                            error: 'team not updated'
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
exports.deleteTeam = {
    'spec': {
        path: "/team",
        notes: "Delete an existing team",
        summary: "Delete an existing team",
        method: "DELETE",
        parameters: [
            param.query("id", "Team ID to delete", "string", true)
        ],
        responseMessages: [swe.invalid('input')],
        type: "Team",
        nickname: "updateTeam"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if (!query || !query.id) {
            throw swe.invalid('team id');
        } else {
            // Delete an existing document (database will be updated automatically)
            Team.model.remove({
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

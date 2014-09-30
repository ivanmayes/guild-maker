var sw = require("../Common/node/swagger.js"),
    param = require("../Common/node/paramTypes.js"),
    swe = sw.errors,
    Player = require('../models/player.js');

/**
* List methods
*/
exports.getAllPlayers = {
    'spec': {
        description: "List all players",
        path: "/player/list",
        method: "GET",
        summary: "List all players",
        notes: "Returns a list of all players",
        type: "Player",
        nickname: "getAllPlayers",
        produces: ["application/json"],
        parameters: [],
        responseMessages: [swe.invalid('players'), swe.notFound('players')]
    },
    'action': function(req, res) {
        Player.model.find(function(err, players) {
            if (err) return next(swe.invalid('players'))

            if (players) {
                res.send(players);
            } else {
                res.send(404, swe.notFound('players'));
            }
            ;
        });
    }
};


/**
* Get record by ID methods
*/
exports.getPlayerById = {
    'spec': {
        description: "Operations about players",
        path: "/player/{playerId}",
        method: "GET",
        summary: "Find player by ID",
        notes: "Returns a player based on ID",
        type: "Player",
        nickname: "getPlayerById",
        produces: ["application/json"],
        parameters: [param.path("playerId", "ID of the player to return", "string")],
        responseMessages: [swe.invalid('id'), swe.notFound('player')]
    },
    'action': function(req, res) {
        Player.model.findOne({
            _id: req.params.playerId
        }, function(err, player) {
                if (err) return res.send(404, {
                        error: 'invalid id'
                    });

                if (player) {
                    res.send(player);
                } else {
                    res.send(404, new Error('player not found'));
                }
            });
    }
};



/**
* Add/create methods
*/
exports.addPlayer = {
    'spec': {
        path: "/player",
        notes: "Adds a new player",
        summary: "Add a new player",
        method: "POST",
        parameters: [param.body("Player name", "JSON object representing the player to add", "Player")],
        responseMessages: [swe.invalid('input')],
        nickname: "addPlayer"
    },
    'action': function(req, res, next) {
        var body = req.body;
        if (!body || !body.name) {
            throw swe.invalid('player name');
        } else {
            // Create the new document (database will be updated automatically)
            Player.model.create({
                name: body.name
            }, function(err, name) {
                    if (err) return res.send(500, {
                            error: err
                        });

                    if (name) {
                        res.send(name);
                    } else {
                        res.send(500, {
                            error: 'player not added'
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
exports.updatePlayer = {
    'spec': {
        path: "/player",
        notes: "Update an existing player",
        summary: "Update an existing player",
        method: "PUT",
        //parameters : [param.body("Player ID", "Player ID to update", "Player"), param.body("Player name", "New player name", "Player")],
        parameters: [
            param.query("id", "Player ID to update", "string", true),
            param.query("name", "New player name to use", "string", true)
        ],
        responseMessages: [swe.invalid('input')],
        type: "Player",
        nickname: "updatePlayer"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if (!query || !query.id) {
            throw swe.invalid('player id');
        } else if (!query || !query.name) {
            throw swe.invalid('player name');
        } else {
            // Update an existing document (database will be updated automatically)
            Player.model.update({
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
                            error: 'player not updated'
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
exports.deletePlayer = {
    'spec': {
        path: "/player",
        notes: "Delete an existing player",
        summary: "Delete an existing player",
        method: "DELETE",
        parameters: [
            param.query("id", "Player ID to delete", "string", true)
        ],
        responseMessages: [swe.invalid('input')],
        type: "Player",
        nickname: "updatePlayer"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if (!query || !query.id) {
            throw swe.invalid('player id');
        } else {
            // Delete an existing document (database will be updated automatically)
            Player.model.remove({
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

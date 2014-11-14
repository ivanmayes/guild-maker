var sw = require("../Common/node/swagger.js"),
    param = require("../Common/node/paramTypes.js"),
    swe = sw.errors,
    Event = require('../models/event.js');

/**
* List methods
*/
exports.getAllEvents = {
    'spec': {
        description: "List all events",
        path: "/event/list",
        method: "GET",
        summary: "List all events",
        notes: "Returns a list of all events",
        type: "Event",
        nickname: "getAllEvents",
        produces: ["application/json"],
        parameters: [],
        responseMessages: [swe.invalid('events'), swe.notFound('events')]
    },
    'action': function(req, res) {
        Event.model.find(function(err, events) {
            if (err) return next(swe.invalid('events'))

            if (events) {
                res.send(events);
            } else {
                res.send(404, swe.notFound('events'));
            }
            ;
        });
    }
};


/**
* Get record by ID methods
*/
exports.getEventById = {
    'spec': {
        description: "Operations about events",
        path: "/event/{eventId}",
        method: "GET",
        summary: "Find event by ID",
        notes: "Returns a event based on ID",
        type: "Event",
        nickname: "getEventById",
        produces: ["application/json"],
        parameters: [param.path("eventId", "ID of the event to return", "string")],
        responseMessages: [swe.invalid('id'), swe.notFound('event')]
    },
    'action': function(req, res) {
        Event.model.findOne({
            _id: req.params.eventId
        }, function(err, event) {
                if (err) return res.send(404, {
                        error: 'invalid id'
                    });

                if (event) {
                    res.send(event);
                } else {
                    res.send(404, new Error('event not found'));
                }
            });
    }
};



/**
* Add/create methods
*/
exports.addEvent = {
    'spec': {
        path: "/event",
        notes: "Adds a new event",
        summary: "Add a new event",
        method: "POST",
        parameters: [param.body("Event name", "JSON object representing the event to add", "Event")],
        responseMessages: [swe.invalid('input')],
        nickname: "addEvent"
    },
    'action': function(req, res, next) {
        var body = req.body;
        if (!body || !body.name) {
            throw swe.invalid('event name');
        } else {
            // Create the new document (database will be updated automatically)
            Event.model.create({
                name: body.name
            }, function(err, name) {
                    if (err) return res.send(500, {
                            error: err
                        });

                    if (name) {
                        res.send(name);
                    } else {
                        res.send(500, {
                            error: 'event not added'
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
exports.updateEvent = {
    'spec': {
        path: "/event",
        notes: "Update an existing event",
        summary: "Update an existing event",
        method: "PUT",
        //parameters : [param.body("Event ID", "Event ID to update", "Event"), param.body("Event name", "New event name", "Event")],
        parameters: [
            param.query("id", "Event ID to update", "string", true),
            param.query("name", "New event name to use", "string", true)
        ],
        responseMessages: [swe.invalid('input')],
        type: "Event",
        nickname: "updateEvent"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if (!query || !query.id) {
            throw swe.invalid('event id');
        } else if (!query || !query.name) {
            throw swe.invalid('event name');
        } else {
            // Update an existing document (database will be updated automatically)
            Event.model.update({
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
                            error: 'event not updated'
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
exports.deleteEvent = {
    'spec': {
        path: "/event",
        notes: "Delete an existing event",
        summary: "Delete an existing event",
        method: "DELETE",
        parameters: [
            param.query("id", "Event ID to delete", "string", true)
        ],
        responseMessages: [swe.invalid('input')],
        type: "Event",
        nickname: "updateEvent"
    },
    'action': function(req, res, next) {
        var query = req.query;
        if (!query || !query.id) {
            throw swe.invalid('event id');
        } else {
            // Delete an existing document (database will be updated automatically)
            Event.model.remove({
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

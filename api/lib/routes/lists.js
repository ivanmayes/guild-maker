
'use strict';

var Envelope = require('../envelope'),
    routeUtils = require('../route-utils'),
    List = require('../models/list'),
    envelope;


exports = module.exports = function ListRoutes(auth, router) {

    // get list of all schools
    router.get('/lists', auth.requireUser, function(req, res, next) {
        envelope = new Envelope();

        List.findAsync({})
            .then(function(lists) {
                envelope.success(200, lists);
                res.json(envelope);
                return;
            })
            .catch(function(err) {
                envelope.error(500, {
                    'details': 'The server returned an error finding all lists.',
                    'append': true
                });
                res.json(envelope);
                return;
            });
    });

    router.get('/lists/search', function(req, res, next) {
        var keys, query;

        envelope = new Envelope();

        // cache members of model.
        keys = routeUtils.findModelMembers(List);

        //console.log('Keys', keys);

        // obtain query schema
        query = routeUtils.getSearchQuery({
            'keys': keys,
            'query': req.query
        });

        console.log('query', query);

        if (!query) {
            // after parsing, no valid query present...
            // send error envelope and bail
            envelope.error(400, {
                'details': 'Missing search parameters.',
                'append': true
            });
            res.json(envelope);
            return;
        }

        List
            .findAsync(query)
            .then(function(lists) {
                envelope.success(200, lists);
                res.json(envelope);
                return;
            })
            .catch(function(err) {
                envelope.error(500, {
                    'details': 'The server returned an error finding lists matching supplied arguments.',
                    'append': true
                });
                res.json(envelope);
                return;
            });
        return;
    });

    router.post('/lists/add', auth.requireUser, function(req, res, next) {
        var userId = req.body.userId,
            Name = req.body.Name,
            Plants = req.body.Plants,
            envelope = new Envelope();

        if (!Plants) {
            Plants = [];
        }

        if (!userId) {
            // no userId present, return error envelope
            console.log(userId);
            envelope.error(400, {
                'details': 'Missing User Id.',
                'append': true
            });
            res.json(envelope);
            return;
        }

        if (!Name) {
            // no Name present, return error envelope
            envelope.error(400, {
                'details': 'Missing List Id.',
                'append': true
            });
            res.json(envelope);
            return;
        }

        List.createAsync({
            'User': userId,
            'Name': Name,
            'Plants': Plants,
            'DateCreated': new Date(),
            'DateModified': new Date()
        })
            .then(function(list) {
                envelope.success(200, list);
                res.json(envelope);
                return;
            })
            .catch(function(err) {
                envelope.error(500, {
                    'details': 'The server returned an error trying to add a list.',
                    'append': true
                });
                res.json(envelope);
                return;
            });
    });


    router.post('/lists/update', auth.requireUser, function(req, res) {
        var listId = req.body.listId,
            userId = req.body.userId ,
            Name = req.body.Name,
            Plants = req.body.Plants,
            user = req.user,
            queryObj = {},
            valid;

        envelope = new Envelope();

        if (!listId) {
            envelope.error(400, {
                'details': 'Missing List Id.',
                'append': true
            });
            res.json(envelope);
            return;
        }

        // Make sure the list is for this user
        // TODO: Add userId: user._id when we get access tokens working
        List.findOneAsync({
            '_id': listId
        })
            .then(function(list) {

                if (!list) {
                    envelope.error(400, {
                        'details': 'Cannot find list with that id.',
                        'append': true
                    });

                    res.json(envelope);
                    return;
                }

                if(String(list.User) !== String(user._id)) {
                    envelope.error(400, {
                        'details': 'The user doesnt have permission to update this list.',
                        'append': true
                    });

                    res.json(envelope);
                    return;
                }

                // append username to query object
                if (Name) {
                    queryObj.Name = Name;
                }

                // append firstName to query object
                if (Plants) {
                    queryObj.Plants = Plants;
                }

                if (Object.getOwnPropertyNames(queryObj).length === 0) {
                    // after parsing, no valid query present...
                    // send error envelope and bail
                    envelope.error(400, {
                        'details': 'Missing update parameters.',
                        'append': true
                    });
                    res.json(envelope);
                    return;
                }

                List.updateAsync(
                    {
                        '_id': listId
                    },
                    queryObj
                    )
                    .spread(function(numAffected, response) {
                        var updatedExisting = response.updatedExisting || '';

                        if (updatedExisting === '') {
                            updatedExisting = false;
                        }

                        if (
                        (updatedExisting) &&
                            (numAffected > 0)
                        ) {
                            List.findOne({
                                '_id': listId
                            })
                                .populate('Plants')
                                .exec(function(err, list) {
                                    envelope.success(200, list);
                                    res.json(envelope);
                                    return;
                                })
                        } else {
                            envelope.error(500, {
                                'details': 'No Lists updated.'
                            });
                            res.json(envelope);
                            return;
                        }


                    })
                    /*.then(function(list) {
                        envelope.success(200, list);
                        return res.json(envelope);
                    })*/
                    .catch(function(err) {
                        envelope.error(500, {
                            'details': 'The server returned an error updating list with supplied arguments.'
                        });
                        res.json(envelope);
                        return;
                    });

            })
            // Bad id
            .catch(function(err) {
                envelope.error(500, {
                    'details': 'The id supplied was malformed.'
                });
                res.json(envelope);
                return;
            });

    });



    router.get('/lists/:listId', function(req, res, next) {
        var listId = req.params.listId;
        envelope = new Envelope();

        if (!listId) {
            // no listId present, return error envelope
            envelope.error(400, {
                'details': 'Missing List Id.',
                'append': true
            });
            res.json(envelope);
            return;
        }

        // TODO: Figure out how to run populate with bluebird
        List.findOne({
            '_id': listId
        })
            .populate('Plants')
            .exec(function(err, list) {
                if (err) {
                    envelope.error(500, {
                        'details': 'The server returned an error finding a list matching supplied id.',
                        'append': true
                    });
                    res.json(envelope);
                    return;
                }

                envelope.success(200, list);
                res.json(envelope);
                return;
            })
    });

    
    router.del('/lists/:listId', auth.requireUser, function(req, res, next) {
        var listId = req.params.listId,
            user = req.user;

        envelope = new Envelope();

        if (!listId) {
            // no listId present, return error envelope
            envelope.error(400, {
                'details': 'Missing List Id.',
                'append': true
            });
            res.json(envelope);
            return;
        }

        List.findOneAsync({
            '_id': listId
        })
        .then(function(list) {
            if (!list) {
                envelope.error(400, {
                    'details': 'Cannot find list with that id.',
                    'append': true
                });

                res.json(envelope);
                return;
            }

            if(String(list.User) !== String(user._id)) {
                envelope.error(400, {
                    'details': 'The user doesnt have permission to update this list.',
                    'append': true
                });

                res.json(envelope);
                return;
            }

            List.remove({ _id: listId }, function(err) {
                if (!err) {
                        envelope.success(200, true);
                        res.json(envelope);
                        return;
                }
                else {
                        envelope.error(400, {
                            'details': 'There was an error removing the list',
                            'append': true
                        });
                        res.json(envelope);
                        return;
                }
            });


        })
        // Bad id
        .catch(function(err) {
            envelope.error(500, {
                'details': 'The id supplied was malformed.'
            });
            res.json(envelope);
            return;
        });

       
    });

};

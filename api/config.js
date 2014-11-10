
module.exports = exports = {

    db: {
        uri: process.env.MONGODB ||
             process.env.MONGORILLA_MONGO_URL ||
             process.env.MONGOLAB_URI ||
             process.env.MONGOHQ_URL ||
             'mongodb://localhost/nlmg'
    }

};


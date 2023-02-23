/** */
const models = require('./../models');
const TheSystem = models('System');

module.exports = {
    getTimeRemainingForNextLaunch: (req, res, next) => {

    },
    getTimer: (req, res, next) => {
        TheSystem.findOne({ id: 1 }).
            exec((err, thesys) => {
                if (err) {
                    res.sendStatus(err);
                    console.log("thesys ctrl " + err);
                }
                else if (!thesys) {
                    res.sendStatus(404);
                    console.log("thesys ctrl !thesys " + 404);
                }
                else {
                    res.send(thesys.timer);
                    console.log("thesys ctrl OK " + thesys.timer);
                }
                next()
            })
    },
    setTimer: (req, res, next) => {
        Pool.findOneAndUpdate({ id: 1 }, { timer: newtimer }, function (err, doc) {
            if (err) {
                console.log("error setTimer :  " + err);
                return res.send(500, { error: err });
            }
            else if (!doc)
                res.send(404);
            else {
                console.log("success setTimer   ");
                return res.send("succesfully saved");
            }
            next()
        });
    },
    getAllPoolFailed: (req, res, next) => {

    },
    getPoolFailedFromDate: (req, res, next) => {

    },
    getAllPoolSuccessfull: (req, res, next) => {

    },
    getPoolSuccessfullFromDate: (req, res, next) => {

    },
}
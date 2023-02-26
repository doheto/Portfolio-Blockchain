/** */
const User = require('./../models/User');

module.exports = {
    addUser: (req, res, next) => {
        new User(req.body).save((err, newUser) => {
            if (err)
                res.send(err)
            else if (!newUser)
                res.send(400)
            else
                res.send(newUser)
            next()
        });
    },
    deleteUser: (req, res, next) => {
        var myquery = { "_id": req.params.id };
        User.deleteOne(myquery, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
        });
    },
    getAll: (req, res, next) => {
        User.find(function (err, result){ 
            if (err) 
                res.send(err);
            else if (!result)
                res.send(404);
            else
                res.send(result);
            next() 
                //res.json(result);
        });
        
        // User.find(req.params.id)
        // .populate('personalwallets')
        // .populate('affiliatedfamilies')
        // .populate('parrainoffamilies')
        // .exec((err, user)=> {
        //     if (err)
        //         res.send(err)
        //     else if (!user)
        //         res.send(404)
        //     else
        //         res.send(user)
        //     next()            
        // })
    },
    getUser: (req, res, next) => {
        User.findOne({email:req.params.mail}).populate('personalwallets').exec((err, user)=> {
            if (err)
                res.send(err)
            else if (!user)
                res.send(404)
            else
                res.send(user)
            next()            
        })
    }
}//AnAddress  personalwallets
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

//Service de récupération de tout les users
module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

//Service de récupération d'un seul user
module.exports.usersInfo = (req, res) => {
    //On vérifie si l'ID est valide
    if (!ObjectID.isValid(req.params.id))
        //Alors ont renvoi un status 400 en précisant que l'ont ne connais pas l'ID
        return res.status(400).send('ID unknown :' + req.params.id)
    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID Unknow: ' + err)
        //Ici on précise que l'ont ne souhaite pas renvoyer le password
    }).select('-password');
};

//Service de suppresion d'user
module.exports.deleteUser = async (req, res) => {
    //On vérifie si l'ID est valide
    if (!ObjectID.isValid(req.params.id))
        //Alors ont renvoi un status 400 en précisant que l'ont ne connais pas l'ID
        return res.status(400).send('Id renseigné inconnu' + req.params.id)

    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Utilisateur supprimé !" });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}
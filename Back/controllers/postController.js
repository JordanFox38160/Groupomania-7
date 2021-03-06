const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

//Ici on gére la récupération de TOUT les post
module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        //Si il n'y pas d'erreur, alors on renvoie la data (docs)
        if (!err) res.send(docs);
        else console.log('Error to get data' + err);
        //Ici on utilise.sort pour pouvoir afficher le dernier message en 1er
    }).sort({ createdAt: -1 });

};

//Service de récupération des post d'un seul user
module.exports.readOnePost = (req, res) => {
    //On vérifie si l'ID est valide
    if (!ObjectID.isValid(req.params.id))
        //Alors ont renvoi un status 400 en précisant que l'ont ne connais pas l'ID
        return res.status(400).send('ID unknown :' + req.params.id)
    PostModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID Unknow: ' + err)
        //Ici on précise que l'ont ne souhaite pas renvoyer le password
    })
};

//Service de récupération des post d'un seul user
module.exports.readAllPostUser = (req, res) => {
    //On vérifie si l'ID est valide
    if (!ObjectID.isValid(req.params.id))
        //Alors ont renvoi un status 400 en précisant que l'ont ne connais pas l'ID
        return res.status(400).send('ID unknown :' + req.params.id)
    PostModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID Unknow: ' + err)
        //Ici on précise que l'ont ne souhaite pas renvoyer le password
    })
};

//Ici on gére la création d'un post
module.exports.createPost = async (req, res) => {
    const newPost = new PostModel({
        userId: req.body.userId,
        pseudo: req.body.pseudo,
        message: req.body.message,
        title: req.body.title,
        likers: [],
        comments: [],
        // picutre: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    //Ici on incrémente notre data dans notre base de donnée mongoDB
    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err)
    }
}

//Ici on gére la mise a jour d'un post
module.exports.updatePost = (req, res) => {
    //On vérifie si l'ID est valide
    if (!ObjectID.isValid(req.params.id))
        //Alors ont renvoi un status 400 en précisant que l'ont ne connais pas l'ID
        return res.status(400).send('ID unknown :' + req.params.id);

    const updatedRecord = {
        title: req.body.title,
        message: req.body.message
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Update error:" + err)
        }
    )
}

//Ici on gére la suppresion d'un post
module.exports.deletePost = (req, res) => {
    //On vérifie si l'ID est valide
    if (!ObjectID.isValid(req.params.id))
        //Alors ont renvoi un status 400 en précisant que l'ont ne connais pas l'ID
        return res.status(400).send('ID unknown :' + req.params.id);

    PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) res.send(docs)
        else console.log("Delete error" + err);
    });
};

//Ici on gère l'ajout d'un commentaire
module.exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime(),
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

//Ici on gère la modification d'un commentaire
module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findById(req.params.id, (err, docs) => {
            const theComment = docs.comments.find((comment) =>
                comment._id.equals(req.body.commentId)
            );

            if (!theComment) return res.status(404).send("Comment not found");
            theComment.text = req.body.text;

            return docs.save((err) => {
                if (!err) return res.status(200).send(docs);
                return res.status(500).send(err);
            });
        });
    } catch (err) {
        return res.status(400).send(err);
    }
};

//Ici on gère la suppression d'un commentaire
module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};
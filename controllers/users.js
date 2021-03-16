const mongoose = require("mongoose")
const User = mongoose.model("User")
const passport = require('passport');

function createUser(req, res, next) {
  // Instanciaremos un nuevo usuario utilizando la clase usuario
  const body = req.body,
    password = body.password

  delete body.password
  const user = new User(body)
  user.createPassword(password)
  user.save().then(user => {                                         //Guardando nuevo usuario en MongoDB.
    return res.status(201).json(user.toAuthJSON())
  }).catch(next)
}

function getUsers(req, res, next) {                              //Obteniendo usuario desde MongoDB.
  if(req.params.id){
    User.findById(req.params.id, (err, user) => {
      if (!user || err) {
        return res.sendStatus(401)
      }
      return res.json(user.publicData());
    }).catch(next);
  } else {
    User.find().then(users=>{
      users = users.map(u => u.publicData())
      res.send(users)
    }).catch(next)
  }
}

function updateUser(req, res, next) {
  console.log(req.user)
  User.findById(req.user.id).then(user => {
    if (!user) { return res.sendStatus(401); }
    let newInfo = req.body
    if (typeof newInfo.username !== 'undefined')
      user.username = newInfo.username
    if (typeof newInfo.bio !== 'undefined')
      user.bio = newInfo.bio
    if (typeof newInfo.picture !== 'undefined')
      user.picture = newInfo.picture
    if (typeof newInfo.phone !== 'undefined')
      user.phone = newInfo.phone
    if (typeof newInfo.savedCollections !== 'undefined')
      user.savedCollections = newInfo.savedCollections
    if (typeof newInfo.password !== 'undefined')
      user.createPassword(newInfo.password)
    user.save().then(updatedUser => {                                   //Guardando usuario modificado en MongoDB.
      res.status(201).json(updatedUser.publicData())
    }).catch(next)
  }).catch(next)
}

function deleteUser(req, res) {
  // únicamente borra a su propio usuario obteniendo el id del token
  User.findOneAndDelete({ _id: req.user.id }).then(r => {         //Buscando y eliminando usuario en MongoDB.
    res.status(200).send(`User ${req.params.id} deleted: ${r}`);
  })
}

function logIn(req, res, next) {
  if (!req.body.email) {
    return res.status(422).json({ errors: { email: "Email can not be empty." } });
  }

  if (!req.body.password) {
    return res.status(422).json({ errors: { password: "Password can not be empty." } });
  }

  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      user.token = user.generarJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
}

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  logIn
}
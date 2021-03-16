const passport = require('passport');                       //Importando passport, middleware para autenticación.
const LocalStrategy = require('passport-local').Strategy;   //Importando estrategia autenticación. --> passport-local
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy({                            //Configurando elementos utilizados para habilitar sesión.
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    User.findOne({ email: email }).then(function (user) {
    if (!user || !user.validarPassword(password)) {
        return done(null, false, { errors: { 'User or password': 'Wrong' } });
    }
        return done(null, user);
    }).catch(done);
}));
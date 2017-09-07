var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// 'username' and 'password' are automatically provided by 'passport-local-mongoose module'
// even not defined here.  Instructor did it explicitly for teaching putpose.
var userSchema = new Schema({
    username: String,
    password: String,
    OauthId: String,
    OauthToken: String,    
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

//instance method
userSchema.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname);
};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema, 'users');
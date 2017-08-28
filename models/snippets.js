const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/codeSnippets");

const snippetsSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, required: true },
  title: {
    type: String, unique: true, lowercase: true, required: true },
  code: { type: String, required: true},
  notes: String,
  language: {type: String, required: true},
  tags: [String]
});
//
// snippetsSchema.virtual('password')
//     .get(function() {
//         return null
//     })
//     .set(function(value) {
//         const hash = bcrypt.hashSync(value, 8);
//         this.passwordHash = hash;
//     })
//
// snippetsSchema.methods.authenticate = function (password) {
//   return bcrypt.compareSync(password, this.passwordHash);
// }
//
// snippetsSchema.statics.authenticate = function(username, password, done) {
//     this.findOne({
//         username: username
//     }, function(err, user) {
//         if (err) {
//             done(err, false)
//         } else if (user && user.authenticate(password)) {
//             done(null, user)
//         } else {
//             done(null, false)
//         }
//     })
// };

const Snippet = mongoose.model("snippets", snippetsSchema);

module.exports = Snippet;

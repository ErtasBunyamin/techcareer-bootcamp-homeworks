const mongoose = require('mongoose');
const { Schema } = mongoose;

const link = "mongodb+srv://databaseUser:9xLszVfMqeRbwYrW@mycluster.lhqxr.mongodb.net/techcareerMusic";

mongoose.connect(link).catch(err => {
    console.log("Connection Error: "+ err);
});

const webUserShema = new Schema({
    name: String,
    surName: String,
    email: String,
    address: String,
});

const webUserModel = mongoose.model('WebUser', webUserShema);

var webUser = new webUserModel({
    name: "Bunyamin",
    surName: "Ertas",
    email: "ertas@mail.com",
    address: "adersda 21 apt",
});

webUser.save();
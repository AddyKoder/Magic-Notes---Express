// Importing and connecting mongoose
const mongoose = require('mongoose');
params = {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect('mongodb+srv://androplayboy:mongodbcluster15!is!pass@cluster0.lfawf.mongodb.net/notes', params)

// Importing the User Schema
user = require('../schema/userSchema')

async function createUser(name, phone, mail, password){
    let docs = await user.findOne({phone}).catch(e => {throw new Error('Error fetching Database: ' + e.message)})
    let docs2 = await user.findOne({mail}).catch(e => {throw new Error('Error fetching Database: ' + e.message)})
    if (!docs && !docs2){
        let newUser = new user({name, phone, mail, password})
        await newUser.save().catch(e => {throw new Error('Error Saving to Database: ' + e.message)})
        return 'Created user successfully'
    }
    else throw new Error('Either Email address or contact number already exists in the database')

}

async function verifyUser(mail, password){
    let docs = await user.findOne({mail}).catch(e => {throw new Error('Error fetching Database: ' + e.message)})
    if (docs){
        if (password === docs.password){
            return docs.name;
        }
        else throw new Error('Wrong password')
    }
    else throw new Error('Email does not exist in the database')

}

async function getNotes(mail){
    let doc = await user.findOne({mail}).catch(e => {throw new Error('Error fetching Database: ' + e.message)})
    return doc.notes;
}

async function setNotes(mail, notes){
    let doc = await user.findOne({mail}).catch(e => {throw new Error('Error fetching Database: ' + e.message)})
    doc.notes = notes;
    await doc.save();
    return true;
}

async function getInfo(mail){
    let doc = await user.findOne({mail}).catch(e => {throw new Error('Error fetching Database: ' + e.message)})
    username = doc.name;
    phone = doc.phone;
    mail = doc.mail;
    return {name:username,phone,mail}
}

module.exports = {createUser, verifyUser, getNotes, setNotes, getInfo}
const mongoose = require('mongoose')

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://giapdn:yX7nmCFRjy9jwVpX@cluster0.fzo5ktp.mongodb.net/expressJs?retryWrites=true&w=majority&appName=Cluster0", {})
        console.log('Success !')
    } catch (error) {
        console.log('Failed !')
        process.exit(1)
    }
}

module.exports = { connectToDatabase }
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

//Model
const { User } = require('./models/User.js')
const { conectToDatabase } = require('./config/mongo.js')
const Exercise = require('./models/Exercise.js')

//Globel middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

//Routing
app
  .get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
  })
  .post("/api/users", async (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.json({
        error: "Username must be fill"
      })
    }
    try {
      const newUser = new User({
        username: username
      })
      await conectToDatabase();
      const user = await newUser.save()
      res.json({
        _id: user._id,
        username: user.username
      })
    } finally {
      mongoose.disconnect()
        .then(console.log('closed connect'))
    }
  })
  .get("/api/users", async (req, res) => {
    try {
      await conectToDatabase();
      const users = await User.find({});
      const switchtoArray = users.map((user) => ({
        _id: user._id.toString(),
        username: user.username
      }))
      res.send(switchtoArray)
    } catch (error) {
      return res.json({ error: "failed" })
    } finally {
      mongoose.disconnect().then(console.log('closed connect'))
    }
  })
  .post("/api/users/:_id/exercises", async (req, res) => {
    const userId = req.params._id;
    const { description, duration, date } = req.body
    let finalDate;
    if (!date) finalDate = new Date().toDateString()
    else finalDate = new Date(date).toDateString()
    try {
      await conectToDatabase()
      const user = await User.findById(userId)
      const newExercise = new Exercise({
        username: user.username,
        description: description,
        duration: Number(duration),
        date: finalDate
      })
      const exercise = await newExercise.save()

      const final = {
        _id: userId,
        username: exercise.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date
      }
      res.json(final)
    } catch (error) {
      console.log(error)
      res.json({ error: 'not ok' })
    } finally {
      mongoose.disconnect().then('closed connect')
    }


  })

//Server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

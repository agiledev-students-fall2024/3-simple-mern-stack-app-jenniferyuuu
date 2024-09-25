require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to fetch 'about me' content 
app.get('/about', async (req, res) => {
  // load all text
  try {
    const info = ["Hello, my name is Jennifer Yu. I am currently a junior at NYU who is \
    majoring in computer science and minoring in web programming and applications. \
    I chose to pursue in computer science because I was interested in coding after \
    taking a computer science class in high school. At that time, I realized how a few \
    simple lines of code can create something amazing and how problem-solving was crucial \
    to this field. Since I enjoy creating applications, I joined the Agile Software \
    Development & DevOps class. From this experience, I would like to gain new software development \
    skills and create a piece of work that I am proud of.", 
    
    "Some hobbies that I have are traveling, cooking, playing games (both video and board games), and listening to music. \
    I particularly like traveling because it is fascinating to visit countries and cities I have never been before while \
    trying new food and experiencing different cultures. One recent place I have visited is Vietnam (Hanoi), which had a completely \
    different atmosphere to advanced cities. I also enjoy cooking, playing games, and listening to music because they all \
    help me relax and keep my mind off any stress.", 
    
    "One interesting fact about me is that I enjoy drinking bubble tea and milk tea a lot. I have probably tried over 20 different \
    shops since I am always tempted to try a different shop when it opens. One of my favorite shops is called Teado, which is \
    located in NYC Chinatown. My bubble tea addiction explains why I also have a sweet tooth for any kind of desserts—from cake to ice cream."]
  
    res.json({
      info: info,
      image: '/jennifer.jpg',
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!

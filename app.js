const express = require('express')
const app = express()
const router = express.Router
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const { genHash } = require('./genHash.js')

const host = (process.env.MONGODB_URI) ? 'https://aqueous-plateau-67569.herokuapp.com/' : 'http://localhost:3000/'

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'dfsfsfs',
  resave: 'false',
  saveUninitialized: 'false'
}))
app.use(flash())

app.use((req,res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.warning = req.flash('warning_msg')

  next()
})

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/url-shortener', { useNewUrlParser: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('connect!')
})

const URL = require('./model/url.js')

app.get('/', (req, res) => {
  URL.find().exec((err, links) => {
    res.render('home', {links, host})
  })

})

app.post('/', (req, res) => {
  const { link } = req.body
  const errors = []

  if (link.indexOf('http://') === -1 && link.indexOf('https://') === -1) {
    errors.push({ message: '填入的網址需包含 http(s)://，請重新輸入' })
  }

  if (errors.length > 0) {
    URL.find().exec((err, links) => {
      console.log(links)
      res.render('home', {links, link, errors, host})
    })
  } else {
    URL.findOne({ link: req.body.link }, (err, url) => {
      if (err) return err

      if (!url) {
        const newURL = new URL({
          link: req.body.link,
          shortened: genHash(5)
        })
        newURL.save( err => {
          if (err) console.log(err)
          req.flash('success_msg', `縮短後網址為 ${host}${newURL.shortened}`)
          res.redirect('/')
        })
      } else {
        req.flash('error_msg', '該網址已經縮短過了，請重新輸入')
        res.redirect('/')
      }
    })
  }
})

app.get('/:shortenedUrl', (req, res) => {
  const { shortenedUrl } = req.params

  URL.findOne({ shortened: shortenedUrl}, (err, url) => {
    res.redirect(url.link)
  })
})

app.listen( process.env.PORT || 3000, () => {
  console.log(`app running`)
})

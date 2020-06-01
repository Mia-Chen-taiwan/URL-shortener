const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Url = require('./models/url')
const generateURL = require('./generateURL')
require('./config/mongoose')

const app = express()
const PORT = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  const inputURL = ''
  res.render('index')
})

// 輸入之後製造短網址，建立一筆資料，渲染結果到頁面上
app.post('/', (req, res) => {
  const inputURL = req.body.inputURL
  
  
  if (inputURL === '') { // 空白輸入
    let errMessage = "Please enter the URL!!"
    res.render('index', { errMessage, inputURL })
    return
  } else if (inputURL.includes("https://") || inputURL.includes("http://")){
    let shortenedURL = generateURL() 
    return Url.find()
    .lean()
    .then((url) => {
      url.forEach(u => {
        // 防止重複短網址出現
        while( u.shortenedURL.includes( shortenedURL )) {
          shortenedURL = generateURL()
        }
      return shortenedURL
      })
    })
    .then(() => Url.create({ originURL:inputURL, shortenedURL }))
    .then(() => res.render('show', { newURL: shortenedURL }))
    .catch(error => console.log(error))     
  } else { // 不符的輸入
    let errMessage = "This is not an URL! Please enter again </br> ( https://... OR http://... )"
    res.render('index', { errMessage, inputURL })
    return
  }

  
    
})

// 在伺服器啟動期間，使用者輸入短網址可進入原網址頁面
app.get('/:code', (req, res) => {
  const code = req.params.code
  Url.findOne({ shortenedURL: code})
    .lean()
    .then(u => {
      if (u) {
        url = u.originURL
        res.redirect(`${url}`)
      } else { // 轉跳失敗
        res.send('Error')
      } 
    })
    .catch(error => console.log(error))
})

app.listen(PORT, (req, res) => {
  console.log(`App is running on http://localhost:${PORT}`)
})
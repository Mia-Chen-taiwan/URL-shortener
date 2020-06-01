const express = require('express')
const router = express.Router()
const Url = require('../../models/url')
const generateURL = require('./generateURL')
const indexURL = 'https://boiling-shelf-65146.herokuapp.com/'

router.get('/', (req, res) => {
  const inputURL = ''
  res.render('index')
})

// 輸入之後製造短網址，建立一筆資料，渲染結果到頁面上
router.post('/', (req, res) => {
  const inputURL = req.body.inputURL
  if (inputURL === '') { // 空白輸入
    let errMessage = "Please enter the URL!!"
    res.render('index', { errMessage, inputURL })
    return
  } else if (inputURL.includes("https://") || inputURL.includes("http://")){
    // 輸入URL符合格式
    // 檢查是否已存在其短網址
    Url.findOne({ originURL: inputURL })
    .lean()
    .then(existURL => {
      if (existURL) {
        let errMessage = `Short URL existed: ${existURL.shortenedURL}`
        return res.render('index', { errMessage, inputURL })
      } else {
        // 沒有則新增一筆
        let shortenedURL = generateURL(indexURL) 
        // 防止重複短網址出現
        Url.find()
          .lean()
          .then((url) => {
            url.forEach(u => {
              while( u.shortenedURL.includes( shortenedURL )) {
                shortenedURL = generateURL(indexURL)
              }
              return shortenedURL
            })
          })
          .then(() => Url.create({ originURL:inputURL, shortenedURL }))
          .then(() => res.render('show', { newURL: shortenedURL }))
          .catch(error => console.log(error))    
        }
    })    
  } else { // 不符的輸入
    let errMessage = "This is not an URL! Please enter again."
    res.render('index', { errMessage, inputURL })
    return
  }
})
  
  // 在伺服器啟動期間，使用者輸入短網址可進入原網址頁面
router.get('/:code', (req, res) => {
  const code = req.params.code
  Url.findOne({ shortenedURL: indexURL + code})
    .lean()
    .then(u => {
      if (u) {
        url = u.originURL
        res.redirect(`${url}`)
      } else { // 轉跳失敗
        res.render('error')
      } 
    })
    .catch(error => console.log(error))
})

module.exports = router


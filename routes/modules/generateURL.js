function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function generateURL (){
  // 定義亂碼所需元素
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'

  // 建立亂碼元素collection
  let collection = lowerCaseLetters + upperCaseLetters + numbers
  collection = collection.split('')

  // 產生亂碼
  let randomCode = ''
  for (let i = 0; i < 5; i++) {
    randomCode += sample(collection)
  }

  // 輸出短網址
  return  randomCode
}

module.exports = generateURL
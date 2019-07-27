module.exports = {
  genHash: (length) => {
    const engChar = 'abcdefghijklmnopqrstuvwxyz'
    const num = '0123456789'
    const lotteryBox = engChar.toUpperCase() + engChar + num

    const getRandomChar = (length) => {
      return Math.floor(Math.random() * length) + 1
    }

    let password = ''

    while (length > 0) {
      password += lotteryBox[ getRandomChar(lotteryBox.length - 1) ]
      length--
    }
    return password
  }
}

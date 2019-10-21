const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const cool = require('cool-ascii-faces')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const nodeMailer = require('nodemailer');

express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'www')))
  .use(favicon(__dirname + '/www/favicon.ico'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .post('/contact/ali', (req, res) => {
    sendContactEmail(req.body)
    res.json({ status: 'sent' })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result
}

sendContactEmail = (param) => {
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'SMTP_GMAIL_ADDRESS',
      pass: 'SMTP_GMAIL_CREDENTIALS'
    }
  })
  const to = 'babystar6666@outlook.com'
  let mailOptions = {
    to: to,
    from: param.email,
    subject: param.subject,
    text: 'From Mr(Ms). ' + param.subscriber + '\n\n' + param.body,
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Message %s sent: %s', info.messageId, info.response)
    }
  })
}

'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

let mongoose = require('mongoose');
let mongo = require('mongodb');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
}); 


// 01 - set up database mongoose
// mongodb url here : your link
let uri = 'your link'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

// 02 - create a model
let urlSchema = new mongoose.Schema({
  original: { type: String, required: true },
  short: Number
})

let Url = mongoose.model("Url", urlSchema);

// 03 - get url parmameter
// set a middleware

//{"original_url":"https://www.google.com","short_url":1}

let bodyParser = require('body-parser')
let responseObject = {}

app.post('/api/shorturl', bodyParser.urlencoded({ extended: false }), (req,res) => {
  // 'url' comes from index.html => name='url'
  let inputUrl = req.body['url']
  
// 05 - ensure input url is match format otherwise "invalid"
  let inputReg = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)
  if (!inputUrl.match(inputReg)) {
    res.json({ error: 'invalid url' })
    return  // important return
  }

  
  responseObject['original_url'] = inputUrl  // output will show the url part

  
// 04 - to find in DB the higgest number, and + 1 for incoming new url
  let inputShort = 1;
Url.findOne({})
   .sort({short: 'desc'})
   .exec((error, output) => { // a callback function
     if (!error && output != undefined) {
       inputShort = output.short + 1 // ensure the new one has +1 higgher than BD, in order to avoid overwrite
     }
     if (!error) {
       Url.findOneAndUpdate( 
         // findoneandupdate has 4 arguments (normally)
         {original: inputUrl},
         {original: inputUrl, short: inputShort},
         {new: true, upsert: true}, // upsert: insert a new row if the specified value doesn't already exist
         (error, savedData) => {
           if (!error){
             responseObject['short_url'] = savedData.short
             res.json(responseObject)
           }
         }
       )
     }
   })

})

app.get('/api/shorturl/:input', (req,res) => {
  let input = req.params.input

  Url.findOne({short: input}, (error,data) => {
    if (!error && data != undefined) {
      res.redirect(data.original)
  }else {
    res.json('URL NOT FOUND.')
  }
})
})

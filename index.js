const express = require('express')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cors());
app.use(express.json());
app.use(express.static('service'));
app.use(fileUpload());

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phmej.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("newsportal").collection("politics");
  const adminCollection = client.db("newsportal").collection("AdminList");
 
  //add post
  app.post('/admin', (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const author = req.body.author;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    collection.insertOne({ title, description, category, author, image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })
  //add Admin
  app.post('/addAdmin', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    adminCollection.insertOne({ name, email, password, image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

    // left side news list
  app.get('/latestNews', (req, res) => {
    collection.find({}).sort({"_id": -1}).limit(5)
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  // single news sorted by id
  app.get('/newsId/:id', (req, res) => {
    collection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  //politics
  app.get('/politics', (req, res) => {
    collection.find({ category: "politics" })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

    //culture
    app.get('/culture', (req, res) => {
      collection.find({ category: "culture" })
        .toArray((err, documents) => {
          res.send(documents)
        })
    })

      //sports
      app.get('/sports', (req, res) => {
        collection.find({ category: "sports" })
          .toArray((err, documents) => {
            res.send(documents)
          })
      })

    //fashion
    app.get('/fashion', (req, res) => {
      collection.find({ category: "fashion" })
        .toArray((err, documents) => {
          res.send(documents)
        })
    })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
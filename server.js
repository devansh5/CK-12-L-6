const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  "",
  { useUnifiedTopology: true }
)
  .then((client) => {
    const db = client.db("recipe");
    console.log("connect to database");
    const recipesCollection = db.collection("recipetest");
    app.use(express.static("public"));
    app.set("view engine", "ejs");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.get("/", (req, res) => {
      res.render("index.ejs");
    });
    function getNextSequence(name) {
      var ret = recipesCollection.findAndModify({
        query: { _id: name },
        update: { $inc: { seq: 1 } },
        new: true,
      });

      return ret.seq;
    }
    app.get("/recipes", (req, res) => {
      recipesCollection
        .find()
        .toArray()
        .then((result) => {
          res.send(result);
        })
        .catch((err) => console.error(err));
    });
    app.post("/recipes", (req, res) => {
      let { xmeme_name, caption_url, caption } = req.body;
      recipesCollection
        .insertOne({
          _id: getNextSequence("recipe_id"),
          xmeme_name: xmeme_name,
          caption_url: caption_url,
          caption: caption,
        })
        .then((result) => {
          recipesCollection
            .find()
            .toArray()
            .then((result) => {
              res.send(result);
            })
            .catch((error) => console.error(error));
        })
        .catch((err) => {
          console.error(err);
        });
    });
    app.get("/recipes/:id", (req, res) => {});
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(3000, () => {
  console.log("running");
});

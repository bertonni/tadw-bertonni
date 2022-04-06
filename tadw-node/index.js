const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 5000;

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./tadw-bertonni-firebase-adminsdk-qb2wh-0e20ce02bb.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const getPosts = async () => {
  const snapshot = await db.collection("posts").get();
  const posts = [];
  snapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data()});
  });
  return posts;
};

const createPost = async (post) => {
  const docRef = db.collection("posts");
  await docRef.doc().set(post);
};

const removePost = async (id) => {
  const res = await db.collection('posts').doc(id).delete();

  console.log('res', res);
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/posts", (req, res) => {
  const posts = getPosts()
    .then((result) => res.send({ message: 'success', data: result }))
});

app.post("/create", (req, res) => {
  createPost(req.body);
  res.status(200).send({ message: "added successfuly" });
});

app.delete("/delete/:id", (req, res) => {
  removePost(req.params.id);
})

app.listen(port, () => console.log(`Listening on port ${port}`));

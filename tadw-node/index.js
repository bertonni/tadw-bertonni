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

const serviceAccount = require("./tadw-bertonni-firebase-adminsdk-qb2wh-cf20fbc917.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const getPokemon = async (owner) => {
  const snapshot = await db.collection("pokemon").doc(owner).collection('pokemons').get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data()});
  });
  return pokemon;
};

const addPokemon = async (pokemon) => {
  const docRef = db.collection("pokemon").doc(pokemon.owner).collection('pokemons');
  await docRef.doc().set(pokemon);
};

const removePokemon = async (id) => {
  const res = await db.collection('pokemon').doc(id).delete();

  console.log('res', res);
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/pokemon", (req, res) => {
  console.log('re', req);
  const pokemon = getPokemon(req.owner)
    .then((result) => res.send({ message: 'success', data: result }))
    .catch((error) => console.log(error));
  console.log(pokemon);
});

app.post("/create", (req, res) => {
  addPokemon(req.body);
  res.status(200).send({ message: "added successfuly" });
});

app.delete("/delete/:id", (req, res) => {
  removePost(req.params.id);
})

app.listen(port, () => console.log(`Listening on port ${port}`));

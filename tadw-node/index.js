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

const serviceAccount = require("./tadw-bertonni-firebase-adminsdk-qb2wh-3229f3dc8e.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const getAllPokemon = async (owner) => {
  const snapshot = await db
    .collection("pokemon")
    .doc(owner)
    .collection("pokemons")
    .get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  return pokemon;
};

const getPokemon = async (owner, id) => {
  const docRef = db
    .collection("pokemon")
    .doc(owner)
    .collection("pokemons")
    .doc(id);
  const doc = await docRef.get();

  return doc.data();
};

const addPokemon = async (pokemon) => {
  const docRef = db
    .collection("pokemon")
    .doc(pokemon.owner)
    .collection("pokemons");
  await docRef.doc(`${pokemon.number}`).set(pokemon);
};

const updatePokemon = async (pokemon) => {
  const docRef = db
    .collection("pokemon")
    .doc(pokemon.owner)
    .collection("pokemons");
  await docRef.doc(`${pokemon.number}`).update(pokemon);
};

const removePokemon = async (owner, id) => {
  const res = await db
    .collection("pokemon")
    .doc(owner)
    .collection("pokemons")
    .doc(id)
    .delete();

  console.log("res", res);
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/pokemon", (req, res) => {
  getAllPokemon(req.query.owner)
    // .then((result) => console.log(result))
    .then((result) =>
      res.send({ message: "success", data: result, nextId: result.length })
    )
    .catch((error) => console.log(error));
});

app.post("/create", (req, res) => {
  addPokemon(req.body);
  res.status(200).send({ message: "added successfuly" });
});

app.put("/update", (req, res) => {
  updatePokemon(req.body);
  res.status(200).send({ message: "Updated successfuly" });
});

app.get("/pokemon/:owner/:id", (req, res) => {
  getPokemon(req.params.owner, req.params.id)
    .then((result) =>
      res.send({ message: "success", data: result, nextId: result.length })
    )
    .catch((error) => console.log(error));

});

app.delete("/delete/:owner/:id", (req, res) => {
  removePokemon(req.params.owner, req.params.id);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

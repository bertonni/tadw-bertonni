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
  await docRef.doc(`${pokemon.number}`).set(pokemon);
};

const updatePokemon = async (pokemon) => {
  const docRef = db.collection("pokemon").doc(pokemon.owner).collection('pokemons');
  await docRef.doc(`${pokemon.number}`).update(pokemon);
};

const removePokemon = async (owner, id) => {
  const res = await db.collection('pokemon').doc(owner).collection('pokemons').doc(id).delete();

  console.log('res', res);
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/pokemon", (req, res) => {
  getPokemon(req.query.owner)
    // .then((result) => console.log(result))
    .then((result) => res.send({ message: 'success', data: result, nextId: result.length }))
    .catch((error) => console.log(error));
});

app.post("/create", (req, res) => {
  addPokemon(req.body);
  res.status(200).send({ message: "added successfuly" });
});

app.put("/update", (req, res) => {
  updatePokemon(req.body);
  res.status(200).send({ message: "Updated successfuly" });
})

const addTypes = async () => {
  const types = [
    {
      "type": "Fire",
      "strong_against": ["Grass", "Ice", "Bug", "Steel"],
      "weak_against": ["Fire", "Water", "Rock", "Dragon"]
    },
    {
      "type": "Water",
      "strong_against": ["Fire", "Ground", "Rock"],
      "weak_against": ["Water", "Grass", "Dragon"]
    },
    {
      "type": "Grass",
      "strong_against":	["Water", "Ground", "Rock"],
      "weak_against": ["Fire", "Grass", "Flying", "Bug", "Poison", "Bug", "Dragon", "Steel"]
    },
    {
      "type": "Electric",
      "strong_against":	["Water", "Flying"],
      "weak_against": ["Grass", "Electric", "Dragon"]
    },
    {
      "type": "Ice",
      "strong_against":	["Grass", "Ground", "Flying", "Dragon"],
      "weak_against": ["Fire", "Water", "Ice", "Steel"]
    },
    {
      "type": "Fighting",
      "strong_against":	["Normal", "Ice", "Rock", "Dark", "Steel"],
      "weak_against": ["Poison", "Flying", "Psychic", "Bug", "Fairy"]
    },
    {
      "type": "Poison",
      "strong_against":	["Grass", "fairy"],
      "weak_against": ["Poison", "Ground", "Rock", "Ghost"]
    },
    {
      "type": "Ground",
      "strong_against":	["Fire", "Electric", "Poison", "Rock", "Steel"],
      "weak_against": ["Grass", "Bug"]
    },
    {
      "type": "Flying",
      "strong_against":	["Grass", "Fighting", "Bug"],
      "weak_against": ["Electric", "Rock", "Steel"]
    },
    {
      "type": "Psychic",
      "strong_against":	["Fighting", "Poison"],
      "weak_against": ["Psychic", "Steel"]
      
    },
    {
      "type": "Bug",
      "strong_against":	["Grass", "Psychic", "Dark"],
      "weak_against": ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"]
    },
    {
      "type": "Rock",
      "strong_against":	["Fire", "Ice", "Flying", "Bug"],
      "weak_against": ["Fighting", "Ground", "Steel"]
    },
    {
      "type": "Ghost",
      "strong_against":	["Psychic", "Ghost"],
      "weak_against": ["Normal", "Dark"]
    },
    {
      "type": "Dragon",
      "strong_against":	["Dragon"],
      "weak_against": ["Steel"]
    },
    {
      "type": "Dark",
      "strong_against":	["Psychic", "Ghost"],
      "weak_against": ["Fighting", "Dark", "Fairy"]
    },
    {
      "type": "Steel",
      "strong_against":	["Ice", "Rock", "Fairy"],
      "weak_against": ["Fire", "Water", "Electric", "Steel"]
    },
    {
      "type": "Fairy",
      "strong_against":	["Fighting", "Dragon", "Dark"],
      "weak_against": ["Fire", "Poison", "Steel"]
    }
  ];

  types.forEach(async (type) => {
    const res = await db.collection("types").doc().set(type);
  });
}

app.get("/addTypes", (req, res) => {
  // addTypes().then((response) => res.send({ message: 'added', data: response }));
})

app.delete("/delete/:owner/:id", (req, res) => {
  removePokemon(req.params.owner, req.params.id);
})

app.listen(port, () => console.log(`Listening on port ${port}`));

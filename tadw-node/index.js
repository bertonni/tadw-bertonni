const express = require("express");
const app = express();
const { createServer } = require('http');
const server = createServer(app);
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const io = new Server(server, { cors: "*" });
const cors = require("cors");
const port = 5000;

const {
  initializeApp,
  cert,
} = require("firebase-admin/app");

const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./tadw-bertonni-firebase-adminsdk-qb2wh-a069484c33.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

io.on('connection', (socket) => {
  const doc = db.collection('types');
  const observer = doc.onSnapshot((docSnapshot) => {
    const types = [];
    docSnapshot.forEach((document) => {
      types.push(document.data());
    });
    io.emit('types', types);
  });

  socket.on('disconnect', () => {
    observer();
  })
})

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

const addType = async (type) => {
  const colRef = db.collection("types");
  await colRef.doc(type.type).set(type);
};

const updateType = async (type) => {
  const colRef = db.collection("types");
  await colRef.doc(type.type).update(type);
};

const deleteType = async (type) => {
  const colRef = db.collection("types");
  await colRef.doc(type.type).delete();
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
  await db
    .collection("pokemon")
    .doc(owner)
    .collection("pokemons")
    .doc(id)
    .delete();
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
  res.status(200).send({ message: "added successfully" });
});

app.post("/types/add", (req, res) => {
  addType(req.body);
  res.status(200).send({ message: "type added" });
});

app.put("/types/update", (req, res) => {
  updateType(req.body);
  console.log('update', req.body);
  res.status(200).send({ message: "type updated" });
});

app.delete("/types/delete", (req, res) => {
  deleteType(req.body);
  res.status(200).send({ message: "type deleted" });
});

app.put("/update", (req, res) => {
  updatePokemon(req.body);
  res.status(200).send({ message: "Updated successfully" });
});

app.get("/pokemon/:owner/:id", (req, res) => {
  getPokemon(req.params.owner, req.params.id)
    .then((result) =>
      res.send({ message: "success", data: result, nextId: result.length })
    )
    .catch((error) => console.log(error));

});

app.delete("/delete/:owner/:id", (req, res) => {
  removePokemon(req.params.owner, req.params.id).then((result) => res.send({ message: 'removed' })).catch((error) => console.log(error));
});

server.listen(port, () => console.log(`Listening on port ${port}`));

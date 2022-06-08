const express = require("express");
const app = express();
const { createServer } = require('http');
const server = createServer(app);
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const io = new Server(server, { cors: "*" });
const cors = require("cors");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session');
const passport = require('passport');
const port = 5000;
require('dotenv').config();

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

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

  socket.emit('connected', 'conectado');

  console.log('connected');

  socket.on('getPokemons', (userId) => {
    const pokemonDoc = db.collection('pokemon');
    const pokemonObserver = pokemonDoc.doc(userId).collection('pokemons').onSnapshot((docSnapshot) => {
      const pokemons = [];
      docSnapshot.forEach((document) => {
        pokemons.push(document.data());
      });
      socket.emit('allPokemon', pokemons);
    })
    socket.on('disconnect', () => {
      pokemonObserver();
    })
  })

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
});

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
    .doc(pokemon.trainer.id)
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

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const GOOGLE_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=[accessToken, refreshToken, profile];
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
// (req, res) => res.redirect('https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fgoogle%2Fcallback&scope=profile%20email&client_id=891621743981-1pu666hm3n19oa0ht3dpoajek51ou94m.apps.googleusercontent.com')
  passport.authenticate('google', { scope : ['profile', 'email'] })
  );
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

app.get("/pokemon", (req, res) => {
  getAllPokemon(req.query.owner)
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

app.get("/pokemon/:trainer/:id", (req, res) => {
  getPokemon(req.params.trainer, req.params.id)
    .then((result) =>
      res.send({ message: "success", data: result, nextId: result.length })
    )
    .catch((error) => console.log(error));

});

app.delete("/delete/:trainer/:id", (req, res) => {
  removePokemon(req.params.trainer, req.params.id).then((result) => res.send({ message: 'removed' })).catch((error) => console.log(error));
});

server.listen(port, () => console.log(`Listening on port ${port}`));

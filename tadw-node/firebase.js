const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

const docRef = db.collection('users');

const createPost = async (post) => {
  await docRef.doc().set(post);
};

const getPosts = async () => {
  const snapshot = await db.collection('posts').get();
  const posts = [];
  if (snapshot.empty) return posts;
  snapshot.forEach(doc => {
    console.log(doc.data());
    posts.push(doc.data());
  });
  return posts;
};

const getPost = async (id) => {
  const usersRef = db.collection('post');
  const snapshot = await usersRef.where('id', '==', id).get();
  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }

  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
};

module.exports = { createPost, getPosts, getPost }
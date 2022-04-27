import { browser } from '$app/env';
import { writable } from 'svelte/store';

const storedUsers = browser && localStorage.getItem('postUsers');
const storedCurrent = browser && localStorage.getItem('currentUser');
const storedPokeNumber = browser && localStorage.getItem('PokeNumber');
const storedTypes = browser && localStorage.getItem('pokemonTypes');

const pokeTypes = [
	{
		type: 'Fire',
		strong_against: ['Grass', 'Ice', 'Bug', 'Steel'],
		weak_against: ['Fire', 'Water', 'Rock', 'Dragon']
	},
	{
		type: "Normal",
		strong_against: [],
		weak_against: ["Rock", "Steel"]
	},
	{
		type: 'Water',
		strong_against: ['Fire', 'Ground', 'Rock'],
		weak_against: ['Water', 'Grass', 'Dragon']
	},
	{
		type: 'Grass',
		strong_against: ['Water', 'Ground', 'Rock'],
		weak_against: ['Fire', 'Grass', 'Flying', 'Bug', 'Poison', 'Bug', 'Dragon', 'Steel']
	},
	{
		type: 'Electric',
		strong_against: ['Water', 'Flying'],
		weak_against: ['Grass', 'Electric', 'Dragon']
	},
	{
		type: 'Ice',
		strong_against: ['Grass', 'Ground', 'Flying', 'Dragon'],
		weak_against: ['Fire', 'Water', 'Ice', 'Steel']
	},
	{
		type: 'Fighting',
		strong_against: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'],
		weak_against: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy']
	},
	{
		type: 'Poison',
		strong_against: ['Grass', 'fairy'],
		weak_against: ['Poison', 'Ground', 'Rock', 'Ghost']
	},
	{
		type: 'Ground',
		strong_against: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'],
		weak_against: ['Grass', 'Bug']
	},
	{
		type: 'Flying',
		strong_against: ['Grass', 'Fighting', 'Bug'],
		weak_against: ['Electric', 'Rock', 'Steel']
	},
	{
		type: 'Psychic',
		strong_against: ['Fighting', 'Poison'],
		weak_against: ['Psychic', 'Steel']
	},
	{
		type: 'Bug',
		strong_against: ['Grass', 'Psychic', 'Dark'],
		weak_against: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy']
	},
	{
		type: 'Rock',
		strong_against: ['Fire', 'Ice', 'Flying', 'Bug'],
		weak_against: ['Fighting', 'Ground', 'Steel']
	},
	{
		type: 'Ghost',
		strong_against: ['Psychic', 'Ghost'],
		weak_against: ['Normal', 'Dark']
	},
	{
		type: 'Dragon',
		strong_against: ['Dragon'],
		weak_against: ['Steel']
	},
	{
		type: 'Dark',
		strong_against: ['Psychic', 'Ghost'],
		weak_against: ['Fighting', 'Dark', 'Fairy']
	},
	{
		type: 'Steel',
		strong_against: ['Ice', 'Rock', 'Fairy'],
		weak_against: ['Fire', 'Water', 'Electric', 'Steel']
	},
	{
		type: 'Fairy',
		strong_against: ['Fighting', 'Dragon', 'Dark'],
		weak_against: ['Fire', 'Poison', 'Steel']
	}
];

export const users = writable(storedUsers ? JSON.parse(storedUsers) : []);
export const currentUser = writable(storedCurrent ? JSON.parse(storedCurrent) : null);
export const pokeNumber = writable(storedPokeNumber ? storedPokeNumber : '1');
export const types = writable(storedTypes ? JSON.parse(storedTypes) : []);

// const getPokemons = async () => {
//   console.log(JSON.parse(storedCurrent).email);
// 	const url = `http://localhost:5000/pokemon?owner=${JSON.parse(storedCurrent).email}`;
// 	const response = await fetch(url);
// 	const pokemon = await response.json();

//   return pokemon;
// };

// if (storedCurrent) {
//   getPokemons().then(res => console.log(res.data)).catch(error => console.log(error));
// }

if (browser) {
	users.subscribe((usr) => (localStorage.postUsers = JSON.stringify(usr)));
	currentUser.subscribe((usr) => (localStorage.currentUser = JSON.stringify(usr)));
	pokeNumber.subscribe((number) => (localStorage.pokeNumber = number));
	types.subscribe(() => (localStorage.pokemonTypes = JSON.stringify(pokeTypes)));
}

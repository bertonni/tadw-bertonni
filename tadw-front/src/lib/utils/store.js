import { browser } from '$app/env';
import { get, writable } from 'svelte/store';
import { detailedTypes } from './types';
import { io } from "$lib/utils/socket";

export const allTypesDetailed = writable([]);
export const pokemonLength = writable(0);

io.on('types', (message) => {
	allTypesDetailed.set(message);
});

io.on('connected', () => {
	if (get(currentUser)) {
		io.emit('getPokemons', (get(currentUser).uid));
	}
});

io.on('allPokemon', (pokemon) => {
	pokemonLength.set(pokemon.length);
	console.log('updated');
});

const storedUsers = browser && localStorage.getItem('postUsers');
const storedCurrent = browser && localStorage.getItem('currentUser');
const storedPokeNumber = browser && localStorage.getItem('PokeNumber');
const storedTypes = browser && localStorage.getItem('pokemonTypes');
const storedSimpleTypes = browser && localStorage.getItem('simpleTypes');

const pokeTypes = detailedTypes;
const simpleTypes = [];
pokeTypes.forEach((type) => {
	simpleTypes.push(type.type);
});

export const users = writable(storedUsers ? JSON.parse(storedUsers) : []);
export const currentUser = writable(storedCurrent ? JSON.parse(storedCurrent) : null);
export const pokeNumber = writable(storedPokeNumber ? storedPokeNumber : '1');
export const types = writable(storedTypes ? JSON.parse(storedTypes) : pokeTypes);
export const minTypes = writable(storedSimpleTypes ? JSON.parse(storedSimpleTypes) : simpleTypes);

if (get(currentUser)?.displayName.length > 0) {
	console.log('logged user');
}

if (browser) {
	users.subscribe((usr) => (localStorage.postUsers = JSON.stringify(usr)));
	currentUser.subscribe((usr) => (localStorage.currentUser = JSON.stringify(usr)));
	pokeNumber.subscribe((number) => (localStorage.pokeNumber = number));
	types.subscribe((type) => (localStorage.pokemonTypes = JSON.stringify(type)));
	minTypes.subscribe((type) => (localStorage.simpleTypes = JSON.stringify(type)));
}

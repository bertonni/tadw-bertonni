import { browser } from '$app/env';
import { get, writable } from 'svelte/store';
import { detailedTypes } from './types';
import { io } from '$lib/utils/socket';


export const allTypesDetailed = writable([]);
export const pokemonLength = writable(0);
export const pokemons = writable([]);

const storedCurrent = browser && localStorage.getItem('currentUser');
const storedTypes = browser && localStorage.getItem('pokemonTypes');

const pokeTypes = detailedTypes;
const simpleTypes = [];
pokeTypes.forEach((type) => {
	simpleTypes.push(type.type);
});

export const currentUser = writable(storedCurrent ? JSON.parse(storedCurrent) : null);
export const types = writable(storedTypes ? JSON.parse(storedTypes) : pokeTypes);

io.on('types', (message) => {
	allTypesDetailed.set(message);
});

io.on('connected', () => {
	console.log('conectado');
	if (get(currentUser)) {
		io.emit('getPokemons', get(currentUser).uid);
	}
});

io.on('allPokemon', (pokemon) => {
	console.log('get all pokemon');
	pokemons.set(pokemon);
	pokemonLength.set(pokemon.length);
});

if (browser) {
	currentUser.subscribe((usr) => (localStorage.currentUser = JSON.stringify(usr)));
	types.subscribe((type) => (localStorage.pokemonTypes = JSON.stringify(type)));
}

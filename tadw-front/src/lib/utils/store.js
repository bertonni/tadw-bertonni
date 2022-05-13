import { browser } from '$app/env';
import { writable } from 'svelte/store';
import { detailedTypes } from './types';

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

if (browser) {
	users.subscribe((usr) => (localStorage.postUsers = JSON.stringify(usr)));
	currentUser.subscribe((usr) => (localStorage.currentUser = JSON.stringify(usr)));
	pokeNumber.subscribe((number) => (localStorage.pokeNumber = number));
	types.subscribe((type) => (localStorage.pokemonTypes = JSON.stringify(type)));
	minTypes.subscribe((type) => (localStorage.simpleTypes = JSON.stringify(type)));
}

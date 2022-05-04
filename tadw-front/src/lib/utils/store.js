import { browser } from '$app/env';
import { writable } from 'svelte/store';
import { detailedTypes } from './types';

const storedUsers = browser && localStorage.getItem('postUsers');
const storedCurrent = browser && localStorage.getItem('currentUser');
const storedPokeNumber = browser && localStorage.getItem('PokeNumber');
const storedTypes = browser && localStorage.getItem('pokemonTypes');

const pokeTypes = detailedTypes;

export const users = writable(storedUsers ? JSON.parse(storedUsers) : []);
export const currentUser = writable(storedCurrent ? JSON.parse(storedCurrent) : null);
export const pokeNumber = writable(storedPokeNumber ? storedPokeNumber : '1');
export const types = writable(storedTypes ? JSON.parse(storedTypes) : pokeTypes);

if (browser) {
	users.subscribe((usr) => (localStorage.postUsers = JSON.stringify(usr)));
	currentUser.subscribe((usr) => (localStorage.currentUser = JSON.stringify(usr)));
	pokeNumber.subscribe((number) => (localStorage.pokeNumber = number));
	types.subscribe(() => (localStorage.pokemonTypes = JSON.stringify(pokeTypes)));
}

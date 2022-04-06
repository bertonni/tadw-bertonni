import { browser } from "$app/env";
import { writable } from "svelte/store";

const storedUsers = browser && localStorage.getItem('postUsers');
const storedCurrent = browser && localStorage.getItem('currentUser');

export const users = writable(storedUsers ? JSON.parse(storedUsers) : []);
export const currentUser = writable(storedCurrent ? JSON.parse(storedCurrent) : null);

if (browser) {
  users.subscribe(usr => localStorage.postUsers = JSON.stringify(usr));
  currentUser.subscribe(usr => localStorage.currentUser = JSON.stringify(usr));
}

import { writable } from 'svelte/store';

export const token = writable(localStorage.getItem('api-token') || '');

token.subscribe((value) => localStorage.setItem('api-token', value));

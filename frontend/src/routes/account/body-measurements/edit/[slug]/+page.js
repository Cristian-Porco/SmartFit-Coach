import { error } from '@sveltejs/kit';
import {getCookie} from "svelte-cookie";

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    return {
        id: params.slug
    };
}
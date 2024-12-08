"use client";

import { isDictKey } from '../[lang]/dictionaries'

import { redirect } from 'next/navigation';

export default function Root() {
    for(let language of navigator.languages) {
        let lang = language.split("-")[0];

        if(isDictKey(lang)) redirect(`${lang}`)
    }

    // Default english
    redirect('/en')
}
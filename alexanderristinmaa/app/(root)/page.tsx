"use client";

import dynamic from 'next/dynamic';
import { isDictKey } from '../[lang]/dictionaries'

import { redirect } from 'next/navigation';

export default function Root() {    
    const nav = navigator || {languages: ["en"]};
    for(let language of nav.languages) {
        let lang = language.split("-")[0];

        if(isDictKey(lang)) redirect(`${lang}`)
    }

    // Default english
    redirect('/en')
}
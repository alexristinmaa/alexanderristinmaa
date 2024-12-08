"use client";

import { isDictKey } from '../[lang]/dictionaries'

import { redirect } from 'next/navigation';

export default function Root() {    
    const nav = typeof navigator == "undefined" ? {languages: ["en"]} : navigator;
    
    for(let language of nav.languages) {
        let lang = language.split("-")[0];

        if(isDictKey(lang)) redirect(`${lang}`)
    }

    // Default english
    redirect('/en')
}
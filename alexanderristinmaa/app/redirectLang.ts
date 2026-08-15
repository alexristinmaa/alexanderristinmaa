import { redirect } from "next/navigation";
import { isDictKey } from "./[lang]/dictionaries";

export function redirectWithLang(link: string) {
    const nav = typeof navigator == "undefined" ? {languages: ["en"]} : navigator;
        
    for(let language of nav.languages) {
        let lang = language.split("-")[0];

        if(isDictKey(lang)) redirect(`/${lang}${link}`)
    }

    // Default english
    redirect(`/en${link}`)
}
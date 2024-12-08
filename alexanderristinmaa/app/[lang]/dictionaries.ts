//import 'server-only'
 
const dictionaries = {
  "en": () => import('./dictionaries/en.json').then((module) => module.default),
  "sv": () => import('./dictionaries/sv.json').then((module) => module.default),
}



export const isDictKey = (language: string): language is keyof typeof dictionaries => {
  return Object.keys(dictionaries).includes(language);
}

export const getLanguages = (): {lang: string}[] => {
  return Object.keys(dictionaries).map(k => {return {lang: k}})
}

/**
 * 
 * @param languages languages from the navigator
 * @returns 
 */
export const getDictionary = async (language: string) => {  
  if(isDictKey(language)) return dictionaries[language]();

  return dictionaries["en"]()
}
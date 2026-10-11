import { useContext } from 'react';
import { UNSAFE_LocationContext } from 'react-router-dom';
import { translations } from './translations';

export type Language = 'en' | 'uk';
export const getLanguage = (path: string): Language => path === '/uk' || path.startsWith('/uk/') ? 'uk' : 'en';
export const basePath = (path: string) => getLanguage(path) === 'uk' ? path.slice(3) || '/home' : path;
export const localizedPath = (path: string, language: Language) => language === 'uk' ? `/uk${path}` : path;

export function useLanguage() {
  const pathname = useContext(UNSAFE_LocationContext)?.location.pathname ?? '/home';
  const language = getLanguage(pathname);
  return { language, t: (text: string) => language === 'uk' ? translations[text] ?? text : text };
}


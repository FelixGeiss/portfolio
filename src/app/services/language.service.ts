import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'de' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  // BehaviorSubject holding the current language, initialized from localStorage or default 'de'
  private langSubject = new BehaviorSubject<Lang>(
    (localStorage.getItem('lang') as Lang) || 'de'
  );

  // Observable stream for components to subscribe to language changes
  currentLang$ = this.langSubject.asObservable();

  // Getter for the current language value
  get currentLang(): Lang {
    return this.langSubject.value;
  }

  // Set and persist a new language, then notify subscribers
  setLang(lang: Lang): void {
    localStorage.setItem('lang', lang);
    this.langSubject.next(lang);
  }
}

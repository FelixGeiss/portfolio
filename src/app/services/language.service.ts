import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'de' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private langSubject = new BehaviorSubject<Lang>(
    (localStorage.getItem('lang') as Lang) || 'de'
  );

  currentLang$ = this.langSubject.asObservable();


  get currentLang(): Lang {
    return this.langSubject.value;
  }

  setLang(lang: Lang) {
    localStorage.setItem('lang', lang);
    this.langSubject.next(lang);
  }
}

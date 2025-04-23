import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';

// Interface angepasst an die externen JSON-Keys
interface ContactContent {
  contacContent: string;
  agreeContent: string;
  name: string;
  email: string;
  massage: string;   // entspricht dem JSON-Key "massage"
  requierd: string;  // entspricht dem JSON-Key "requierd"
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  isChecked = false;
  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i)
    ]),
    message: new FormControl('', Validators.required)
  });

  // dynamisch geladene Texte
  safeHeader!: SafeHtml;
  safeContent!: SafeHtml;
  safeAgree!: SafeHtml;
  namePlaceholder!: string;
  emailPlaceholder!: string;
  messagePlaceholder!: string;
  requiredText!: string;

  currentLang: Lang = 'de';
  private langSub!: Subscription;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.langSub = this.languageService.currentLang$
      .subscribe(lang => {
        this.currentLang = lang;
        this.loadContent(lang);
      });
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  private loadContent(lang: Lang): void {
    this.http.get<any>(`assets/content.${lang}.json`)
      .subscribe(json => {
        // Header-Text aus nav.contact
        const header = json.nav?.contact || 'Contact';
        this.safeHeader = this.sanitizer.bypassSecurityTrustHtml(header);

        // Kontakt-Intro-Text und Checkbox-Label aus contact-Section
        const contactSection: ContactContent = json.contact;
        this.safeContent = this.sanitizer.bypassSecurityTrustHtml(contactSection.contacContent);
        this.safeAgree   = this.sanitizer.bypassSecurityTrustHtml(contactSection.agreeContent);

        // Platzhalter und Fehlermeldung aus JSON
        this.namePlaceholder    = contactSection.name;
        this.emailPlaceholder   = contactSection.email;
        this.messagePlaceholder = contactSection.massage;
        this.requiredText       = contactSection.requierd;
      });
  }

  isCheckt(event: Event): void {
    this.isChecked = (event.target as HTMLInputElement).checked;
  }

  onSubmit(): void {
    if (this.contactForm.valid && this.isChecked) {
      // Absende-Logik hier implementieren
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}

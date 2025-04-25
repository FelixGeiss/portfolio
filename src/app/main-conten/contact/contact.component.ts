import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';

interface ContactContent {
  contacContent: string;
  agreeContent: string;
  name: string;
  email: string;
  massage: string;
  requierd: string;
  button: string;    
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
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

  safeHeader!: SafeHtml;
  safeContent!: SafeHtml;
  safeAgree!: SafeHtml;
  namePlaceholder!: string;
  emailPlaceholder!: string;
  messagePlaceholder!: string;
  requiredText!: string;
  buttonText!: string;            

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
        const header = json.nav?.contact || 'Contact';
        this.safeHeader = this.sanitizer.bypassSecurityTrustHtml(header);

        const contactSection: ContactContent = json.contact;
        this.safeContent   = this.sanitizer.bypassSecurityTrustHtml(contactSection.contacContent);
        this.safeAgree     = this.sanitizer.bypassSecurityTrustHtml(contactSection.agreeContent);

        this.namePlaceholder    = contactSection.name;
        this.emailPlaceholder   = contactSection.email;
        this.messagePlaceholder = contactSection.massage;
        this.requiredText       = contactSection.requierd;
        this.buttonText         = contactSection.button;   
      });
  }

  isCheckt(event: Event): void {
    this.isChecked = (event.target as HTMLInputElement).checked;
  }

  onSubmit(): void {
    if (this.contactForm.valid && this.isChecked) {
      const payload = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        message: this.contactForm.value.message
      };

      this.http.post('https://felixgeiss.de/sendMail.php', payload)
        .subscribe({
          next: () => {
            alert('Deine Nachricht wurde erfolgreich versendet!');
            this.contactForm.reset();
            this.isChecked = false;
          },
          error: err => {
            console.error('Fehler beim Senden:', err);
            alert('Beim Versenden ist leider ein Fehler aufgetreten. Bitte versuche es später erneut.');
          }
        });
    } else {
      this.contactForm.markAllAsTouched();
      if (!this.isChecked) {
        alert('Bitte bestätige die Datenschutzerklärung.');
      }
    }
  }
}

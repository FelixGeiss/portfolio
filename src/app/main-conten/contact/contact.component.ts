import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';
import { ScrollAnimationDirective } from '../../services/animation.directive';

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
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,ScrollAnimationDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  // Form state and checkbox
  isChecked = false;
  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required,
      Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i)
    ]),
    message: new FormControl('', Validators.required)
  });

  // Content placeholders
  safeHeader!: SafeHtml;
  safeContent!: SafeHtml;
  safeAgree!: SafeHtml;
  namePlaceholder!: string;
  emailPlaceholder!: string;
  messagePlaceholder!: string;
  requiredText!: string;
  buttonText!: string;

  // Feedback messages
  successMessage: string | null = null;
  errorMessage: string | null = null;

  currentLang: Lang = 'de';
  private langSub!: Subscription;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService
  ) {}

  /**
   * Subscribe to language changes on init
   */
  ngOnInit(): void {
    this.langSub = this.languageService.currentLang$
      .subscribe(lang => this.handleLangChange(lang));
  }

  /**
   * Unsubscribe to avoid memory leaks
   */
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  /**
   * Handle language updates
   */
  private handleLangChange(lang: Lang): void {
    this.currentLang = lang;
    this.loadContent(lang);
  }

  /**
   * Load and sanitize content from JSON
   */
  private loadContent(lang: Lang): void {
    this.http.get<any>(`assets/content.${lang}.json`)
      .subscribe(json => this.applyContent(json, lang));
  }

  /**
   * Apply content fields and placeholders
   */
  private applyContent(json: any, lang: Lang): void {
    const header = json.nav?.contact || (lang === 'de' ? 'Kontakt' : 'Contact');
    this.safeHeader = this.sanitizer.bypassSecurityTrustHtml(header);

    const section: ContactContent = json.contact;
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(section.contacContent);
    this.safeAgree   = this.sanitizer.bypassSecurityTrustHtml(section.agreeContent);

    this.namePlaceholder    = section.name;
    this.emailPlaceholder   = section.email;
    this.messagePlaceholder = section.massage;
    this.requiredText       = section.requierd;
    this.buttonText         = section.button;
  }

  /**
   * Checkbox toggle handler
   */
  isCheckt(event: Event): void {
    this.isChecked = (event.target as HTMLInputElement).checked;
  }

  /**
   * Main form submission entry
   */
  onSubmit(): void {
    this.clearMessages();
    if (this.isFormValid()) {
      this.sendMail();
    }
  }

  /**
   * Reset feedback messages
   */
  private clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  /**
   * Check form validity and checkbox
   */
  private isFormValid(): boolean {
    return this.contactForm.valid && this.isChecked;
  }

  /**
   * Send form payload to server
   */
  private sendMail(): void {
    const payload = { ...this.contactForm.value };
    this.http.post('https://felixgeiss.de/sendMail.php', payload)
      .subscribe({
        next: () => this.onSuccess(),
        error: err => this.onError(err)
      });
  }

  private onSuccess(): void {
    this.successMessage = this.currentLang === 'de'
      ? 'Deine Nachricht wurde erfolgreich versendet!'
      : 'Your message has been sent successfully!';
    this.resetForm();
    this.successMessageTimer();  // hide success after 4s
  }
  
  private successMessageTimer(): void {
    setTimeout(() => {
      this.successMessage = null;
    }, 4000);
  }
  
  /**
   * Handle submission error
   */
  private onError(err: any): void {
    console.error('Error sending:', err);
    this.errorMessage = this.currentLang === 'de'
      ? 'Beim Versenden ist leider ein Fehler aufgetreten. Bitte versuche es später erneut.'
      : 'There was an error sending your message. Please try again later.';
  
    this.errorMessageTimer();     // hide error after 4s
  }
  
  private errorMessageTimer(): void {
    setTimeout(() => {
      this.errorMessage = null;
    }, 4000);
  }
  

  /**
   * Reset form and checkbox
   */
  private resetForm(): void {
    this.contactForm.reset();
    this.isChecked = false;
  }


}
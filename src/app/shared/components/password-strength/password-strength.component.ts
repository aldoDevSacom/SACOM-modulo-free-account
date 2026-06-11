import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  standalone: false,
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() password = '';
  strength = 0;
  label = '';

  ngOnChanges(): void {
    this.strength = this.calculate(this.password);
    this.label = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'][this.strength];
  }

  private calculate(pwd: string): number {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }
}

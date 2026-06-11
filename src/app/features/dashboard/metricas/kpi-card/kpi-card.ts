import { Component, Input, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: false,
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
  providers: [DecimalPipe]
})
export class KpiCard {
  private decimal = inject(DecimalPipe);

  @Input() label = '';
  @Input() value: string | number = '';
  @Input() badge = '';
  @Input() badgeType: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() accent = false;

  get displayValue(): string {
    return typeof this.value === 'number' ? (this.decimal.transform(this.value) ?? '') : String(this.value);
  }
}

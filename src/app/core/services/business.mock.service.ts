import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Business } from '../models/business.model';
import mockData from '../../../assets/mock-data.json';

@Injectable({ providedIn: 'root' })
export class BusinessMockService {
  private readonly KEY = 'sa_business';

  business = signal<Business>(this.load());

  private load(): Business {
    const raw = sessionStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : (mockData.business as unknown as Business);
  }

  getBusiness(): Observable<Business> {
    return of(this.business());
  }

  updateBusiness(data: Partial<Business>): Observable<Business> {
    const updated = { ...this.business(), ...data };
    sessionStorage.setItem(this.KEY, JSON.stringify(updated));
    this.business.set(updated);
    return of(updated);
  }

  uploadLogo(file: File): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.onerror = () => observer.error(reader.error);
      reader.readAsDataURL(file);
    });
  }
}

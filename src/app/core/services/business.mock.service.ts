import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Business } from '../models/business.model';
import mockData from '../../../assets/mock-data.json';

@Injectable({ providedIn: 'root' })
export class BusinessMockService {
  private readonly KEY = 'sa_businesses';

  businesses = signal<Business[]>(this.load());

  private load(): Business[] {
    const raw = sessionStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : (mockData.businesses as unknown as Business[]);
  }

  private save(list: Business[]): void {
    sessionStorage.setItem(this.KEY, JSON.stringify(list));
    this.businesses.set(list);
  }

  getBusinessById(id: string): Business | undefined {
    return this.businesses().find(b => b.id === id);
  }

  addBusiness(data: Omit<Business, 'id' | 'userId'>): Observable<Business> {
    const newBiz: Business = { ...data as Business, id: crypto.randomUUID(), userId: 'usr-001' };
    this.save([...this.businesses(), newBiz]);
    return of(newBiz);
  }

  updateBusiness(id: string, data: Partial<Business>): Observable<Business> {
    const updated = this.businesses().map(b => b.id === id ? { ...b, ...data } : b);
    this.save(updated);
    return of(updated.find(b => b.id === id)!);
  }

  deleteBusiness(id: string): Observable<void> {
    this.save(this.businesses().filter(b => b.id !== id));
    return of(void 0);
  }

  uploadLogo(file: File): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => { observer.next(reader.result as string); observer.complete(); };
      reader.onerror = () => observer.error(reader.error);
      reader.readAsDataURL(file);
    });
  }
}

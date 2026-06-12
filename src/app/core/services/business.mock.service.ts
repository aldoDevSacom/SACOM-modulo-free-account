import { Injectable, computed, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Business, BusinessDraft, BusinessStatus } from '../models/business.model';
import mockData from '../../../assets/mock-data.json';

export interface StatusTransitionResult {
  success: boolean;
  status?: BusinessStatus;
  message: string;
}

const MAX_PUBLISHED = 3;

@Injectable({ providedIn: 'root' })
export class BusinessMockService {
  private readonly KEY = 'sa_businesses';

  businesses = signal<Business[]>(this.load());

  /** Negocios visibles en UI (excluye eliminados lógicamente) */
  visibleBusinesses = computed(() => this.businesses());

  /** Cantidad de negocios publicados */
  publishedCount = computed(() =>
    this.businesses().filter(b => b.status === 'published').length
  );

  /** Indica si hay slot de publicación disponible */
  hasPublishSlot = computed(() => this.publishedCount() < MAX_PUBLISHED);

  private load(): Business[] {
    const raw = sessionStorage.getItem(this.KEY);
    if (raw) {
      // Migración retrocompatible: asignar status a negocios sin él
      const parsed: Business[] = JSON.parse(raw);
      return parsed.map(b => ({
        ...b,
        status: b.status ?? ('published' as BusinessStatus),
        createdAt: b.createdAt ?? new Date().toISOString(),
        draft: b.draft ?? null
      }));
    }
    return (mockData.businesses as unknown as Business[]);
  }

  private save(list: Business[]): void {
    sessionStorage.setItem(this.KEY, JSON.stringify(list));
    this.businesses.set(list);
  }

  getBusinessById(id: string): Business | undefined {
    return this.businesses().find(b => b.id === id);
  }

  // ─── Crear ────────────────────────────────────────────────────────────────

  addBusiness(data: Omit<Business, 'id' | 'userId' | 'status' | 'createdAt' | 'draft'>): Observable<Business> {
    const newBiz: Business = {
      ...data,
      id: crypto.randomUUID(),
      userId: 'usr-001',
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      draft: null
    };
    this.save([...this.businesses(), newBiz]);
    return of(newBiz);
  }

  // ─── Guardar avance (sin validación de campos mínimos) ────────────────────

  saveProgress(id: string, data: Partial<Omit<Business, 'id' | 'userId' | 'status' | 'draft' | 'createdAt'>>): Observable<Business> {
    const updated = this.businesses().map(b => {
      if (b.id !== id) return b;
      if (b.status === 'published') {
        // Para publicados: guardar en draft, no afectar versión pública
        const currentDraft: BusinessDraft = b.draft ?? {
          businessName: b.businessName, contactName: b.contactName,
          contactEmail: b.contactEmail, contactPhone: b.contactPhone,
          categoryCode: b.categoryCode, category: b.category,
          website: b.website, publicPhone: b.publicPhone,
          products: b.products, logoUrl: b.logoUrl,
          address: b.address, hours: b.hours
        };
        return { ...b, draft: { ...currentDraft, ...data } };
      }
      // Para in_progress / unpublished: guardar directo
      return { ...b, ...data };
    });
    this.save(updated);
    return of(updated.find(b => b.id === id)!);
  }

  // ─── Finalizar (valida campos mínimos + lógica de estado) ─────────────────

  finalize(id: string): Observable<StatusTransitionResult> {
    const biz = this.getBusinessById(id);
    if (!biz) return of({ success: false, message: 'Negocio no encontrado.' });

    // Determinar datos actuales (aplicar draft si existe)
    const data = biz.draft ? { ...biz, ...biz.draft } : biz;

    // Validar campos mínimos
    const missing: string[] = [];
    if (!data.businessName?.trim()) missing.push('nombre del negocio');
    if (!data.category?.trim())     missing.push('categoría o giro');
    if (!data.address?.fullAddress?.trim() && !data.address?.street?.trim()) missing.push('dirección');
    if (!data.publicPhone?.trim())  missing.push('teléfono');

    if (missing.length) {
      return of({
        success: false,
        message: `Para finalizar, completa la información requerida: ${missing.join(', ')}.`
      });
    }

    // Negocio ya publicado: solo actualizar con draft
    if (biz.status === 'published') {
      const updated = this.businesses().map(b =>
        b.id === id ? { ...b, ...(b.draft ?? {}), draft: null } : b
      );
      this.save(updated);
      return of({ success: true, status: 'published' as BusinessStatus, message: 'Los cambios fueron publicados correctamente.' });
    }

    // in_progress / unpublished: intentar publicar
    if (this.hasPublishSlot()) {
      const updated = this.businesses().map(b =>
        b.id === id ? { ...b, ...data, status: 'published' as BusinessStatus, draft: null } : b
      );
      this.save(updated);
      return of({ success: true, status: 'published' as BusinessStatus, message: 'Tu negocio fue publicado correctamente.' });
    } else {
      // Sin slot: dejar como unpublished
      const updated = this.businesses().map(b =>
        b.id === id ? { ...b, ...data, status: 'unpublished' as BusinessStatus, draft: null } : b
      );
      this.save(updated);
      return of({
        success: true,
        status: 'unpublished' as BusinessStatus,
        message: 'Ya tienes 3 negocios publicados. Tu negocio fue guardado como No publicado. Para publicarlo, cambia uno de tus negocios publicados a No publicado.'
      });
    }
  }

  // ─── Publicar (solo desde unpublished, verifica slot) ─────────────────────

  publish(id: string): Observable<StatusTransitionResult> {
    if (!this.hasPublishSlot()) {
      return of({
        success: false,
        message: 'No es posible publicar este negocio porque ya tienes 3 negocios publicados. Para publicar otro, cambia alguno de los publicados a No publicado.'
      });
    }
    const updated = this.businesses().map(b =>
      b.id === id ? { ...b, status: 'published' as BusinessStatus } : b
    );
    this.save(updated);
    return of({ success: true, status: 'published' as BusinessStatus, message: 'Tu negocio fue publicado correctamente.' });
  }

  // ─── Despublicar ──────────────────────────────────────────────────────────

  unpublish(id: string): Observable<Business> {
    const updated = this.businesses().map(b =>
      b.id === id ? { ...b, status: 'unpublished' as BusinessStatus, draft: null } : b
    );
    this.save(updated);
    return of(updated.find(b => b.id === id)!);
  }

  // ─── Eliminación lógica (solo in_progress y unpublished) ─────────────────

  softDelete(id: string): Observable<StatusTransitionResult> {
    const biz = this.getBusinessById(id);
    if (!biz) return of({ success: false, message: 'Negocio no encontrado.' });
    if (biz.status === 'published') {
      return of({ success: false, message: 'No puedes eliminar un negocio publicado. Primero cámbialo a No publicado.' });
    }
    // Eliminación física del signal (el spec dice que no aparece en UI)
    this.save(this.businesses().filter(b => b.id !== id));
    return of({ success: true, message: 'El negocio fue eliminado.' });
  }

  // ─── Actualización genérica (compatible con código anterior) ─────────────

  updateBusiness(id: string, data: Partial<Business>): Observable<Business> {
    const updated = this.businesses().map(b => b.id === id ? { ...b, ...data } : b);
    this.save(updated);
    return of(updated.find(b => b.id === id)!);
  }

  /** @deprecated Usar softDelete. Mantenido para no romper código existente. */
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

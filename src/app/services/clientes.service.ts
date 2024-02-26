import { Injectable } from '@angular/core';
import { Cliente } from '../domain/clientes';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private dbPath = '/Clientes';
  clientesRef: AngularFirestoreCollection<Cliente>;

  constructor(private db: AngularFirestore) {
    this.clientesRef = db.collection(this.dbPath);
  }

  save(cliente: Cliente): void {
    cliente.id = this.db.createId();
    this.create(cliente);
  }

  async getClientByDocument(tipoDocumento: string, cedula: string, pasaporte: string): Promise<Cliente | undefined> {
    const query = this.clientesRef.ref.where('tipoDocumento', '==', tipoDocumento)
                                      .where('cedula', '==', cedula)
                                      .where('pasaporte', '==', pasaporte)
                                      .limit(1);

    const snapshot = await query.get();
    const matchingClient = snapshot.docs[0]?.data() as Cliente;
    return matchingClient;
  }

  create(cliente: Cliente): void {
    this.clientesRef.doc(cliente.id).set({ ...cliente });
  }

  // Otros métodos de CRUD y operaciones
  // ...
}

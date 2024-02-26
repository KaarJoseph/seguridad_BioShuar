import { Component } from '@angular/core';
import { Cliente } from '../domain/clientes';
import { ClientesService } from '../services/clientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {

  cliente: Cliente = new Cliente();
  nombreInvalid: boolean = false;
  apellidoInvalid: boolean = false;
  tipoDocumentoInvalid: boolean = false;
  cedulaInvalid: boolean = false;
  pasaporteInvalid: boolean = false;
  emailInvalid: boolean = false;
  acuerdoTerminos: boolean = false;
  envioIntentado: boolean = false;
  mostrarMensajeBienvenida: boolean = false;

  constructor(private clienteService: ClientesService, private router: Router) {
    let params = this.router.getCurrentNavigation()?.extras.queryParams;
    if (params) {
      this.cliente = new Cliente();
      this.cliente = params['cliente'];
    }
  }

  async enviar() {
    this.envioIntentado = true;

    // Validaciones antes de enviar
    this.nombreInvalid = this.cliente.nombre.trim() === '';
    this.apellidoInvalid = this.cliente.apellido.trim() === '';
    this.tipoDocumentoInvalid = this.cliente.tipoDocumento === '';
    this.cedulaInvalid = this.cliente.tipoDocumento === 'cedula' && (this.cliente.cedula?.trim() === '' || !this.validateCedula(this.cliente.cedula));
    this.pasaporteInvalid = this.cliente.tipoDocumento === 'pasaporte' && (this.cliente.pasaporte?.trim() === '' || !this.validatePasaporte(this.cliente.pasaporte));
    this.emailInvalid = this.cliente.email.trim() === '' || !this.validateEmail(this.cliente.email);

    if (!this.acuerdoTerminos || this.nombreInvalid || this.apellidoInvalid || this.tipoDocumentoInvalid || this.cedulaInvalid || this.pasaporteInvalid || this.emailInvalid) {
      return;
    }

    // Consultar si el cliente ya existe por cédula o pasaporte
    const existingClient = await this.clienteService.getClientByDocument(this.cliente.tipoDocumento, this.cliente.cedula, this.cliente.pasaporte);

    if (existingClient) {
      this.mostrarMensajeBienvenida = true;
      // Limpiar campos y mensaje después del envío
      this.cliente = new Cliente();
      this.acuerdoTerminos = false;
      this.envioIntentado = false;

      setTimeout(() => {
        this.mostrarMensajeBienvenida = false;
      }, 3000); // Ocultar mensaje después de 5 segundos
    } else {
      console.log('Cliente nuevo, guardando información');
      this.clienteService.save(this.cliente);
      // Limpiar campos después de guardar
      this.cliente = new Cliente();
      this.acuerdoTerminos = false;
      this.envioIntentado = false;
    }
  }

  // Resto de funciones de validación y lógica
  // ...

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  validateCedula(cedula: string): boolean {
    if (cedula.length !== 10) {
      return false;
    }
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const digitoVerificador = parseInt(cedula[9]);
    let suma = 0;
    
    for (let i = 0; i < 9; i++) {
      let valor = parseInt(cedula[i]) * coeficientes[i];
      if (valor >= 10) {
        valor -= 9;
      }
      suma += valor;
    }

    const sumaCalculada = 10 - (suma % 10);
    if ((sumaCalculada === 10 && digitoVerificador === 0) || sumaCalculada === digitoVerificador) {
      return true;
    } else {
      return false;
    }
  }

  validatePasaporte(pasaporte: string): boolean {
    return pasaporte.length >= 6 && pasaporte.length <= 15 && /^[a-zA-Z0-9]+$/.test(pasaporte);
  }
}

import { AbstractControl, ValidatorFn } from '@angular/forms';

export function cedulaEcuatorianaValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (!value) {
      return null; // No se aplica la validación si el valor es nulo
    }

    // Verificar la longitud del valor
    if (value.length !== 10) {
      return { 'cedulaEcuatoriana': true }; // Longitud incorrecta
    }

    // Verificar si es un número válido
    if (!(/^\d+$/.test(value))) {
      return { 'cedulaEcuatoriana': true }; // No es un número válido
    }

    // Verificar el primer dígito
    const provinciaCode = parseInt(value.substr(0, 2), 10);
    if (provinciaCode < 1 || provinciaCode > 24) {
      return { 'cedulaEcuatoriana': true }; // Código de provincia inválido
    }

    // Algoritmo de validación para el último dígito
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const verificador = parseInt(value.charAt(9), 10);
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      let valor = parseInt(value.charAt(i), 10) * coeficientes[i];
      if (valor >= 10) {
        valor -= 9;
      }
      suma += valor;
    }

    if ((suma % 10 !== 0) && ((suma + verificador) % 10 !== 0)) {
      return { 'cedulaEcuatoriana': true }; // Dígito verificador inválido
    }

    return null; // El número de cédula es válido
  };
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]:;\"'<>?,./])\S{8,}$/;

    if (!passwordRegex.test(control.value)) {
      return { 'invalidPassword': true };
    }

    return null;
  };
}

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]:;\"'<>?,./])\S{8,}$/;

    if (!passwordRegex.test(control.value)) {
      return { 'invalidUsername': true };
    }

    return null;
  };
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MaskService {

  constructor() { }

  // Aplicar máscara de CPF
  applyCpfMask(value: string): string {
    if (!value) return '';
    
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return numbers.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (numbers.length <= 9) {
      return numbers.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    }
  }

  // Aplicar máscara de CNPJ
  applyCnpjMask(value: string): string {
    if (!value) return '';
    
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 5) {
      return numbers.replace(/(\d{2})(\d+)/, '$1.$2');
    } else if (numbers.length <= 8) {
      return numbers.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (numbers.length <= 12) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5');
    }
  }

  // Aplicar máscara de telefone
  applyPhoneMask(value: string): string {
    if (!value) return '';
    
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return numbers.replace(/(\d{2})(\d+)/, '($1) $2');
    } else if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
    }
  }

  // Remover máscara (apenas números)
  removeMask(value: string): string {
    return value ? value.replace(/\D/g, '') : '';
  }

  // Detectar se é CPF ou CNPJ baseado no tamanho
  detectDocumentType(value: string): 'cpf' | 'cnpj' {
    const numbers = this.removeMask(value);
    return numbers.length <= 11 ? 'cpf' : 'cnpj';
  }

  // Aplicar máscara automática (CPF ou CNPJ)
  applyDocumentMask(value: string): string {
    const type = this.detectDocumentType(value);
    return type === 'cpf' ? this.applyCpfMask(value) : this.applyCnpjMask(value);
  }
}

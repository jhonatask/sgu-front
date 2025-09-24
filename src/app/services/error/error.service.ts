import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private messageService: MessageService) { }

  handleError(error: HttpErrorResponse | any): void {
    let errorMessage = 'Ocorreu um erro inesperado';
    let severity: 'error' | 'warn' | 'info' = 'error';

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Dados inválidos';
          break;
        case 401:
          errorMessage = 'Não autorizado. Faça login novamente';
          severity = 'warn';
          break;
        case 403:
          errorMessage = 'Acesso negado';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflito de dados';
          break;
        case 422:
          errorMessage = error.error?.message || 'Dados inválidos para processamento';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        case 0:
          errorMessage = 'Erro de conexão. Verifique sua internet';
          break;
        default:
          errorMessage = error.error?.message || error.message || 'Erro desconhecido';
      }
    } else if (error?.error) {
      errorMessage = error.error;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    this.messageService.add({
      severity,
      summary: 'Erro',
      detail: errorMessage,
      life: 5000
    });
  }

  handleSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: message,
      life: 3000
    });
  }

  handleWarning(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atenção',
      detail: message,
      life: 4000
    });
  }

  handleInfo(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Informação',
      detail: message,
      life: 3000
    });
  }
}


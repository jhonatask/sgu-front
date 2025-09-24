import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { PaginatedUsersResponse, User } from '../../types/user.type';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UserCadastroComponent } from '../user-cadastro/user-cadastro.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading/loading.service';
import { ErrorService } from '../../services/error/error.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, UserCadastroComponent, ToastModule, ConfirmDialogModule, CommonModule],
  providers: [
    UserService,
    MessageService,
    ConfirmationService,
    LoadingService,
    ErrorService
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  sort: string = 'name,asc';
  loading: boolean = false;
  displayAddEditModal = false;
  selectedUser: User | null = null;
  isLoading$ = this.loadingService.isLoading$;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private loadingService: LoadingService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(event?: any): void {
    this.loading = true;
    this.currentPage = event ? event.first / event.rows : 0;
    this.pageSize = event ? event.rows : 5;
    
    this.userService.getAllUsers(this.currentPage, this.pageSize, this.sort).subscribe({
      next: (data: PaginatedUsersResponse) => {
        this.users = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorService.handleError(error);
      }
    });
  }

  showAddModal(): void {
    this.displayAddEditModal = true;
    this.selectedUser = null;
  }

  hideAddModal(isClosed: boolean): void {
    this.displayAddEditModal = !isClosed;
  }

  saveUserToList(newData: User): void {
    this.users.unshift(newData);
    this.totalElements++;
  }

  showEditModal(user: User): void {
    this.displayAddEditModal = true;
    this.selectedUser = user;
  }

  confirmDelete(user: User): void {
    if (!user.id) {
      this.errorService.handleError('ID do usuário não encontrado');
      return;
    }

    this.confirmationService.confirm({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o usuário ${user.name}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deleteUser(user.id!);
      }
    });
  }

  private deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.errorService.handleSuccess('Usuário excluído com sucesso');
        this.loadUsers();
      },
      error: (error) => {
        this.errorService.handleError(error);
      }
    });
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  onUserSaved(user: User): void {
    if (this.selectedUser) {
      // Update existing user
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users[index] = user;
      }
    } else {
      // Add new user
      this.saveUserToList(user);
    }
    this.displayAddEditModal = false;
    this.selectedUser = null;
  }
}
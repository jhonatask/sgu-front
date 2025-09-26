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
import { AuthService } from '../../services/auth/auth.service';
import { DepartmentService } from '../../services/department/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, UserCadastroComponent, ToastModule, ConfirmDialogModule, CommonModule],
  providers: [
    UserService,
    LoadingService,
    ErrorService
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  departments: any[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  sort: string = 'name,asc';
  loading: boolean = false;
  displayAddEditModal = false;
  selectedUser: User | null = null;
  isLoading$ = this.loadingService.isLoading$;
  
  // Sidebar and navigation
  sidebarCollapsed = false;
  activeSection = 'users';
  
  // Stats
  departmentsCount = 0;
  activeUsers = 0;
  
  // Import
  selectedFile: File | null = null;
  importing = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private loadingService: LoadingService,
    private errorService: ErrorService,
    private authService: AuthService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    // Carregamento inicial sem parâmetros
    this.loadUsers();
    this.loadDepartments();
    this.loadStats();
  }

  loadUsers(event?: any): void {
    this.loading = true;
    
    if (event) {
      // PrimeNG lazy loading: calcular página baseado no 'first'
      this.currentPage = Math.floor(event.first / event.rows);
      this.pageSize = event.rows || 10;
    } else {
      // Carregamento inicial - usar valores padrão
      this.currentPage = 0;
      this.pageSize = 10;
    }
    
    // Debug temporário para verificar se está funcionando
    console.log('Loading users with event:', event);
    console.log('Calculated page:', this.currentPage, 'Page size:', this.pageSize);
    
    this.userService.getAllUsers(this.currentPage, this.pageSize, this.sort).subscribe({
      next: (data: PaginatedUsersResponse) => {
        this.users = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.loading = false;
        
        console.log('Users loaded:', this.users.length, 'Total:', this.totalElements);
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
        
        // Verificar se precisa voltar uma página
        const remainingUsers = this.users.length - 1;
        if (remainingUsers === 0 && this.currentPage > 0) {
          this.currentPage--;
        }
        
        // Recarregar dados
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

  // Sidebar methods
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  getPageTitle(): string {
    switch (this.activeSection) {
      case 'users': return 'Gestão de Usuários';
      case 'departments': return 'Departamentos';
      case 'import': return 'Importar Dados';
      default: return 'Dashboard';
    }
  }

  getPageDescription(): string {
    switch (this.activeSection) {
      case 'users': return 'Gerencie usuários do sistema';
      case 'departments': return 'Organize departamentos';
      case 'import': return 'Importe dados via CSV';
      default: return 'Painel administrativo';
    }
  }

  getUsername(): string {
    return this.authService.getUsername() || 'Usuário';
  }

  // Department methods
  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.departmentsCount = departments.length;
      },
      error: (error) => {
        this.errorService.handleError(error);
      }
    });
  }

  showDepartmentModal(): void {
    // TODO: Implement department modal
    this.errorService.handleInfo('Funcionalidade em desenvolvimento');
  }

  editDepartment(department: any): void {
    // TODO: Implement department edit
    this.errorService.handleInfo('Funcionalidade em desenvolvimento');
  }

  deleteDepartment(department: any): void {
    // TODO: Implement department delete
    this.errorService.handleInfo('Funcionalidade em desenvolvimento');
  }

  // Import methods
  showImportModal(): void {
    // TODO: Implement import modal
    this.errorService.handleInfo('Funcionalidade em desenvolvimento');
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.selectedFile = file;
    } else {
      this.errorService.handleError('Por favor, selecione um arquivo CSV válido');
    }
  }

  importCSVUpload(): void {
    if (!this.selectedFile) {
      this.errorService.handleError('Nenhum arquivo selecionado');
      return;
    }

    this.importing = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.userService.importUsersUpload(formData).subscribe({
      next: (response) => {
        this.importing = false;
        this.errorService.handleSuccess('Usuários importados com sucesso via upload');
        this.loadUsers(); // Recarregar lista
        this.selectedFile = null;
      },
      error: (error) => {
        this.importing = false;
        this.errorService.handleError(error);
      }
    });
  }

  importCSVDirectory(): void {
    this.importing = true;

    this.userService.importUsersDirectory().subscribe({
      next: (response) => {
        this.importing = false;
        this.errorService.handleSuccess('Usuários importados com sucesso do diretório');
        this.loadUsers(); // Recarregar lista
      },
      error: (error) => {
        this.importing = false;
        this.errorService.handleError(error);
      }
    });
  }

  // Stats methods
  loadStats(): void {
    this.activeUsers = this.users.length; // Simplified for now
  }
}
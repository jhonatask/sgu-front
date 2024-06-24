import { Component } from '@angular/core';
import { UserService} from '../../services/user/user.service'
import { PaginatedUsersResponse, User } from '../../types/user.type';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { UserCadastroComponent } from '../user-cadastro/user-cadastro.component';
import { MessageService, ConfirmationService  } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, UserCadastroComponent, ToastModule, ConfirmDialogModule],
  providers: [
    UserService,
    MessageService,
    ConfirmationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  users: User[] = [];
  totalElements!: number;
  totalPages!: number;
  currentPage: number = 0;
  pageSize: number = 5;
  sort: string = 'name,asc';
  loading: boolean = false;
  displayAddEditModal = false;

  selectedUser: any = null;

  constructor(private userService: UserService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router,){}

  ngOnInit() {
    this.getAllUsers();
  }

 getAllUsers(event?: any): void {
    this.loading = true;
    this.currentPage = event ? event.first / event.rows : 0;
    this.pageSize = event ? event.rows : 5;
    this.userService.getAllUsers(this.currentPage, this.pageSize, this.sort).subscribe(
    (data: PaginatedUsersResponse) => {
        this.users = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.loading = false;
    },
    errorResponse => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: errorResponse.error })
      }
   );
 }

 showAddModal(){
  this.displayAddEditModal = true;
  this.selectedUser = null;
 }

 hideAddModal(isClosed: boolean){
  this.displayAddEditModal = !isClosed;
 }

 saveUserToList(newData: any){
   this.users.unshift(newData);
 }

 showEditModel(user: User){
    this.displayAddEditModal = true;
    this.selectedUser = user;
 }

 confirmDelete(user: string) {
  this.confirmationService.confirm({
    header: 'Delete Confirmation',
    message: 'Você tem certeza que deseja excluir este usuário?',
    icon: 'pi pi-info-circle',
    acceptButtonStyleClass:"p-button-danger p-button-text",
    rejectButtonStyleClass:"p-button-text p-button-text",
    acceptIcon:"none",
    rejectIcon:"none",
    accept: () => {
      this.onDeletUser(user);
    }
  });
}

 onDeletUser(user: string){
    this.userService.deleteUser(user).subscribe(
      data => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario Deletado' })
        this.getAllUsers();
      },
      responseError =>{

        this.messageService.add({ severity: 'error', summary: 'Error', detail: responseError.error })
      }
    );
 }

 logout() {
  sessionStorage.removeItem('auth-token');
  this.router.navigate(['/login']);
}


}

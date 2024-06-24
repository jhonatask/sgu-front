import { Component , Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { UserService } from '../../services/user/user.service';
import { DepartmentService } from '../../services/department/department.service';
import { ToastModule } from 'primeng/toast';
import { User } from '../../types/user.type';


interface UserForm {
  id: FormControl,
  name: FormControl,
  email: FormControl,
  telefone: FormControl,
  cpforcnpj: FormControl,
  department: FormControl
}
@Component({
  selector: 'app-user-cadastro',
  standalone: true,
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, CommonModule, DropdownModule, ToastModule],
  providers: [
    UserService,
    MessageService,
    DepartmentService
  ],
  templateUrl: './user-cadastro.component.html',
  styleUrl: './user-cadastro.component.scss'
})
export class UserCadastroComponent implements OnInit, OnChanges {
  @Input() displayAddEditModal: boolean = true;
  @Input() selectedUser: any = null
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAdd: EventEmitter<any> = new EventEmitter<any>();

  userForm!: FormGroup<UserForm>;
  departamentos: any[] = [];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private departmentService: DepartmentService
  ){
    this.userForm = new FormGroup({
      id: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      cpforcnpj: new FormControl('', [Validators.required]),
      department: new FormControl(null, [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  ngOnChanges(): void {
    if(this.selectedUser){
      this.userForm.patchValue({
        ...this.selectedUser,
        department: this.selectedUser.department.id 
      });
    }else{
      this.userForm.reset();
    }
  }

  get email(){
    return this.userForm.controls['email'];
  }

  get name(){
    return this.userForm.controls['name'];
  }

  get telefone(){
    return this.userForm.controls['telefone'];
  }
  get cpforcnpj(){
    return this.userForm.controls['cpforcnpj'];
  }
  get department(){
    return this.userForm.controls['department'];
  }

  

  loadDepartments(): void {
    this.departmentService.getDepartaments().subscribe(
      (response) => {
        this.departamentos = response.map((dept: { name: any; id: any; }) => ({ label: dept.name, value: dept.id }));
        if (this.selectedUser) {
          this.userForm.patchValue({
            department: this.selectedUser.department.id 
          });
        }
      },
      (errorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorResponse.error })
      }
    );
  }

  onCloseModal(){
    this.userForm.reset();
    this.clickClose.emit(true);
  }

  

  onSaveUserModal(){
    this.userService.createUser(this.userForm.value).subscribe(
      response => {
        this.clickAdd.emit(response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cadastro realizado com sucesso' });
        this.onCloseModal();
      },
      errorResponse => {
        console.log(errorResponse)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorResponse.error })
      }
      
    );
  }

  onUpdateUser(){
    this.userService.updateUser(this.userForm.value).subscribe(
      response => {
        this.clickAdd.emit(response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cadastro Atualizado com sucesso' });
        this.onCloseModal();
      },
      errorResponse => {
        console.log(errorResponse)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorResponse.error })
      }
      
    );
  }


 

}

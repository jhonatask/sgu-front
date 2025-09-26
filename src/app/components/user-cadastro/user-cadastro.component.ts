import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { UserService } from '../../services/user/user.service';
import { DepartmentService } from '../../services/department/department.service';
import { ToastModule } from 'primeng/toast';
import { User, CreateUserRequest, UpdateUserRequest, UserFormData } from '../../types/user.type';
import { Department } from '../../types/departament.type';
import { LoadingService } from '../../services/loading/loading.service';
import { ErrorService } from '../../services/error/error.service';
import { MaskService } from '../../services/mask/mask.service';

interface UserForm {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  telefone: FormControl<string | null>;
  cpforcnpj: FormControl<string | null>;
  department: FormControl<string | null>;
}

@Component({
  selector: 'app-user-cadastro',
  standalone: true,
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, CommonModule, DropdownModule, ToastModule],
  providers: [
    UserService,
    MessageService,
    DepartmentService,
    LoadingService,
    ErrorService,
    MaskService
  ],
  templateUrl: './user-cadastro.component.html',
  styleUrl: './user-cadastro.component.scss'
})
export class UserCadastroComponent implements OnInit, OnChanges {

  @Input() displayAddEditModal: boolean = true;
  @Input() selectedUser: User | null = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAdd: EventEmitter<User> = new EventEmitter<User>();

  userForm!: FormGroup<UserForm>;
  departments: { label: string; value: string }[] = [];
  isLoading$ = this.loadingService.isLoading$;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private loadingService: LoadingService,
    private errorService: ErrorService,
    private maskService: MaskService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser'] && this.selectedUser) {
      // Aplicar máscaras nos dados existentes
      const maskedTelefone = this.maskService.applyPhoneMask(this.selectedUser.telefone);
      const maskedDocument = this.maskService.applyDocumentMask(this.selectedUser.cpforcnpj);
      
      this.userForm.patchValue({
        id: this.selectedUser.id || null,
        name: this.selectedUser.name,
        email: this.selectedUser.email,
        telefone: maskedTelefone,
        cpforcnpj: maskedDocument,
        department: this.selectedUser.department?.id || null
      });
    } else if (changes['selectedUser'] && !this.selectedUser) {
      this.resetForm();
    }
  }

  private initializeForm(): void {
    this.userForm = new FormGroup<UserForm>({
      id: new FormControl(null as any),
      name: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
      email: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required, Validators.email] }),
      telefone: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)] }),
      cpforcnpj: new FormControl('', [Validators.required, Validators.minLength(14)]), // Mínimo 14 para CPF com máscara
      department: new FormControl(null, [Validators.required])
    });
  }

  get email() {
    return this.userForm.controls['email'];
  }

  get name() {
    return this.userForm.controls['name'];
  }

  get telefone() {
    return this.userForm.controls['telefone'];
  }

  get cpforcnpj() {
    return this.userForm.controls['cpforcnpj'];
  }

  get department() {
    return this.userForm.controls['department'];
  }


  get isEditMode(): boolean {
    return !!this.selectedUser?.id;
  }

  // Métodos para aplicar máscaras
  onPhoneInput(event: any): void {
    const value = event.target.value;
    const maskedValue = this.maskService.applyPhoneMask(value);
    this.telefone.setValue(maskedValue);
  }

  onDocumentInput(event: any): void {
    const value = event.target.value;
    const maskedValue = this.maskService.applyDocumentMask(value);
    this.cpforcnpj.setValue(maskedValue);
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (response: Department[]) => {
        // Transformar para o formato esperado pelo PrimeNG Dropdown
        this.departments = response.map(dept => ({
          label: dept.name,
          value: dept.id
        }));
        if (this.selectedUser?.department?.id) {
          this.userForm.patchValue({
            department: this.selectedUser.department.id
          });
        }
      },
      error: (error) => {
        this.errorService.handleError(error);
      }
    });
  }

  onCloseModal(): void {
    this.resetForm();
    this.clickClose.emit(true);
  }

  private resetForm(): void {
    this.userForm.reset();
    this.selectedUser = null;
  }

  onSaveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.errorService.handleError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const formData = this.userForm.value as UserFormData;
    
    if (this.isEditMode) {
      this.updateUser(formData);
    } else {
      this.createUser(formData);
    }
  }

  private createUser(formData: UserFormData): void {
    const createRequest: CreateUserRequest = {
      name: formData.name,
      email: formData.email,
      telefone: this.maskService.removeMask(formData.telefone), // Remove máscara
      cpforcnpj: this.maskService.removeMask(formData.cpforcnpj), // Remove máscara
      department: formData.department,
      password: ''
    };

    this.userService.createUser(createRequest).subscribe({
      next: (response: User) => {
        this.errorService.handleSuccess('Usuário criado com sucesso');
        this.clickAdd.emit(response);
        this.onCloseModal();
      },
      error: (error) => {
        this.errorService.handleError(error);
      }
    });
  }

  private updateUser(formData: UserFormData): void {
    if (!formData.id) {
      this.errorService.handleError('ID do usuário não encontrado');
      return;
    }

    const updateRequest: UpdateUserRequest = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      telefone: this.maskService.removeMask(formData.telefone), // Remove máscara
      cpforcnpj: this.maskService.removeMask(formData.cpforcnpj), // Remove máscara
      department: formData.department
    };

    this.userService.updateUser(updateRequest).subscribe({
      next: (response: User) => {
        this.errorService.handleSuccess('Usuário atualizado com sucesso');
        this.clickAdd.emit(response);
        this.onCloseModal();
      },
      error: (error) => {
        this.errorService.handleError(error);
      }
    });
  }
}
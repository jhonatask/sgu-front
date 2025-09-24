# SGU Frontend

Sistema de Gestão de Usuários - Frontend Angular

## 🚀 Tecnologias Utilizadas

- **Angular 17** - Framework principal
- **TypeScript** - Linguagem de programação
- **PrimeNG** - Biblioteca de componentes UI
- **RxJS** - Programação reativa
- **SCSS** - Pré-processador CSS
- **Jasmine & Karma** - Testes unitários
- **ESLint & Prettier** - Linting e formatação

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes da aplicação
│   │   ├── login/           # Componente de login
│   │   ├── user-list/       # Lista de usuários
│   │   ├── user-cadastro/   # Cadastro/edição de usuários
│   │   └── loading/         # Componente de loading global
│   ├── services/            # Serviços da aplicação
│   │   ├── auth/            # Autenticação
│   │   ├── user/            # Gestão de usuários
│   │   ├── department/      # Gestão de departamentos
│   │   ├── error/           # Tratamento de erros
│   │   └── loading/         # Estados de loading
│   ├── guards/              # Guards de rota
│   ├── interceptors/        # Interceptors HTTP
│   ├── types/              # Definições de tipos TypeScript
│   └── environments/       # Configurações de ambiente
```

## 🛠️ Funcionalidades Implementadas

### ✅ Autenticação
- Login com validação de formulário
- Refresh token automático
- Logout seguro
- Guard de autenticação

### ✅ Gestão de Usuários
- Listagem paginada
- Criação de usuários
- Edição de usuários
- Exclusão com confirmação
- Validação de formulários

### ✅ Tratamento de Erros
- Interceptor global de erros
- Mensagens de erro centralizadas
- Diferentes tipos de notificação

### ✅ Loading States
- Indicador global de carregamento
- Loading por requisição
- UX melhorada

### ✅ Performance
- Lazy loading de rotas
- Cache de dados
- OnPush change detection

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd sgu-front

# Instale as dependências
npm install

# Execute o projeto
npm start
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start

# Build para produção
npm run build

# Testes
npm test
npm run test:ci
npm run test:coverage

# Linting
npm run lint
npm run lint:fix
```

## 🧪 Testes

O projeto inclui testes unitários para:
- Serviços (AuthService, UserService, etc.)
- Componentes (LoginComponent, etc.)
- Guards e Interceptors

Execute os testes:
```bash
npm test
```

## 📋 Melhorias Implementadas

### 🔧 Arquitetura
- ✅ Standalone components
- ✅ Lazy loading de rotas
- ✅ Interceptors para loading e erros
- ✅ Serviços centralizados

### 🔒 Segurança
- ✅ Refresh token
- ✅ Validação de token
- ✅ Logout automático em caso de erro 401
- ✅ Guard de autenticação melhorado

### 🎨 UX/UI
- ✅ Loading states globais
- ✅ Mensagens de erro/sucesso centralizadas
- ✅ Validação de formulários em tempo real
- ✅ Confirmações para ações destrutivas

### ⚡ Performance
- ✅ Cache de dados
- ✅ Lazy loading
- ✅ OnPush change detection
- ✅ Otimização de bundle

### 🧪 Qualidade
- ✅ Testes unitários
- ✅ ESLint e Prettier
- ✅ Tipagem TypeScript rigorosa
- ✅ Tratamento de erros robusto

## 🔧 Configuração de Ambiente

### Desenvolvimento
```typescript
// src/app/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

### Produção
```typescript
// src/app/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.suaaplicacao.com'
};
```

## 📝 Próximos Passos

- [ ] Implementar testes E2E
- [ ] Adicionar PWA
- [ ] Implementar internacionalização
- [ ] Adicionar mais validações
- [ ] Implementar filtros avançados
- [ ] Adicionar relatórios

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
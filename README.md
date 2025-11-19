# SF Festas - Sistema de Reservas

Este é um sistema de gerenciamento de reservas para casa de festas, desenvolvido com React, Vite, Tailwind CSS e Firebase.

## Pré-requisitos

- **Node.js**: Você precisa ter o Node.js instalado. Baixe a versão LTS em [nodejs.org](https://nodejs.org/).

## Configuração

1.  **Instalar Dependências**:
    Abra o terminal na pasta do projeto e execute:
    ```bash
    npm install
    ```

2.  **Configurar Firebase**:
    - Abra o arquivo `src/firebaseConfig.js`.
    - Substitua os valores de placeholder (`YOUR_API_KEY`, etc.) pelas credenciais do seu projeto Firebase.
    - Consulte o arquivo `FIREBASE_SETUP.md` para mais detalhes sobre como criar o projeto no Firebase.

## Como Rodar

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`.

## Funcionalidades

- **Nova Reserva**: Formulário para salvar dados do cliente, data, horário e convidados.
- **Lista de Reservas**: Visualização das reservas salvas em tempo real.
- **WhatsApp**: Botão para enviar mensagem de confirmação automática para o cliente via WhatsApp.

# Controle de Viagens - Kalfritec

Sistema de controle de viagens por KM desenvolvido para a Kalfritec.

## 🚀 Funcionalidades

- ✅ Registro de viagens com motorista, veículo, placa e KM
- ✅ Gerenciamento de motoristas, veículos e placas
- ✅ Compartilhamento via WhatsApp
- ✅ Cópia de dados para clipboard
- ✅ Interface responsiva para mobile
- ✅ Visualização detalhada em modal

## 🛠️ Tecnologias

- React 19
- TypeScript
- Vite
- Firebase (Firestore)
- Tailwind CSS

## 📱 Como usar

1. **Adicionar Motorista:** Clique no ícone "+" ao lado do campo motorista
2. **Adicionar Veículo:** Clique no ícone "+" ao lado do campo veículo  
3. **Adicionar Placa:** Clique no ícone "+" ao lado do campo placa
4. **Registrar Viagem:** Preencha os dados e clique em "Adicionar Viagem"
5. **Visualizar Detalhes:** Clique em qualquer viagem da lista
6. **Compartilhar:** Use os ícones de WhatsApp ou copiar

## 🚀 Deploy

### GitHub Pages (Automático)

O projeto está configurado para deploy automático no GitHub Pages:

1. Faça push para a branch `main`
2. O GitHub Actions fará o build e deploy automaticamente
3. Acesse: `https://alyssonhk.github.io/controlekm/`

### Deploy Manual

```bash
# Instalar dependências
npm install

# Build do projeto
npm run build

# Os arquivos estarão na pasta /dist
```

## 🔧 Configuração do Firebase

1. Crie um projeto no Firebase Console
2. Ative o Firestore Database
3. Configure as regras de segurança
4. Atualize as credenciais em `firebase.ts`

## 📝 Licença

Desenvolvido por Alysson Krombauer

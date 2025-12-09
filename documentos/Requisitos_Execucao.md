# Guia de Requisitos e Execução Local - SIMRE-CEAVS

Este documento detalha os pré-requisitos de software e o passo a passo para executar o sistema **SIMRE-CEAVS** em ambiente local de desenvolvimento.

O sistema é composto por:
1.  **Frontend:** React (Vite/TypeScript).
2.  **Backend:** Python (FastAPI).
3.  **Banco de Dados:** Microsoft SQL Server.

---

## 1. Pré-requisitos de Software

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas no seu ambiente:

### A. Sistema Operacional
*   **Recomendado:** Windows 10 ou 11 (Devido à facilidade de configuração do SQL Server e Drivers ODBC).
*   **Alternativo:** Linux/MacOS (Requer configuração de containers Docker para o SQL Server ou Drivers ODBC unixODBC configurados manualmente).

### B. Linguagens e Runtimes
1.  **Node.js** (Versão 18 ou superior)
    *   Necessário para rodar o Frontend.
    *   Download: [nodejs.org](https://nodejs.org/)
2.  **Python** (Versão 3.10 ou superior)
    *   Necessário para rodar o Backend API.
    *   Download: [python.org](https://www.python.org/)
    *   *Nota:* Ao instalar no Windows, marque a opção **"Add Python to PATH"**.

### C. Banco de Dados e Drivers
1.  **Microsoft SQL Server** (Edição Express ou Developer 2019+)
    *   Download: [Microsoft SQL Server Downloads](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
2.  **ODBC Driver for SQL Server** (Versão 17 ou 18)
    *   Essencial para que o Python (`pyodbc`) consiga se comunicar com o banco de dados.
    *   Geralmente instalado junto com o SQL Server Management Studio (SSMS), mas pode ser baixado separadamente [aqui](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server).

### D. Ferramentas Auxiliares
*   **Git:** Para clonagem do repositório.
*   **VS Code:** Editor de código recomendado.

---

## 2. Configuração do Banco de Dados

1.  Abra o **SQL Server Management Studio (SSMS)** ou ferramenta equivalente (DBeaver, Azure Data Studio).
2.  Conecte-se à sua instância local (geralmente `localhost`, `.\SQLEXPRESS` ou `(local)`).
3.  Abra o arquivo de especificação técnica localizado em:
    *   `documentos/Especificacao_Tecnica_Banco_Dados.html`
4.  Copie o **Script SQL** contido na seção "2. Modelo Físico".
5.  Execute o script no seu banco de dados para criar as tabelas (LOGIN, RUMOR_EVENTO, etc.) e o banco `SIMRECEAVS`.
6.  **Importante:** Insira um usuário administrador inicial manualmente na tabela `LOGIN` para conseguir acessar o sistema:
    ```sql
    -- A senha deve ser um hash BCrypt válido. 
    -- Para testes (senha '123456'): 
    -- Hash: $2a$10$wS2a./L.0oU3.I6.rM6.u.j8.u.u.u.u.u.u.u.u.u.u.u
    
    INSERT INTO LOGIN (NOME, EMAIL, LOGIN, SENHA, PERFIL, INATIVO)
    VALUES ('Administrador', 'admin@anvisa.gov.br', 'admin', '$2a$10$X7V.j.j.j.j.j.j.j.j.j.j.j.j.j.j.j.j.j.j.j.j.j.j', 'ADMIN', 0);
    ```

---

## 3. Configuração e Execução do Backend (Python)

1.  Abra o terminal na pasta `backend`:
    ```bash
    cd backend
    ```

2.  Crie um ambiente virtual (Recomendado para isolar dependências):
    ```bash
    python -m venv venv
    ```

3.  Ative o ambiente virtual:
    *   **Windows (CMD):** `venv\Scripts\activate`
    *   **Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`
    *   **Linux/Mac:** `source venv/bin/activate`

4.  Instale as dependências do projeto:
    ```bash
    pip install -r requirements.txt
    ```

5.  Configure as variáveis de ambiente:
    *   Crie um arquivo `.env` dentro da pasta `backend`.
    *   Adicione as configurações do seu banco (Exemplo):
        ```env
        DB_SERVER=localhost\SQLEXPRESS  # Ou apenas localhost
        DB_NAME=SIMRECEAVS
        DB_USER=seu_usuario_sql
        DB_PASSWORD=sua_senha_sql
        JWT_SECRET=sua_chave_secreta_super_segura
        ```
    *   *Nota:* Se estiver usando Autenticação do Windows (Trusted Connection), a string de conexão no `database.py` precisará ser ajustada para `Trusted_Connection=yes`.

6.  Inicie o servidor API:
    ```bash
    uvicorn main:app --reload --port 3001
    ```
    *   O servidor rodará em: `http://localhost:3001`
    *   A documentação automática (Swagger) estará em: `http://localhost:3001/docs`

---

## 4. Configuração e Execução do Frontend (React)

1.  Abra um **novo** terminal na raiz do projeto (fora da pasta backend).

2.  Instale as dependências do Node.js:
    ```bash
    npm install
    ```

3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

4.  O sistema estará acessível em: `http://localhost:5173` (ou porta indicada no terminal).

---

## 5. Resolução de Problemas Comuns

### Erro: `pyodbc.Error: ('08001', ... SSL Provider ...)`
*   **Causa:** O driver ODBC mais recente exige criptografia por padrão e certificados válidos.
*   **Solução:** No arquivo `backend/database.py`, certifique-se de que a string de conexão ou os argumentos de conexão possuam `TrustServerCertificate=yes` ou `Encrypt=no` para ambiente local.

### Erro: `Module not found` no Python
*   Certifique-se de que ativou o ambiente virtual (`venv`) antes de rodar o comando `pip install`.

### Erro de Conexão no Frontend
*   Verifique se o backend está rodando na porta 3001.
*   Verifique se não há bloqueios de firewall/antivírus na porta 3001.

# Especificação Técnica do Sistema: Painel de Controle de Monitoramento e Avaliação de Risco

| Metadado | Detalhe |
| :--- | :--- |
| **Nome do Projeto** | Painel de Controle de Monitoramento (PCM) - SIMRE-CEAVS |
| **Versão** | 1.0.0 |
| **Desenvolvedor Responsável** | **Estênio Couto Borges Júnior** |
| **Data da Emissão** | 19 de Novembro de 2025 |
| **Status** | Em Desenvolvimento / Homologação |
| **Tecnologia Principal** | React 19 (Frontend) / Node.js (Backend) / SQL Server (DB) |

---

## 1. Introdução e Objetivo

O **Painel de Controle de Monitoramento** (SIMRE-CEAVS) é uma solução tecnológica desenvolvida para modernizar e centralizar a gestão de eventos de saúde pública, rumores sanitários e comunicações de risco. 

O objetivo principal do software é fornecer às equipes de vigilância (ex: ANVISA/CIEVS) uma ferramenta robusta para:
1.  **Captura de Dados:** Registro padronizado de eventos e notificações.
2.  **Análise de Risco:** Aplicação automatizada de matrizes de risco baseadas na metodologia STAR.
3.  **Rastreabilidade:** Controle total de quem cadastrou, editou e verificou as informações.
4.  **Tomada de Decisão:** Geração de relatórios estratégicos para comitês (CMA).

## 2. Arquitetura do Sistema

O sistema utiliza uma arquitetura **Cliente-Servidor** desacoplada (RESTful API), garantindo escalabilidade e facilidade de manutenção.

### 2.1. Stack Tecnológico

*   **Frontend (Interface do Usuário):**
    *   **Framework:** React v19.
    *   **Linguagem:** TypeScript.
    *   **Build Tool:** Vite.
    *   **Estilização:** Tailwind CSS.
    *   **Visualização de Dados:** Recharts (Gráficos) e Lucide React (Ícones).

*   **Backend (API & Regra de Negócio):**
    *   **Runtime:** Node.js.
    *   **Framework:** Express.js.
    *   **Segurança:** JWT (JSON Web Tokens) para sessão stateless e BCrypt para hash de senhas.
    *   **Driver de Banco:** `mssql` (Driver oficial Microsoft).

*   **Banco de Dados:**
    *   **SGBD:** Microsoft SQL Server (2019+).
    *   **Modelagem:** Relacional (Normalização até 3FN).

### 2.2. Mecanismo de Resiliência (Fallback)
O sistema possui uma arquitetura híbrida. O frontend detecta automaticamente falhas na conexão com a API.
*   **Modo Online:** Consome dados em tempo real do SQL Server.
*   **Modo Demonstração/Offline:** Em caso de falha de rede ou configuração (`ESOCKET`), o sistema utiliza dados locais (`mockData`) para permitir a visualização e testes de interface sem interrupção.

## 3. Funcionalidades Detalhadas

### 3.1. Controle de Acesso (RBAC)
*   **ADMIN (Administrador):** Acesso irrestrito. Capacidade exclusiva de cadastrar novos usuários e visualizar logs de auditoria.
*   **USER (Operador):** Acesso aos módulos de cadastro e relatórios operacionais.

### 3.2. Módulo: Monitoramento de Rumor e Evento
*   **Entrada de Dados:** Título, descrição, geolocalização (País/Estado/Cidade), fonte notificadora e natureza.
*   **IDU (Identificador Único):** Geração automática de identificador temporal (`DDMMYYYYHHmmss`).
*   **Timeline:** Registro cronológico de atualizações do evento.
*   **Verificação de Dados (Dupla Checagem):**
    *   Funcionalidade exclusiva do modo de edição.
    *   Permite validar a veracidade dos dados com registro de data e observação auditável.

### 3.3. Módulo: Matriz de Risco Automatizada
*   **Cálculo STAR:**
    1.  `Impacto` = Média (Gravidade, Vulnerabilidade, Capacidade).
    2.  `Risco` = Impacto + Probabilidade.
*   **Classificação:** Conversão automática para escala qualitativa (Muito Baixo a Muito Alto).
*   **Gatilho CMA:** Indicação automática ou manual para pauta em comitê.

### 3.4. Módulo: Comunicação de Risco
*   Registro de dados fiscais e regulatórios (CNPJ, Produto, Lote, Resolução).

### 3.5. Relatórios Gerenciais
*   **Geral:** Listagem com filtros dinâmicos e status visual.
*   **Verificados:** Auditoria de eventos que passaram pela dupla checagem.
*   **Risco Detalhado:** Ficha técnica completa para impressão, contendo análise de ameaça, áreas relacionadas (baseado na natureza) e recomendações.

## 4. Modelo de Dados (Principais Tabelas)

*   `LOGIN`: Credenciais e Perfil.
*   `RUMOR_EVENTO`: Dados centrais do evento.
*   `RISCO`: Cálculos da matriz.
*   `VERIFICACAO`: Status de qualidade e validação.
*   `ATUALIZACAO`: Histórico de evolução.
*   `AREA` / `NATUREZA`: Tabelas de domínio (Muitos-para-Muitos).

## 5. Procedimentos de Instalação

### Backend
1.  Acesse `/backend`.
2.  `npm install`
3.  Configure `.env` com credenciais do SQL Server.
4.  `npm run dev`

### Frontend
1.  Raiz do projeto.
2.  `npm install`
3.  `npm run dev`
4.  Acesse `http://localhost:5173`.

---

**Nota de Copyright:**
Software desenvolvido por **Estênio Couto Borges Júnior**, versão 1.0.0. Todos os direitos reservados à organização contratante (ANVISA).
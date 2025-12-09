
import React from 'react';

export type PageKey = 
  'dashboard' |
  'cadastro-monitoramento' |
  'cadastro-natureza' |
  'cadastro-areas-localizacao' |
  'cadastro-representantes' |
  'cadastro-icmra' |
  'cadastro-usuarios' |
  'cadastro-status' |
  'relatorio-monitoramento' |
  'relatorio-representantes' |
  'relatorio-monitoramentos-verificados' |
  'relatorio-nao-verificados' |
  'relatorio-cma' |
  'relatorio-risco-detalhado';

export interface MenuItem {
  key: PageKey;
  label: string;
  // FIX: Add React import to use React.ComponentType
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean; // New property for RBAC
}

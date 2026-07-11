// src/hooks/usePermissions.js
// Hook para verificar permissões do usuário logado a partir do JWT

import { useAuth } from '../contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();
  const permissoes = user?.permissoes || [];

  /** Verifica se o usuário tem uma permissão específica */
  const has = (entidade, acao) =>
    permissoes.some(p => p.entidade === entidade && p.acao === acao);

  /** Administrador do sistema: acesso total + painel de corporações */
  const isAdmin = has('Corporacao', 'Cadastrar');

  /** Coordenador Geral: pode gerenciar usuários e perfis da corporação */
  const canManageUsers = isAdmin || has('Usuario', 'Cadastrar');

  /** Chefe de Equipe ou superior: pode validar/devolver ocorrências */
  const canValidateOcorrencias = isAdmin || canManageUsers || has('Ocorrencia', 'Editar');

  /** Coordenador ou superior: pode gerenciar hospitais (dados mestre da corporação) */
  const canManageHospitais = canManageUsers;

  return {
    has,
    isAdmin,
    canManageUsers,
    canValidateOcorrencias,
    canManageHospitais,
  };
}

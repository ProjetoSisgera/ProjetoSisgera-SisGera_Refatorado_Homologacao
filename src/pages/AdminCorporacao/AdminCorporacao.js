// src/pages/AdminCorporacao/AdminCorporacao.js

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { corporacaoApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './AdminCorporacao.css';

const EMPTY_FORM = {
  nome: '',
  cnpj: '',
  email: '',
  telefone: '',
  endereco: '',
  numero: '',
  bairro: '',
  cidade: '',
  cep: '',
};

export default function AdminCorporacao() {
  const navigate = useNavigate();
  const { selectCorporacao } = useAuth();

  const [corporacoes, setCorporacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado do modal de criação/edição
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Estado de confirmação de exclusão
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, corporacao: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadCorporacoes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await corporacaoApi.list();
      // Suporta: array direto, { Corporacoes: [...] } (API atual) ou { corporacoes: [...] }
      setCorporacoes(
        Array.isArray(result)
          ? result
          : (result?.Corporacoes ?? result?.corporacoes ?? [])
      );
    } catch (err) {
      setError('Não foi possível carregar as corporações. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCorporacoes();
  }, [loadCorporacoes]);

  // ---- Handlers do modal ----
  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setModal({ open: true, mode: 'create', data: null });
  };

  const openEditModal = (corporacao) => {
    setForm({
      nome:     corporacao.nome     || '',
      cnpj:     corporacao.cnpj     || '',
      email:    corporacao.email    || '',
      telefone: corporacao.telefone || '',
      endereco: corporacao.endereco || '',
      numero:   corporacao.numero   || '',
      bairro:   corporacao.bairro   || '',
      cidade:   corporacao.cidade   || '',
      cep:      corporacao.cep      || '',
    });
    setFormError('');
    setModal({ open: true, mode: 'edit', data: corporacao });
  };

  const closeModal = () => {
    if (formLoading) return;
    setModal({ open: false, mode: 'create', data: null });
  };

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError) setFormError('');
  };

  // Sanitiza o payload antes de enviar: converte tipos e remove strings vazias
  const buildPayload = () => ({
    nome:     form.nome.trim()     || undefined,
    cnpj:     form.cnpj.trim()     || undefined,
    email:    form.email.trim()    || undefined,
    telefone: form.telefone.trim() || undefined,
    endereco: form.endereco.trim() || undefined,
    // numero é Int? no banco — converte ou omite
    numero:   form.numero.trim() ? parseInt(form.numero.trim(), 10) : undefined,
    bairro:   form.bairro.trim()   || undefined,
    cidade:   form.cidade.trim()   || undefined,
    cep:      form.cep.trim()      || undefined,
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      setFormError('O nome da corporação é obrigatório.');
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      const payload = buildPayload();
      if (modal.mode === 'create') {
        await corporacaoApi.create(payload);
      } else {
        await corporacaoApi.update({ idCorporacao: modal.data.idCorporacao, ...payload });
      }
      await loadCorporacoes();
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Erro ao salvar corporação. Tente novamente.');
    } finally {
      setFormLoading(false);
    }
  };

  // ---- Handlers de exclusão ----
  const openDeleteConfirm = (corporacao) => {
    setDeleteError('');
    setDeleteConfirm({ open: true, corporacao });
  };

  const closeDeleteConfirm = () => {
    if (deleteLoading) return;
    setDeleteConfirm({ open: false, corporacao: null });
    setDeleteError('');
  };

  const handleDelete = async () => {
    if (!deleteConfirm.corporacao) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await corporacaoApi.delete(deleteConfirm.corporacao.idCorporacao);
      await loadCorporacoes();
      closeDeleteConfirm();
    } catch (err) {
      setDeleteError(err.message || 'Erro ao excluir corporação.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---- Acessar corporação ----
  const handleAccess = (corporacao) => {
    selectCorporacao(corporacao);
    navigate('/');
  };

  return (
    <div className="main-content ac-page">

      {/* Cabeçalho da Página */}
      <div className="ac-header">
        <div className="ac-header__info">
          <nav className="ac-breadcrumb" aria-label="Navegação">
            <FontAwesomeIcon icon="shield-halved" />
            <span>Administração</span>
            <span className="ac-breadcrumb__sep">/</span>
            <span className="ac-breadcrumb__current">Corporações</span>
          </nav>
          <h1 className="ac-title">Gerenciar Corporações</h1>
          <p className="ac-subtitle">Administre as corporações cadastradas no sistema SisGera.</p>
        </div>
        <button className="btn-primary ac-btn-new" onClick={openCreateModal}>
          <FontAwesomeIcon icon="plus" />
          Nova Corporação
        </button>
      </div>

      {/* Card de Estatística */}
      <div className="ac-stats">
        <div className="ac-stat-card">
          <div className="ac-stat-icon">
            <FontAwesomeIcon icon="building" />
          </div>
          <div className="ac-stat-body">
            <span className="ac-stat-value">{loading ? '—' : corporacoes.length}</span>
            <span className="ac-stat-label">Corporações Cadastradas</span>
          </div>
        </div>
      </div>

      {/* Painel Principal */}
      <div className="panel">
        <div className="ac-panel-header">
          <h2>Lista de Corporações</h2>
          <button
            className="ac-refresh-btn"
            onClick={loadCorporacoes}
            disabled={loading}
            title="Atualizar lista"
          >
            <FontAwesomeIcon icon="sync" className={loading ? 'ac-spin' : ''} />
          </button>
        </div>

        {/* Erro de carregamento */}
        {error && (
          <div className="ac-error-bar">
            <FontAwesomeIcon icon="triangle-exclamation" />
            <span>{error}</span>
            <button onClick={loadCorporacoes} className="ac-error-retry">
              Tentar novamente
            </button>
          </div>
        )}

        {/* Estado: carregando */}
        {loading && !error && (
          <div className="ac-state-center">
            <span className="ac-spinner" />
            <span>Carregando corporações...</span>
          </div>
        )}

        {/* Estado: lista vazia */}
        {!loading && !error && corporacoes.length === 0 && (
          <div className="ac-state-empty">
            <FontAwesomeIcon icon="building" className="ac-empty-icon" />
            <h3>Nenhuma corporação cadastrada</h3>
            <p>Clique no botão abaixo para adicionar a primeira corporação.</p>
            <button className="btn-primary" onClick={openCreateModal}>
              <FontAwesomeIcon icon="plus" />
              Adicionar Corporação
            </button>
          </div>
        )}

        {/* Tabela de corporações */}
        {!loading && corporacoes.length > 0 && (
          <div className="ac-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome da Corporação</th>
                  <th>CNPJ</th>
                  <th>Telefone</th>
                  <th>Cidade</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {corporacoes.map((corp) => (
                  <tr key={corp.idCorporacao}>
                    <td>
                      <span className="ac-corp-id">#{corp.idCorporacao}</span>
                    </td>
                    <td>
                      <div className="ac-corp-name">
                        <div className="ac-corp-avatar">
                          {corp.nome?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <strong>{corp.nome}</strong>
                          {corp.email && <small>{corp.email}</small>}
                        </div>
                      </div>
                    </td>
                    <td className="ac-cell-secondary">{corp.cnpj || '—'}</td>
                    <td className="ac-cell-secondary">{corp.telefone || '—'}</td>
                    <td className="ac-cell-secondary">{corp.cidade || '—'}</td>
                    <td>
                      <div className="ac-actions">
                        <button
                          className="ac-action ac-action--access"
                          onClick={() => handleAccess(corp)}
                          title="Acessar esta corporação"
                        >
                          <FontAwesomeIcon icon="arrow-right" />
                          Acessar
                        </button>
                        <button
                          className="ac-action ac-action--edit"
                          onClick={() => openEditModal(corp)}
                          title="Editar corporação"
                        >
                          <FontAwesomeIcon icon="pencil" />
                        </button>
                        <button
                          className="ac-action ac-action--delete"
                          onClick={() => openDeleteConfirm(corp)}
                          title="Excluir corporação"
                        >
                          <FontAwesomeIcon icon="trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== Modal de Criar / Editar ===== */}
      {modal.open && (
        <div className="ac-overlay" onClick={closeModal}>
          <div className="ac-modal" onClick={e => e.stopPropagation()}>

            <div className="ac-modal__head">
              <h3>
                <FontAwesomeIcon icon={modal.mode === 'create' ? 'plus' : 'pencil'} />
                {modal.mode === 'create' ? 'Nova Corporação' : 'Editar Corporação'}
              </h3>
              <button className="ac-modal__close" onClick={closeModal} aria-label="Fechar">
                <FontAwesomeIcon icon="xmark" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="ac-modal__body">
                {formError && (
                  <div className="ac-form-error">
                    <FontAwesomeIcon icon="triangle-exclamation" />
                    {formError}
                  </div>
                )}

                <div className="ac-form-grid">
                  <div className="ac-field ac-field--full">
                    <label>Nome da Corporação <span className="ac-required">*</span></label>
                    <input
                      type="text"
                      name="nome"
                      value={form.nome}
                      onChange={handleFormChange}
                      placeholder="Ex: 1º Corpo de Bombeiros de..."
                      required
                      disabled={formLoading}
                    />
                  </div>

                  <div className="ac-field">
                    <label>CNPJ</label>
                    <input
                      type="text"
                      name="cnpj"
                      value={form.cnpj}
                      onChange={handleFormChange}
                      placeholder="00.000.000/0001-00"
                      disabled={formLoading}
                    />
                  </div>

                  <div className="ac-field">
                    <label>Telefone</label>
                    <input
                      type="text"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleFormChange}
                      placeholder="(00) 0000-0000"
                      disabled={formLoading}
                    />
                  </div>

                  <div className="ac-field ac-field--full">
                    <label>E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="contato@corporacao.com.br"
                      disabled={formLoading}
                    />
                  </div>

                  <div className="ac-field ac-field--span3">
                    <label>Endereço</label>
                    <input
                      type="text"
                      name="endereco"
                      value={form.endereco}
                      onChange={handleFormChange}
                      placeholder="Rua, Avenida..."
                      disabled={formLoading}
                    />
                  </div>

                  <div className="ac-field">
                    <label>Número</label>
                    <input
                      type="text"
                      name="numero"
                      value={form.numero}
                      onChange={handleFormChange}
                      placeholder="000"
                      disabled={formLoading}
                    />
                  </div>

                  <div className="ac-field">
                    <label>Bairro</label>
                    <input
                      type="text"
                      name="bairro"
                      value={form.bairro}
                      onChange={handleFormChange}
                      placeholder="Bairro"
                      disabled={formLoading}
                    />
                  </div>

                  <div className="ac-field">
                    <label>Cidade</label>
                    <input
                      type="text"
                      name="cidade"
                      value={form.cidade}
                      onChange={handleFormChange}
                      placeholder="Cidade"
                      disabled={formLoading}
                    />
                  </div>

                  <div className="ac-field">
                    <label>CEP</label>
                    <input
                      type="text"
                      name="cep"
                      value={form.cep}
                      onChange={handleFormChange}
                      placeholder="00000-000"
                      disabled={formLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="ac-modal__foot">
                <button
                  type="button"
                  className="ac-btn-cancel"
                  onClick={closeModal}
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={formLoading}>
                  {formLoading ? (
                    <><span className="ac-spinner ac-spinner--sm" /> Salvando...</>
                  ) : (
                    <><FontAwesomeIcon icon="check" /> {modal.mode === 'create' ? 'Cadastrar' : 'Salvar'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Modal de Confirmação de Exclusão ===== */}
      {deleteConfirm.open && (
        <div className="ac-overlay" onClick={closeDeleteConfirm}>
          <div className="ac-modal ac-modal--sm" onClick={e => e.stopPropagation()}>

            <div className="ac-modal__head ac-modal__head--danger">
              <h3>
                <FontAwesomeIcon icon="triangle-exclamation" />
                Confirmar Exclusão
              </h3>
              <button className="ac-modal__close" onClick={closeDeleteConfirm} aria-label="Fechar">
                <FontAwesomeIcon icon="xmark" />
              </button>
            </div>

            <div className="ac-modal__body">
              {deleteError && (
                <div className="ac-form-error" style={{ marginBottom: 16 }}>
                  <FontAwesomeIcon icon="triangle-exclamation" />
                  {deleteError}
                </div>
              )}
              <p className="ac-delete-text">
                Tem certeza que deseja excluir a corporação{' '}
                <strong>"{deleteConfirm.corporacao?.nome}"</strong>?
              </p>
              <p className="ac-delete-warn">
                Esta ação é irreversível e pode afetar todos os registros associados a esta corporação.
              </p>
            </div>

            <div className="ac-modal__foot">
              <button
                className="ac-btn-cancel"
                onClick={closeDeleteConfirm}
                disabled={deleteLoading}
              >
                Cancelar
              </button>
              <button className="ac-btn-danger" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? (
                  <><span className="ac-spinner ac-spinner--sm" /> Excluindo...</>
                ) : (
                  <><FontAwesomeIcon icon="trash" /> Excluir</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

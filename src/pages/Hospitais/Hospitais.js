// src/pages/Hospitais/Hospitais.js

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { hospitalApi } from '../../services/api';
import './Hospitais.css';

export default function Hospitais() {
  const { selectedCorporacao } = useAuth();
  const { canManageHospitais } = usePermissions();
  const idCorporacao = selectedCorporacao?.idCorporacao;

  const [hospitais, setHospitais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── Modal: Adicionar ─────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [addNome, setAddNome] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // ── Modal: Editar ────────────────────────────────────────────────────────
  const [editTarget, setEditTarget] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // ── Modal: Excluir ───────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadData = useCallback(async () => {
    if (!idCorporacao) return;
    setLoading(true);
    setError('');
    try {
      const res = await hospitalApi.list(idCorporacao);
      setHospitais(res?.Hospitais ?? []);
    } catch (err) {
      setError(err.message || 'Erro ao carregar hospitais.');
    } finally {
      setLoading(false);
    }
  }, [idCorporacao]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Adicionar ────────────────────────────────────────────────────────────
  const openAddModal = () => {
    setAddNome('');
    setAddError('');
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addNome.trim()) { setAddError('Informe o nome do hospital.'); return; }
    setAddLoading(true);
    setAddError('');
    try {
      await hospitalApi.create({ idCorporacao, nome: addNome.trim() });
      setShowAddModal(false);
      await loadData();
    } catch (err) {
      setAddError(err.message || 'Erro ao cadastrar hospital.');
    } finally {
      setAddLoading(false);
    }
  };

  // ── Editar ───────────────────────────────────────────────────────────────
  const openEditModal = (h) => {
    setEditTarget(h);
    setEditNome(h.nome);
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editNome.trim()) { setEditError('Informe o nome do hospital.'); return; }
    setEditLoading(true);
    setEditError('');
    try {
      await hospitalApi.update({ idHospital: editTarget.idHospital, nome: editNome.trim() });
      setEditTarget(null);
      await loadData();
    } catch (err) {
      setEditError(err.message || 'Erro ao atualizar hospital.');
    } finally {
      setEditLoading(false);
    }
  };

  // ── Excluir ──────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await hospitalApi.delete(deleteTarget.idHospital);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setDeleteError(err.message || 'Erro ao excluir hospital.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  if (!idCorporacao) {
    return (
      <main className="main-content">
        <header className="main-header"><h2>Hospitais</h2></header>
        <section className="panel">
          <div style={{ padding: '24px', color: 'var(--texto-secundario)' }}>
            Nenhuma corporação selecionada.
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main-content">
      <header className="main-header">
        <h2>Hospitais</h2>
        {canManageHospitais && (
          <div className="header-actions">
            <button className="btn-primary" onClick={openAddModal}>
              <FontAwesomeIcon icon="plus" />
              Cadastrar Hospital
            </button>
          </div>
        )}
      </header>

      <section className="panel modern-panel">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--texto-secundario)' }}>
            <FontAwesomeIcon icon="sync" spin style={{ marginRight: 8 }} />
            Carregando hospitais...
          </div>
        ) : error ? (
          <div style={{ padding: '24px' }}>
            <div className="modal-error">
              <FontAwesomeIcon icon="triangle-exclamation" />
              {error}
            </div>
          </div>
        ) : hospitais.length === 0 ? (
          <div className="hospitais-empty">
            <FontAwesomeIcon icon="hospital" className="hospitais-empty__icon" />
            <p>Nenhum hospital cadastrado nesta corporação.</p>
            {canManageHospitais && (
              <button className="btn-primary" onClick={openAddModal}>
                <FontAwesomeIcon icon="plus" />
                Cadastrar primeiro hospital
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table modern-table">
              <thead>
                <tr>
                  <th>Hospital</th>
                  {canManageHospitais && <th className="text-right">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {hospitais.map(h => (
                  <tr key={h.idHospital}>
                    <td>
                      <div className="hospital-cell">
                        <FontAwesomeIcon icon="hospital" className="hospital-cell__icon" />
                        <span>{h.nome}</span>
                      </div>
                    </td>
                    {canManageHospitais && (
                      <td className="actions-cell text-right">
                        <button
                          type="button"
                          className="action-btn-minimal"
                          title="Editar hospital"
                          onClick={() => openEditModal(h)}
                        >
                          <FontAwesomeIcon icon="pencil" />
                        </button>
                        <button
                          type="button"
                          className="action-btn-minimal delete"
                          title="Excluir hospital"
                          onClick={() => { setDeleteError(''); setDeleteTarget(h); }}
                        >
                          <FontAwesomeIcon icon="trash" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Modal: Cadastrar Hospital ── */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Cadastrar Hospital</h3>
              <button className="modal__close" onClick={() => setShowAddModal(false)}>
                <FontAwesomeIcon icon="xmark" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal__body">
                {addError && (
                  <div className="modal-error">
                    <FontAwesomeIcon icon="triangle-exclamation" />{addError}
                  </div>
                )}
                <div className="form-field">
                  <label>Nome do Hospital *</label>
                  <input
                    type="text"
                    value={addNome}
                    onChange={e => setAddNome(e.target.value)}
                    placeholder="Ex: Hospital Municipal de..."
                    disabled={addLoading}
                    autoFocus
                    maxLength={150}
                  />
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={addLoading}>
                  {addLoading
                    ? <><FontAwesomeIcon icon="sync" spin /> Salvando...</>
                    : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Editar Hospital ── */}
      {editTarget && (
        <div className="modal-backdrop" onClick={() => setEditTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Editar Hospital</h3>
              <button className="modal__close" onClick={() => setEditTarget(null)}>
                <FontAwesomeIcon icon="xmark" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal__body">
                {editError && (
                  <div className="modal-error">
                    <FontAwesomeIcon icon="triangle-exclamation" />{editError}
                  </div>
                )}
                <div className="form-field">
                  <label>Nome do Hospital *</label>
                  <input
                    type="text"
                    value={editNome}
                    onChange={e => setEditNome(e.target.value)}
                    disabled={editLoading}
                    autoFocus
                    maxLength={150}
                  />
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn-secondary" onClick={() => setEditTarget(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={editLoading}>
                  {editLoading
                    ? <><FontAwesomeIcon icon="sync" spin /> Salvando...</>
                    : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Excluir Hospital ── */}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="modal modal--delete" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Excluir Hospital</h3>
              <button className="modal__close" onClick={() => setDeleteTarget(null)}>
                <FontAwesomeIcon icon="xmark" />
              </button>
            </div>
            <div className="modal__body">
              {deleteError && (
                <div className="modal-error">
                  <FontAwesomeIcon icon="triangle-exclamation" />{deleteError}
                </div>
              )}
              <p>
                Tem certeza que deseja excluir <strong>{deleteTarget.nome}</strong>?
                Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="modal__footer">
              <button type="button" className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </button>
              <button type="button" className="btn-danger" onClick={handleDeleteConfirm} disabled={deleteLoading}>
                {deleteLoading
                  ? <><FontAwesomeIcon icon="sync" spin /> Excluindo...</>
                  : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

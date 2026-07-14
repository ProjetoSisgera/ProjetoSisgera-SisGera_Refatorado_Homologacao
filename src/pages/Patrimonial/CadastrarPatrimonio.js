import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { patrimonioApi } from '../../services/api';
import CurrencyInput from '../../components/CurrencyInput/CurrencyInput';
import './Patrimonial.css';

const CadastrarPatrimonio = () => {
    const { selectedCorporacao } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        descricao: '',
        valor: '',
        dataAquisicao: '',
        idTipoSituacao: 1,
        observacao: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const payload = {
                idCorporacao: selectedCorporacao?.idCorporacao,
                descricao: form.descricao,
                valor: form.valor !== '' ? Number(form.valor) : null,
                dataAquisicao: form.dataAquisicao || null,
                idTipoSituacao: Number(form.idTipoSituacao),
                observacao: form.observacao || null,
            };
            await patrimonioApi.create(payload);
            navigate('/patrimonial');
        } catch (err) {
            setError(err.message || 'Erro ao cadastrar bem patrimonial.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="main-content">
            <div className="form-centered-container">
                <header className="main-header">
                    <h2>Cadastrar Bem Patrimonial</h2>
                    <p style={{ color: '#475569', marginTop: '4px' }}>Registre as informações do novo bem da corporação.</p>
                </header>

                {error && (
                    <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <form className="form-panel" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    <div className="form-panel-header">
                        <h3>Detalhes do Bem</h3>
                    </div>
                    <div className="form-panel-body">
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label htmlFor="asset-desc">Descrição*</label>
                                <input
                                    type="text"
                                    id="asset-desc"
                                    placeholder="Ex: Notebook Dell Latitude 5420"
                                    required
                                    value={form.descricao}
                                    onChange={e => handleChange('descricao', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="asset-value">Valor (R$)</label>
                                <CurrencyInput
                                    id="asset-value"
                                    value={form.valor}
                                    onChange={val => handleChange('valor', val)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="asset-date">Data de Aquisição</label>
                                <input
                                    type="date"
                                    id="asset-date"
                                    value={form.dataAquisicao}
                                    onChange={e => handleChange('dataAquisicao', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Situação*</label>
                                <div className="chip-group">
                                    <div
                                        className={`chip-option ${form.idTipoSituacao === 1 ? 'active' : ''}`}
                                        onClick={() => handleChange('idTipoSituacao', 1)}
                                    >
                                        <FontAwesomeIcon icon="check" /> Ativo
                                    </div>
                                    <div
                                        className={`chip-option ${form.idTipoSituacao === 2 ? 'active' : ''}`}
                                        onClick={() => handleChange('idTipoSituacao', 2)}
                                    >
                                        <FontAwesomeIcon icon="wrench" /> Em Manutenção
                                    </div>
                                    <div
                                        className={`chip-option ${form.idTipoSituacao === 3 ? 'active' : ''}`}
                                        onClick={() => handleChange('idTipoSituacao', 3)}
                                    >
                                        <FontAwesomeIcon icon="arrow-down" /> Baixado
                                    </div>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="asset-obs">Observações (Opcional)</label>
                                <textarea
                                    id="asset-obs"
                                    placeholder="Detalhes adicionais sobre o estado do bem..."
                                    style={{ fontFamily: 'inherit' }}
                                    value={form.observacao}
                                    onChange={e => handleChange('observacao', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-panel-footer">
                        <Link to="/patrimonial" className="btn-outline-secondary">
                            <FontAwesomeIcon icon="arrow-left" style={{ marginRight: '8px' }} /> Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, marginLeft: '12px' }}
                        >
                            {isSubmitting ? (
                                <><FontAwesomeIcon icon="sync" spin style={{ marginRight: '8px' }} /> Salvando...</>
                            ) : (
                                <><FontAwesomeIcon icon="check" style={{ marginRight: '8px' }} /> Confirmar Cadastro</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default CadastrarPatrimonio;

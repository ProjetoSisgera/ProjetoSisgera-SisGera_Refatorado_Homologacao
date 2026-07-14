import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { produtoApi, movimentoEstoqueApi } from '../../services/api';
import CurrencyInput from '../../components/CurrencyInput/CurrencyInput';
import './Produtos.css';

const UNIDADES = [
    { id: 1, label: 'Unidade' }, { id: 2, label: 'Caixa' }, { id: 3, label: 'Par' },
    { id: 4, label: 'Rolo' }, { id: 5, label: 'Litro' }, { id: 6, label: 'mL' },
    { id: 7, label: 'Kg' }, { id: 8, label: 'g' }, { id: 9, label: 'Metro' },
    { id: 10, label: 'Ampola' },
];

// Mapeamento de campos do backend para rótulos em português
const CAMPO_PT = {
    nome: 'Nome do Produto',
    precoUnitario: 'Preço Unitário',
    idTipoUnidadeMedida: 'Unidade de Medida',
    estoqueMinimo: 'Estoque Mínimo',
    quantidadeInicial: 'Quantidade Inicial',
    idTipoSituacao: 'Situação',
    descricao: 'Descrição',
    idCorporacao: 'Corporação',
    idProduto: 'Produto',
    idTipoMovimento: 'Tipo de Movimentação',
    quantidade: 'Quantidade',
};

// Traduz a mensagem de validação do class-validator para português
function traduzirValidacao(campo, msg) {
    const label = CAMPO_PT[campo] || campo;
    if (msg.includes('must be a positive number') || msg.includes('must be positive'))
        return `${label} deve ser um número positivo`;
    if (msg.includes('must be an integer number') || msg.includes('must be an integer'))
        return `${label} deve ser um número inteiro`;
    if (msg.includes('must be a number'))
        return `${label} deve ser um número válido`;
    if (msg.includes('should not be empty') || msg.includes('must not be empty'))
        return `${label} não pode estar vazio`;
    if (msg.includes('must be longer than') || msg.includes('must be at least'))
        return `${label} é muito curto`;
    if (msg.includes('must be shorter than') || msg.includes('must be at most'))
        return `${label} é muito longo`;
    if (msg.includes('must be a string'))
        return `${label} deve ser um texto`;
    if (msg.includes('must be a boolean'))
        return `${label} deve ser verdadeiro ou falso`;
    if (msg.includes('must be one of'))
        return `${label} tem um valor inválido`;
    if (msg.includes('must be an email'))
        return `${label} deve ser um e-mail válido`;
    return `${label}: valor inválido`;
}

// Converte erros do backend (NestJS) em mapa { campo: mensagem }
function parsearErros(errMsg) {
    const errosCampo = {};
    let erroGeral = '';

    // NestJS retorna array serializado como string separada por vírgula
    const partes = String(errMsg).split(',').map(s => s.trim()).filter(Boolean);

    partes.forEach(parte => {
        // Formato típico: "nomeDoCampo must be ..."
        const espaco = parte.indexOf(' ');
        if (espaco > 0) {
            const campo = parte.substring(0, espaco);
            const validacao = parte.substring(espaco + 1);
            if (CAMPO_PT[campo] !== undefined || /^[a-z][a-zA-Z]+$/.test(campo)) {
                errosCampo[campo] = traduzirValidacao(campo, validacao);
                return;
            }
        }
        erroGeral = parte;
    });

    return { errosCampo, erroGeral };
}

const CadastrarProduto = () => {
    const { selectedCorporacao } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: '',
        precoUnitario: '',
        idTipoUnidadeMedida: 1,
        estoqueMinimo: '',
        quantidadeInicial: '',
        idTipoSituacao: 1,
        descricao: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erroGeral, setErroGeral] = useState('');
    const [errosCampo, setErrosCampo] = useState({});

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // Remove o erro do campo ao digitar
        if (errosCampo[field]) {
            setErrosCampo(prev => { const n = { ...prev }; delete n[field]; return n; });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErroGeral('');
        setErrosCampo({});
        setIsSubmitting(true);
        try {
            const res = await produtoApi.create({
                idCorporacao: selectedCorporacao?.idCorporacao,
                nome: form.nome,
                precoUnitario: form.precoUnitario !== '' ? Number(form.precoUnitario) : null,
                idTipoUnidadeMedida: Number(form.idTipoUnidadeMedida),
                estoqueMinimo: Number(form.estoqueMinimo),
                idTipoSituacao: Number(form.idTipoSituacao),
                descricao: form.descricao || null,
            });

            const qtdInicial = Number(form.quantidadeInicial);
            if (qtdInicial > 0) {
                const idProduto = res?.Produto?.idProduto;
                if (idProduto) {
                    await movimentoEstoqueApi.create({
                        idProduto,
                        idTipoMovimento: 1,
                        quantidade: qtdInicial,
                        justificativa: 'Estoque inicial',
                    });
                }
            }

            navigate('/produtos');
        } catch (err) {
            const { errosCampo: campos, erroGeral: geral } = parsearErros(err.message);
            if (Object.keys(campos).length > 0) {
                setErrosCampo(campos);
                setErroGeral('Corrija os campos indicados em vermelho.');
            } else {
                setErroGeral(geral || err.message || 'Erro ao cadastrar produto.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const unidadeSelecionada = UNIDADES.find(u => u.id === Number(form.idTipoUnidadeMedida))?.label ?? '';

    // Helper: aplica .field-error quando há erro no campo
    const fg = (campo) => `form-group${errosCampo[campo] ? ' field-error' : ''}`;

    return (
        <main className="main-content">
            <div className="form-centered-container">
                <header className="main-header">
                    <h2>Adicionar Novo Produto</h2>
                    <p style={{ color: '#475569', marginTop: '4px' }}>Preencha os dados do novo item para o inventário.</p>
                </header>

                {erroGeral && (
                    <div className="form-error-banner">
                        <FontAwesomeIcon icon="triangle-exclamation" style={{ marginRight: '8px' }} />
                        {erroGeral}
                    </div>
                )}

                <form className="form-panel" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    <div className="form-panel-header">
                        <h3>Dados do Produto</h3>
                    </div>
                    <div className="form-panel-body">
                        <div className="form-grid">

                            <div className={fg('nome') + ' full-width'}>
                                <label htmlFor="product-name">Nome do Produto*</label>
                                <input
                                    type="text"
                                    id="product-name"
                                    placeholder="Ex: Luva de Procedimento G"
                                    required
                                    value={form.nome}
                                    onChange={e => handleChange('nome', e.target.value)}
                                />
                                {errosCampo.nome && <span className="field-error-msg">{errosCampo.nome}</span>}
                            </div>

                            <div className={fg('precoUnitario')}>
                                <label htmlFor="product-price">Preço Unitário (R$)</label>
                                <CurrencyInput
                                    id="product-price"
                                    value={form.precoUnitario}
                                    onChange={val => handleChange('precoUnitario', val)}
                                />
                                {errosCampo.precoUnitario && <span className="field-error-msg">{errosCampo.precoUnitario}</span>}
                            </div>

                            <div className={fg('idTipoUnidadeMedida')}>
                                <label htmlFor="product-unit">Unidade de Medida*</label>
                                <select
                                    id="product-unit"
                                    required
                                    style={{ paddingTop: '12px', paddingBottom: '12px' }}
                                    value={form.idTipoUnidadeMedida}
                                    onChange={e => handleChange('idTipoUnidadeMedida', Number(e.target.value))}
                                >
                                    {UNIDADES.map(u => (
                                        <option key={u.id} value={u.id}>{u.label}</option>
                                    ))}
                                </select>
                                {errosCampo.idTipoUnidadeMedida && <span className="field-error-msg">{errosCampo.idTipoUnidadeMedida}</span>}
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
                                        <FontAwesomeIcon icon="times" /> Inativo
                                    </div>
                                </div>
                            </div>

                            <div className={fg('estoqueMinimo')}>
                                <label htmlFor="product-stock-min">Estoque Mínimo*</label>
                                <input
                                    type="number"
                                    id="product-stock-min"
                                    min={1}
                                    required
                                    placeholder="Ex: 5"
                                    value={form.estoqueMinimo}
                                    onChange={e => handleChange('estoqueMinimo', e.target.value)}
                                />
                                {errosCampo.estoqueMinimo && <span className="field-error-msg">{errosCampo.estoqueMinimo}</span>}
                            </div>

                            <div className={fg('quantidadeInicial')}>
                                <label htmlFor="product-qty">
                                    Quantidade Inicial
                                    {unidadeSelecionada && (
                                        <span style={{ fontSize: '12px', color: '#475569', marginLeft: '6px' }}>
                                            ({unidadeSelecionada})
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="number"
                                    id="product-qty"
                                    min={0}
                                    placeholder="Ex: 50"
                                    value={form.quantidadeInicial}
                                    onChange={e => handleChange('quantidadeInicial', e.target.value)}
                                />
                                <span style={{ fontSize: '11px', color: '#475569', marginTop: '4px', display: 'block' }}>
                                    Será registrado como Entrada de estoque
                                </span>
                                {errosCampo.quantidadeInicial && <span className="field-error-msg">{errosCampo.quantidadeInicial}</span>}
                            </div>

                            <div className={fg('descricao') + ' full-width'}>
                                <label htmlFor="product-description">Descrição (Opcional)</label>
                                <textarea
                                    id="product-description"
                                    placeholder="Forneça detalhes adicionais sobre o produto aqui..."
                                    style={{ fontFamily: 'inherit' }}
                                    value={form.descricao}
                                    onChange={e => handleChange('descricao', e.target.value)}
                                />
                                {errosCampo.descricao && <span className="field-error-msg">{errosCampo.descricao}</span>}
                            </div>

                        </div>
                    </div>
                    <div className="form-panel-footer">
                        <Link to="/produtos" className="btn-outline-secondary">
                            <FontAwesomeIcon icon="arrow-left" style={{ marginRight: '8px' }} /> Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                        >
                            {isSubmitting ? (
                                <><FontAwesomeIcon icon="sync" spin style={{ marginRight: '8px' }} /> Salvando...</>
                            ) : (
                                <><FontAwesomeIcon icon="check" style={{ marginRight: '8px' }} /> Salvar Produto</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default CadastrarProduto;

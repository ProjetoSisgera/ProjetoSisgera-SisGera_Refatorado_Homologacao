// src/pages/Login/Login.js

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', senha: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Se já estiver autenticado, redireciona conforme o perfil
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/corporacoes' : '/'} replace />;
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.senha) {
      setError('Preencha todos os campos para continuar.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { isAdmin: adminUser } = await login(form.email.trim(), form.senha);
      navigate(adminUser ? '/admin/corporacoes' : '/', { replace: true });
    } catch (err) {
      setError(err.message || 'Credenciais inválidas. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Painel esquerdo — Marca */}
      <div className="login-brand">
        <div className="login-brand__content">
          <div className="login-brand__logo">
            <FontAwesomeIcon icon="shield-halved" />
          </div>
          <h1 className="login-brand__title">SisGera</h1>
          <p className="login-brand__subtitle">
            Sistema de Gestão para Corpos de Bombeiros Voluntários
          </p>
          <div className="login-brand__features">
            <div className="login-brand__feature">
              <FontAwesomeIcon icon="file-circle-check" />
              <span>Gestão de Ocorrências</span>
            </div>
            <div className="login-brand__feature">
              <FontAwesomeIcon icon="building-shield" />
              <span>Controle Patrimonial</span>
            </div>
            <div className="login-brand__feature">
              <FontAwesomeIcon icon="users" />
              <span>Gerenciamento de Equipes</span>
            </div>
          </div>
        </div>
        <div className="login-brand__circle-bottom" />
        <div className="login-brand__circle-top" />
      </div>

      {/* Painel direito — Formulário */}
      <div className="login-form-panel">
        <div className="login-card">

          {/* Logo visível só no mobile */}
          <div className="login-card__logo-mobile">
            <FontAwesomeIcon icon="shield-halved" />
            <span>SisGera</span>
          </div>

          <div className="login-card__header">
            <h2>Bem-vindo de volta</h2>
            <p>Faça login para acessar o sistema</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>

            {error && (
              <div className="login-error" role="alert">
                <FontAwesomeIcon icon="triangle-exclamation" />
                <span>{error}</span>
              </div>
            )}

            <div className="login-field">
              <label htmlFor="email">E-mail</label>
              <div className="login-input-wrapper">
                <FontAwesomeIcon icon="user" className="login-input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  autoFocus
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="senha">Senha</label>
              <div className="login-input-wrapper">
                <FontAwesomeIcon icon="lock" className="login-input-icon" />
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showPassword ? 'eye-slash' : 'eye'} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`login-btn${loading ? ' login-btn--loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Entrando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon="arrow-right" />
                  Entrar
                </>
              )}
            </button>

          </form>

          <p className="login-footer">
            SisGera &copy; {new Date().getFullYear()} &mdash; Todos os direitos reservados
          </p>
        </div>
      </div>

    </div>
  );
}

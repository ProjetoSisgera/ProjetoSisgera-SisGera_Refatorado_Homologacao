import { useEffect, useState } from 'react';

const formatCents = (cents) =>
    (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Input de moeda no padrão brasileiro: os dígitos digitados são tratados
// como centavos, formatando ao vivo (ex: "1250" -> "12,50").
// onChange recebe o valor numérico em reais (string), compatível com Number(valor).
const CurrencyInput = ({ id, value, onChange, required, className, ...rest }) => {
    const [display, setDisplay] = useState('');

    useEffect(() => {
        if (value === '' || value === null || value === undefined) {
            setDisplay('');
        } else {
            setDisplay(formatCents(Math.round(Number(value) * 100)));
        }
    }, [value]);

    const handleChange = (e) => {
        const digits = e.target.value.replace(/\D/g, '');
        if (digits === '') {
            setDisplay('');
            onChange('');
            return;
        }
        const cents = parseInt(digits, 10);
        setDisplay(formatCents(cents));
        onChange(String(cents / 100));
    };

    return (
        <div className={`currency-input-group${className ? ` ${className}` : ''}`}>
            <span className="currency-prefix">R$</span>
            <input
                type="text"
                inputMode="decimal"
                id={id}
                placeholder="0,00"
                required={required}
                value={display}
                onChange={handleChange}
                {...rest}
            />
        </div>
    );
};

export default CurrencyInput;

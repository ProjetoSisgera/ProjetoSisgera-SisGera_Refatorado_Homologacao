import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './StatCard.css';

const StatCard = ({ title, count, icon, type, trend, trendUp }) => {
    const isEmpty = count === 0;

    return (
        <div className={'stat-card ' + type}>
            <div className={'icon ' + type}>
                <FontAwesomeIcon icon={icon} />
            </div>
            <div className='info'>
                <h3>{isEmpty ? '—' : count}</h3>
                <p>{title}</p>
                {isEmpty && (
                    <span className='stat-empty'>Nenhuma registrada</span>
                )}
                {!isEmpty && trend && (
                    <span className={'stat-trend ' + (trendUp ? 'up' : 'down')}>
                        {trendUp ? '▲' : '▼'} {trend} esta semana
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatCard;
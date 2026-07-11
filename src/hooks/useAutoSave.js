import { useEffect, useCallback } from 'react';

const useAutoSave = (key, dataToSave, shouldSave = true) => {
    useEffect(() => {
        if (!shouldSave) return;

        const handler = setTimeout(() => {
            if (dataToSave) {
                localStorage.setItem(key, JSON.stringify(dataToSave));
            }
        }, 1500);

        return () => clearTimeout(handler);
    }, [key, dataToSave, shouldSave]);

    const clearDraft = useCallback(() => {
        localStorage.removeItem(key);
    }, [key]);

    const getDraft = useCallback(() => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Erro ao ler rascunho:', error);
            return null;
        }
    }, [key]);

    return { clearDraft, getDraft };
};

export default useAutoSave;

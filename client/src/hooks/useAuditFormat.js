import { useMemo } from 'react';

export const useAuditFormat = () => {
    const formatDate = useMemo(() => (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Data inválida';
        }
    }, []);

    const formatDateOnly = useMemo(() => (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return 'Data inválida';
        }
    }, []);

    const formatTimeOnly = useMemo(() => (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Hora inválida';
        }
    }, []);

    const getTimeAgo = useMemo(() => (dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMs = now - date;
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
            const diffInWeeks = Math.floor(diffInDays / 7);
            const diffInMonths = Math.floor(diffInDays / 30);

            if (diffInMinutes < 1) return 'Agora mesmo';
            if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
            if (diffInHours < 24) return `${diffInHours}h atrás`;
            if (diffInDays < 7) return `${diffInDays} dias atrás`;
            if (diffInWeeks < 4) return `${diffInWeeks} semanas atrás`;
            if (diffInMonths < 12) return `${diffInMonths} meses atrás`;
            
            return formatDate(dateString);
        } catch (error) {
            return '';
        }
    }, [formatDate]);

    const isRecentlyModified = useMemo(() => (dateString, hours = 24) => {
        if (!dateString) return false;
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMs = now - date;
            const diffInHours = diffInMs / (1000 * 60 * 60);
            
            return diffInHours < hours;
        } catch (error) {
            return false;
        }
    }, []);

    return {
        formatDate,
        formatDateOnly,
        formatTimeOnly,
        getTimeAgo,
        isRecentlyModified
    };
}; 
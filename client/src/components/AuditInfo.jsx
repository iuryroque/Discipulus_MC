import {
    CalendarToday as CalendarIcon,
    Edit as EditIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import { Box, Chip, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const AuditInfo = ({ record, showLabels = true, variant = 'default' }) => {
    if (!record) return null;
    
    const formatDate = (dateString) => {
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
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMs = now - date;
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInMinutes < 1) return 'Agora mesmo';
            if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
            if (diffInHours < 24) return `${diffInHours}h atrás`;
            if (diffInDays < 7) return `${diffInDays} dias atrás`;
            
            return formatDate(dateString);
        } catch (error) {
            return '';
        }
    };

    const renderCompact = () => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', fontSize: '0.75rem', color: 'text.secondary' }}>
            <TimeIcon sx={{ fontSize: 14 }} />
            <span>{getTimeAgo(record.criadoEm)}</span>
            {record.alteradoEm && record.alteradoEm !== record.criadoEm && (
                <>
                    <EditIcon sx={{ fontSize: 14, ml: 1 }} />
                    <span>{getTimeAgo(record.alteradoEm)}</span>
                </>
            )}
        </Box>
    );

    const renderDefault = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                    {showLabels ? 'Criado em: ' : ''}
                    {formatDate(record.criadoEm)} por {record.criadoPor || 'Sistema'}
                </Typography>
            </Box>
            
            {record.alteradoEm && record.alteradoEm !== record.criadoEm && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EditIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="body2" color="text.secondary">
                        {showLabels ? 'Alterado em: ' : ''}
                        {formatDate(record.alteradoEm)} por {record.alteradoPor || 'Sistema'}
                    </Typography>
                </Box>
            )}
        </Box>
    );

    const renderChips = () => (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
                icon={<CalendarIcon />}
                label={`Criado: ${formatDate(record.criadoEm)}`}
                size="small"
                color="primary"
                variant="outlined"
            />
            
            {record.alteradoEm && record.alteradoEm !== record.criadoEm && (
                <Chip
                    icon={<EditIcon />}
                    label={`Alterado: ${formatDate(record.alteradoEm)}`}
                    size="small"
                    color="warning"
                    variant="outlined"
                />
            )}
        </Box>
    );

    switch (variant) {
        case 'compact':
            return renderCompact();
        case 'chips':
            return renderChips();
        case 'default':
        default:
            return renderDefault();
    }
};

AuditInfo.propTypes = {
    record: PropTypes.object,
    showLabels: PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'compact', 'chips'])
};
export default AuditInfo;

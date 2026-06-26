import { Add, Delete, Edit, FileDownload, FilterList, Visibility } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    CreateButton,
    ExportButton,
    FilterButton,
    TopToolbar,
    useDelete,
    useRecordContext,
    useRedirect,
} from 'react-admin';

export const ListActions = ({ createLabel = 'Novo' }) => {
    const theme = useTheme();
    const txt = theme.palette.text.secondary;
    const neutral = {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        px: 1.5,
        color: txt,
        bgcolor: 'transparent',
        textTransform: 'none',
        fontWeight: 500,
        fontSize: 13,
        '& .MuiButton-startIcon': { color: txt },
        '& .MuiButton-startIcon svg': { color: txt },
        '&:hover': { bgcolor: 'action.hover', color: txt },
        '&.MuiButtonBase-root': { color: txt },
        '&.MuiButtonBase-root:hover': { color: txt },
    };
    return (
        <TopToolbar sx={{ gap: 1, alignItems: 'center', py: 1 }}>
            <FilterButton
                label="Filtros"
                icon={<FilterList fontSize="small" />}
                sx={neutral}
            />
            <ExportButton
                label="Exportar"
                icon={<FileDownload fontSize="small" />}
                sx={neutral}
            />
            <CreateButton
                label={createLabel}
                icon={<Add fontSize="small" />}
                variant="contained"
                sx={{
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    borderRadius: 2,
                    px: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    },
                }}
            />
        </TopToolbar>
    );
};

export const RowActions = ({ resource }) => {
    const record = useRecordContext();
    const redirect = useRedirect();
    const [deleteOne] = useDelete();
    if (!record) return null;
    return (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
            <Tooltip title="Ver">
                <IconButton size="small" color="primary" onClick={e => { e.stopPropagation(); redirect('show', resource, record.id); }}>
                    <Visibility fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
                <IconButton size="small" color="primary" onClick={e => { e.stopPropagation(); redirect('edit', resource, record.id); }}>
                    <Edit fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
                <IconButton size="small" color="error" onClick={e => { e.stopPropagation(); deleteOne(resource, { id: record.id, previousData: record }); }}>
                    <Delete fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export const DotChip = ({ value, colorMap, labelMap }) => {
    const dot = colorMap?.[value] ?? '#bdbdbd';
    const label = labelMap?.[value] ?? value ?? '—';
    return (
        <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.8,
            px: 1.2, py: 0.4, borderRadius: 10,
            border: '1px solid rgba(0,0,0,0.10)',
            bgcolor: 'background.paper',
            whiteSpace: 'nowrap',
        }}>
            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: dot, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.primary', lineHeight: 1 }}>
                {label}
            </Typography>
        </Box>
    );
};

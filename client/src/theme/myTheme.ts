import { deepmerge } from '@mui/utils';
import { defaultTheme } from 'react-admin';

const myTheme = {
    ...defaultTheme,
    palette: deepmerge(defaultTheme.palette, {
        primary: {
            main: '#2563eb', // Azul sólido - NOVA cor principal
            light: '#42A5F5',
            dark: '#0D47A1',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#424242', // Cinza sólido - neutro e limpo
            light: '#616161',
            dark: '#212121',
            contrastText: '#ffffff',
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
        success: {
            main: '#4CAF50', // Verde sólido para sucesso
            light: '#81C784',
            dark: '#388E3C',
            contrastText: '#fff',
        },
        warning: {
            main: '#FF9800', // Laranja sólido para aviso
            light: '#FFB74D',
            dark: '#F57C00',
            contrastText: '#fff',
        },
        error: {
            main: '#F44336', // Vermelho sólido para erro
            light: '#E57373',
            dark: '#D32F2F',
            contrastText: '#fff',
        },
        info: {
            main: '#2196F3', // Azul claro sólido para informação
            light: '#64B5F6',
            dark: '#1976D2',
            contrastText: '#fff',
        },
        common: {
            white: '#fff',
            black: '#000',
        },
        avatar: {
            laranja: '#f59e42',
            azul: '#2563eb',
            roxo: '#6366f1',
        },
        chip: {
            visitante: '#f59e42',
            membro: '#2563eb',
            ativo: '#4CAF50',
            inativo: '#F44336',
        },
    }),
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            color: '#212121',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            color: '#212121',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#212121',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#212121',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#212121',
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            color: '#212121',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
            color: '#212121',
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.43,
            color: '#757575',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#2563eb',
                    boxShadow: '0 2px 10px rgba(37, 99, 235, 0.3)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                },
                contained: {
                    backgroundColor: '#2563eb',
                    '&:hover': {
                        backgroundColor: '#0D47A1',
                    },
                },
                outlined: {
                    borderColor: '#2563eb',
                    color: '#2563eb',
                    '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976D2',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976D2',
                        },
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: '#ffffff',
                    borderRight: '1px solid rgba(0,0,0,0.05)',
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: '2px 8px',
                    '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(25, 118, 210, 0.12)',
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.16)',
                        },
                    },
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                        borderBottom: '2px solid rgba(25, 118, 210, 0.1)',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    fontWeight: 500,
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(25, 118, 210, 0.05)',
                    '& .MuiTableCell-head': {
                        fontWeight: 600,
                        color: '#1976D2',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                },
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    '& .MuiPaginationItem-root': {
                        borderRadius: 8,
                        '&.Mui-selected': {
                            backgroundColor: '#1976D2',
                            color: '#ffffff',
                        },
                    },
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1976D2',
                    '&:hover': {
                        backgroundColor: '#0D47A1',
                    },
                },
            },
        },
        MuiSpeedDialAction: {
            styleOverrides: {
                fab: {
                    backgroundColor: '#424242',
                    '&:hover': {
                        backgroundColor: '#212121',
                    },
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    backgroundColor: 'rgba(25, 118, 210, 0.2)',
                },
                bar: {
                    backgroundColor: '#1976D2',
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    color: '#1976D2',
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-checked': {
                        color: '#424242',
                        '& + .MuiSwitch-track': {
                            backgroundColor: '#424242',
                        },
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    '&.Mui-checked': {
                        color: '#424242',
                    },
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    '&.Mui-checked': {
                        color: '#1976D2',
                    },
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    '& .MuiSlider-thumb': {
                        backgroundColor: '#1976D2',
                    },
                    '& .MuiSlider-track': {
                        backgroundColor: '#1976D2',
                    },
                    '& .MuiSlider-rail': {
                        backgroundColor: 'rgba(25, 118, 210, 0.2)',
                    },
                },
            },
        },
    },
};

export default myTheme; 
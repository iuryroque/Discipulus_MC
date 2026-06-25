import {
    Book as BookIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    Description as DescriptionIcon,
    Edit as EditIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Help as HelpIcon,
    Info as InfoIcon,
    Person as PersonIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import React, { useState } from 'react';
import {
    DateInput,
    Edit,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextInput
} from 'react-admin';
import { z } from 'zod';
import { useZodValidation } from '../../validation/useZodValidation';

// Schema de validação
const licaoConcluidaSchema = z.object({
    pessoa: z.object({
        id: z.number().min(1, 'Pessoa é obrigatória')
    }),
    licoesCurriculo: z.object({
        id: z.number().min(1, 'Lição é obrigatória')
    }),
    dataConclusao: z.string()
        .min(1, 'Data de conclusão é obrigatória')
        .refine((date) => {
            const inputDate = new Date(date);
            const today = new Date();
            return inputDate <= today;
        }, 'Data de conclusão não pode ser futura'),
    observacoes: z.string()
        .min(5, 'Observações devem ter pelo menos 5 caracteres')
        .max(1000, 'Observações devem ter no máximo 1000 caracteres')
        .optional()
});

// Componente de seção do formulário
const FormSection = ({ title, icon, children, defaultExpanded = true }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const theme = useTheme();

    return (
        <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        mb: expanded ? 2 : 0
                    }}
                    onClick={() => setExpanded(!expanded)}
                >
                    <Box 
                        sx={{ 
                            p: 1, 
                            borderRadius: 2, 
                            backgroundColor: theme.palette.primary.main + '20',
                            color: theme.palette.primary.main,
                            mr: 2
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
                        {title}
                    </Typography>
                    <IconButton size="small">
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>
                
                <Collapse in={expanded}>
                    <Grid container spacing={3}>
                        {children}
                    </Grid>
                </Collapse>
            </CardContent>
        </Card>
    );
};

// Componente de campo com validação
const ValidatedField = ({ 
    source, 
    label, 
    type = 'text', 
    multiline = false, 
    rows = 1, 
    required = false,
    helperText = '',
    startIcon = null,
    endIcon = null,
    validation = null,
    ...props 
}) => {
    const theme = useTheme();
    const [showHelp, setShowHelp] = useState(false);

    return (
        <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
                <TextInput
                    source={source}
                    label={label}
                    variant="outlined"
                    fullWidth
                    multiline={multiline}
                    rows={rows}
                    required={required}
                    helperText={helperText}
                    InputProps={{
                        startAdornment: startIcon && (
                            <InputAdornment position="start">
                                {startIcon}
                            </InputAdornment>
                        ),
                        endAdornment: endIcon && (
                            <InputAdornment position="end">
                                {endIcon}
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                                borderWidth: 2,
                            },
                        },
                    }}
                    {...props}
                />
                {validation && (
                    <Tooltip 
                        title={validation} 
                        open={showHelp}
                        onClose={() => setShowHelp(false)}
                        placement="top"
                    >
                        <IconButton
                            size="small"
                            sx={{ 
                                position: 'absolute', 
                                right: -40, 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: theme.palette.info.main
                            }}
                            onMouseEnter={() => setShowHelp(true)}
                            onMouseLeave={() => setShowHelp(false)}
                        >
                            <HelpIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Grid>
    );
};

// Componente de data com validação
const ValidatedDateField = ({ 
    source, 
    label, 
    required = false,
    helperText = '',
    startIcon = null,
    validation = null,
    ...props 
}) => {
    const theme = useTheme();
    const [showHelp, setShowHelp] = useState(false);

    return (
        <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
                <DateInput
                    source={source}
                    label={label}
                    variant="outlined"
                    fullWidth
                    required={required}
                    helperText={helperText}
                    InputProps={{
                        startAdornment: startIcon && (
                            <InputAdornment position="start">
                                {startIcon}
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                                borderWidth: 2,
                            },
                        },
                    }}
                    {...props}
                />
                {validation && (
                    <Tooltip 
                        title={validation} 
                        open={showHelp}
                        onClose={() => setShowHelp(false)}
                        placement="top"
                    >
                        <IconButton
                            size="small"
                            sx={{ 
                                position: 'absolute', 
                                right: -40, 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                color: theme.palette.info.main
                            }}
                            onMouseEnter={() => setShowHelp(true)}
                            onMouseLeave={() => setShowHelp(false)}
                        >
                            <HelpIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Grid>
    );
};

const LicoesConcluidasPessoaEdit = props => {
    const theme = useTheme();
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({});

    // Hook de validação
    const { validate, errors, isValid } = useZodValidation(licaoConcluidaSchema);

    const handleSubmit = (data) => {
        const validationResult = validate(data);
        if (validationResult.success) {
            // Dados válidos, prosseguir com o envio
            console.log('Dados válidos:', validationResult.data);
            return data;
        } else {
            console.error('Erros de validação:', validationResult.error);
            return false;
        }
    };

    const handleFormChange = (data) => {
        setFormData(data);
        validate(data);
    };

    return (
        <Edit {...props}>
            <SimpleForm onSubmit={handleSubmit} onChange={handleFormChange}>
                <Box sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box 
                            sx={{ 
                                p: 2, 
                                borderRadius: 3, 
                                backgroundColor: theme.palette.warning.main + '20',
                                color: theme.palette.warning.main,
                                mr: 3
                            }}
                        >
                            <EditIcon sx={{ fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                                Editar Conclusão de Lição
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Atualize as informações da conclusão da lição
                            </Typography>
                        </Box>
                    </Box>

                    {/* Alertas de validação */}
                    {!isValid && Object.keys(errors || {}).length > 0 && (
                        <Alert 
                            severity="warning" 
                            sx={{ mb: 3 }}
                            action={
                                <Button 
                                    color="inherit" 
                                    size="small"
                                    onClick={() => setShowPreview(!showPreview)}
                                >
                                    {showPreview ? 'Ocultar' : 'Ver'} Detalhes
                                </Button>
                            }
                        >
                            Existem erros de validação no formulário
                        </Alert>
                    )}

                    <Collapse in={showPreview && !isValid}>
                        <Paper sx={{ p: 2, mb: 3, backgroundColor: theme.palette.warning.light + '10' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Erros de Validação:
                            </Typography>
                            <Stack spacing={1}>
                                {Object.entries(errors || {}).map(([field, error]) => (
                                    <Box key={field} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <WarningIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>{field}:</strong> {error}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Collapse>

                    {/* Seção: Informações Básicas */}
                    <FormSection 
                        title="Informações Básicas" 
                        icon={<CheckCircleIcon />}
                        defaultExpanded={true}
                    >
                        <Grid item xs={12} md={6}>
                            <ReferenceInput 
                                source="pessoa.id" 
                                reference="pessoa" 
                                label="Pessoa"
                                variant="outlined"
                                fullWidth
                                required
                                helperText="Selecione a pessoa que concluiu a lição"
                            >
                                <SelectInput 
                                    optionText="nomeCompleto" 
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </ReferenceInput>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <ReferenceInput 
                                source="licoesCurriculo.id" 
                                reference="licoesCurriculo" 
                                label="Lição Concluída"
                                variant="outlined"
                                fullWidth
                                required
                                helperText="Selecione a lição que foi concluída"
                            >
                                <SelectInput 
                                    optionText="titulo" 
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BookIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </ReferenceInput>
                        </Grid>

                        <ValidatedDateField
                            source="dataConclusao"
                            label="Data de Conclusão"
                            required
                            startIcon={<CalendarIcon />}
                            helperText="Data em que a lição foi concluída"
                            validation="Data não pode ser futura"
                        />
                    </FormSection>

                    {/* Seção: Observações */}
                    <FormSection 
                        title="Observações" 
                        icon={<DescriptionIcon />}
                        defaultExpanded={false}
                    >
                        <Grid item xs={12}>
                            <ValidatedField
                                source="observacoes"
                                label="Observações"
                                multiline
                                rows={4}
                                helperText="Observações sobre a conclusão da lição"
                                validation="Deve ter entre 5 e 1000 caracteres"
                                startIcon={<DescriptionIcon />}
                            />
                        </Grid>
                    </FormSection>

                    {/* Dicas e Informações */}
                    <Card sx={{ mb: 3, backgroundColor: theme.palette.info.light + '10', border: `1px solid ${theme.palette.info.light}` }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <InfoIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                                <Typography variant="h6" sx={{ color: theme.palette.info.main }}>
                                    Dicas para Edição
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>✓</strong> Verifique se as informações estão corretas
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>✓</strong> Atualize observações se necessário
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>✓</strong> Confirme a data de conclusão
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>✓</strong> Mantenha o histórico atualizado
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Card de Resumo */}
                    <Card sx={{ mb: 3, backgroundColor: theme.palette.success.light + '10', border: `1px solid ${theme.palette.success.light}` }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                                <Typography variant="h6" sx={{ color: theme.palette.success.main }}>
                                    Resumo da Conclusão
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Pessoa:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.pessoa?.nomeCompleto || 'Não selecionado'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Lição:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.licoesCurriculo?.titulo || 'Não selecionada'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Data:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.dataConclusao ? 
                                            new Date(formData.dataConclusao).toLocaleDateString('pt-BR') : 
                                            'Não definida'
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </SimpleForm>
        </Edit>
    );
};

export default LicoesConcluidasPessoaEdit;

    

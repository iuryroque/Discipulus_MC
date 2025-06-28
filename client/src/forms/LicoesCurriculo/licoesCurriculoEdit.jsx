import {
    Assignment as AssignmentIcon,
    Book as BookIcon,
    Build as BuildIcon,
    Description as DescriptionIcon,
    Edit as EditIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Help as HelpIcon,
    Info as InfoIcon,
    School as SchoolIcon,
    Sort as SortIcon,
    Timer as TimerIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    Edit,
    Grid,
    IconButton,
    InputAdornment,
    NumberInput,
    Paper,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    Stack,
    TextInput,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { z } from 'zod';
import { useZodValidation } from '../../validation/useZodValidation';

// Schema de validação
const licaoCurriculoSchema = z.object({
    curriculoEstudo: z.object({
        id: z.number().min(1, 'Currículo é obrigatório')
    }),
    numeroLicao: z.number()
        .min(1, 'Número da lição deve ser maior que 0')
        .max(999, 'Número da lição deve ser menor que 999'),
    titulo: z.string()
        .min(3, 'Título deve ter pelo menos 3 caracteres')
        .max(200, 'Título deve ter no máximo 200 caracteres'),
    conteudo: z.string()
        .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
        .max(5000, 'Conteúdo deve ter no máximo 5000 caracteres'),
    duracao: z.string()
        .min(1, 'Duração é obrigatória')
        .regex(/^\d+(\s*-\s*\d+)?\s*(min|hora|horas)?$/i, 'Formato inválido (ex: 45 min, 1 hora, 1-2 horas)'),
    objetivos: z.string()
        .min(10, 'Objetivos devem ter pelo menos 10 caracteres')
        .max(1000, 'Objetivos devem ter no máximo 1000 caracteres')
        .optional(),
    materiais: z.string()
        .min(5, 'Materiais devem ter pelo menos 5 caracteres')
        .max(500, 'Materiais devem ter no máximo 500 caracteres')
        .optional(),
    ordem: z.number()
        .min(1, 'Ordem deve ser maior que 0')
        .max(999, 'Ordem deve ser menor que 999')
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

// Componente de número com validação
const ValidatedNumberField = ({ 
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
                <NumberInput
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

const LicoesCurriculoEdit = props => {
    const theme = useTheme();
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({});

    // Hook de validação
    const { validate, errors, isValid } = useZodValidation(licaoCurriculoSchema);

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
                                Editar Lição do Currículo
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Atualize as informações da lição do currículo
                            </Typography>
                        </Box>
                    </Box>

                    {/* Alertas de validação */}
                    {!isValid && Object.keys(errors).length > 0 && (
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
                                {Object.entries(errors).map(([field, error]) => (
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
                        icon={<BookIcon />}
                        defaultExpanded={true}
                    >
                        <Grid item xs={12} md={6}>
                            <ReferenceInput 
                                source="curriculoEstudo.id" 
                                reference="curriculoEstudo" 
                                label="Currículo de Estudo"
                                variant="outlined"
                                fullWidth
                                required
                                helperText="Selecione o currículo ao qual esta lição pertence"
                            >
                                <SelectInput 
                                    optionText="nome" 
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SchoolIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </ReferenceInput>
                        </Grid>

                        <ValidatedNumberField
                            source="numeroLicao"
                            label="Número da Lição"
                            required
                            startIcon={<SortIcon />}
                            helperText="Número sequencial da lição no currículo"
                            validation="Deve ser um número entre 1 e 999"
                            min={1}
                            max={999}
                        />

                        <ValidatedField
                            source="titulo"
                            label="Título da Lição"
                            required
                            startIcon={<DescriptionIcon />}
                            helperText="Título descritivo da lição"
                            validation="Deve ter entre 3 e 200 caracteres"
                        />

                        <ValidatedField
                            source="duracao"
                            label="Duração"
                            required
                            startIcon={<TimerIcon />}
                            helperText="Ex: 45 min, 1 hora, 1-2 horas"
                            validation="Formato: número + unidade (min/hora)"
                        />
                    </FormSection>

                    {/* Seção: Conteúdo da Lição */}
                    <FormSection 
                        title="Conteúdo da Lição" 
                        icon={<DescriptionIcon />}
                        defaultExpanded={true}
                    >
                        <Grid item xs={12}>
                            <ValidatedField
                                source="conteudo"
                                label="Conteúdo da Lição"
                                multiline
                                rows={6}
                                required
                                helperText="Conteúdo detalhado da lição"
                                validation="Deve ter entre 10 e 5000 caracteres"
                            />
                        </Grid>
                    </FormSection>

                    {/* Seção: Objetivos e Materiais */}
                    <FormSection 
                        title="Objetivos e Materiais" 
                        icon={<AssignmentIcon />}
                        defaultExpanded={false}
                    >
                        <Grid item xs={12}>
                            <ValidatedField
                                source="objetivos"
                                label="Objetivos de Aprendizagem"
                                multiline
                                rows={4}
                                helperText="Objetivos que devem ser alcançados com esta lição"
                                validation="Deve ter entre 10 e 1000 caracteres"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <ValidatedField
                                source="materiais"
                                label="Materiais Necessários"
                                multiline
                                rows={3}
                                helperText="Materiais, recursos ou ferramentas necessários"
                                validation="Deve ter entre 5 e 500 caracteres"
                                startIcon={<BuildIcon />}
                            />
                        </Grid>
                    </FormSection>

                    {/* Seção: Configurações */}
                    <FormSection 
                        title="Configurações" 
                        icon={<SortIcon />}
                        defaultExpanded={false}
                    >
                        <ValidatedNumberField
                            source="ordem"
                            label="Ordem na Grade"
                            required
                            startIcon={<SortIcon />}
                            helperText="Posição da lição na sequência do currículo"
                            validation="Deve ser um número entre 1 e 999"
                            min={1}
                            max={999}
                        />
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
                                        <strong>✓</strong> Mantenha a consistência com outras lições
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>✓</strong> Verifique se a ordem está correta
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>✓</strong> Atualize objetivos se necessário
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>✓</strong> Revise materiais e recursos
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

export default LicoesCurriculoEdit;

    

import {
    Assignment as AssignmentIcon,
    Book as BookIcon,
    Build as BuildIcon,
    Description as DescriptionIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Help as HelpIcon,
    Info as InfoIcon,
    Sort as SortIcon,
    Timer as TimerIcon
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
    Create,
    NumberInput,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextInput
} from 'react-admin';
import { licoesCurriculoSchema } from '../../validation/schemas';
import { useZodValidation } from '../../validation/useZodValidation';

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

const LicoesCurriculoCreate = (props) => {
    const theme = useTheme();
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({});

    // Hook de validação Zod
    const { validate, errors, isValid } = useZodValidation(licoesCurriculoSchema);

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
        <Create {...props}>
            <SimpleForm onSubmit={handleSubmit} onChange={handleFormChange}>
                <Box sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box 
                            sx={{ 
                                p: 2, 
                                borderRadius: 3, 
                                backgroundColor: theme.palette.primary.main + '20',
                                color: theme.palette.primary.main,
                                mr: 3
                            }}
                        >
                            <AssignmentIcon sx={{ fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                                Nova Lição do Currículo
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Crie uma nova lição para o currículo de estudo
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
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>{field}:</strong> {error}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Collapse>

                    {/* Informações Básicas */}
                    <FormSection title="Informações Básicas" icon={<BookIcon />}>
                        <Grid item xs={12}>
                            <ReferenceInput 
                                source="curriculoEstudo.id" 
                                reference="curriculoEstudo"
                                label="Currículo"
                                helperText="Selecione o currículo ao qual esta lição pertence"
                            >
                                <SelectInput 
                                    optionText="nome" 
                                    variant="outlined"
                                    fullWidth
                                />
                            </ReferenceInput>
                        </Grid>
                        
                        <ValidatedNumberField
                            source="numeroLicao"
                            label="Número da Lição"
                            startIcon={<SortIcon />}
                            required
                            helperText="Número sequencial da lição no currículo"
                            validation="Deve ser um número entre 1 e 999"
                        />
                        
                        <ValidatedField
                            source="titulo"
                            label="Título da Lição"
                            startIcon={<AssignmentIcon />}
                            required
                            helperText="Título descritivo da lição"
                            validation="Deve ter entre 3 e 200 caracteres"
                        />
                        
                        <ValidatedNumberField
                            source="ordem"
                            label="Ordem"
                            startIcon={<SortIcon />}
                            required
                            helperText="Ordem de apresentação da lição"
                            validation="Deve ser um número entre 1 e 999"
                        />
                    </FormSection>

                    {/* Conteúdo da Lição */}
                    <FormSection title="Conteúdo da Lição" icon={<DescriptionIcon />}>
                        <Grid item xs={12}>
                            <ValidatedField
                                source="conteudo"
                                label="Conteúdo"
                                multiline
                                rows={6}
                                required
                                helperText="Conteúdo detalhado da lição"
                                validation="Deve ter entre 10 e 5000 caracteres"
                            />
                        </Grid>
                    </FormSection>

                    {/* Configurações da Lição */}
                    <FormSection title="Configurações" icon={<BuildIcon />}>
                        <ValidatedField
                            source="duracao"
                            label="Duração"
                            startIcon={<TimerIcon />}
                            required
                            helperText="Ex: 45 min, 1 hora, 1-2 horas"
                            validation="Formato: número + unidade (min/hora/horas)"
                        />
                        
                        <ValidatedField
                            source="objetivos"
                            label="Objetivos de Aprendizagem"
                            multiline
                            rows={3}
                            helperText="Objetivos que os alunos devem alcançar"
                            validation="Deve ter entre 10 e 1000 caracteres"
                        />
                        
                        <ValidatedField
                            source="materiais"
                            label="Materiais Necessários"
                            multiline
                            rows={2}
                            helperText="Materiais necessários para a lição"
                            validation="Deve ter entre 5 e 500 caracteres"
                        />
                    </FormSection>

                    {/* Card de Resumo */}
                    <Card sx={{ mb: 3, backgroundColor: theme.palette.success.light + '10', border: `1px solid ${theme.palette.success.light}` }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <InfoIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                                <Typography variant="h6" sx={{ color: theme.palette.success.main }}>
                                    Resumo da Lição
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Currículo:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.curriculoEstudo?.nome || 'Não selecionado'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Número:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.numeroLicao || 'Não definido'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Título:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.titulo || 'Não definido'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Duração:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.duracao || 'Não definida'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Ordem:</strong>
                                    </Typography>
                                    <Typography variant="body1">
                                        {formData.ordem || 'Não definida'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </SimpleForm>
        </Create>
    );
};

export default LicoesCurriculoCreate;

    

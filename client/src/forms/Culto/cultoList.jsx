import { Add, Download } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { List, TextInput, useDelete, useNotify, useRedirect } from 'react-admin';
import { CultoGrid } from './components/CultoGrid';

// Filtros que serão enviados para a API
const cultoFilters = [
    <TextInput source="titulo" label="Buscar por Título" alwaysOn />,
    <TextInput source="pregador" label="Pregador" />,
    // Adicione outros filtros se desejar
];

const CultoList = (props) => {
    const redirect = useRedirect();
    const notify = useNotify();
    const [deleteOne] = useDelete();

    const handleEdit = (id) => redirect('edit', 'culto', id);
    const handleShow = (id) => redirect('show', 'culto', id);
    const handleCreate = () => redirect('create', 'culto');
    const handleDelete = (id) => {
         deleteOne('culto', { id }, {
            onSuccess: () => notify('Culto excluído com sucesso!'),
            onError: () => notify('Erro ao excluir culto.', { type: 'error' }),
        });
    };

    return (
        <List
            {...props}
            sort={{ field: 'dataHora', order: 'DESC' }} // Ordena por data no backend
            perPage={12} // Define quantos cards carregar por página
            actions={null}
            component="div"
            title=" "
        >
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>Gestão de Cultos</Typography>
                        <Typography color="text.secondary">Gerencie os cultos e eventos da igreja</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="contained" startIcon={<Download />} disabled={true}>Exportar</Button>
                        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>Novo Culto</Button>
                    </Box>
                </Box>

                <CultoGrid onEdit={handleEdit} onShow={handleShow} onDelete={handleDelete} />
            </Box>
        </List>
    );
};

export default CultoList;
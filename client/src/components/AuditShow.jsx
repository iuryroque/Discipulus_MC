import {
    AccessTime as TimeIcon
} from '@mui/icons-material';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import React from 'react';
import { Show, SimpleShowLayout, useRecordContext } from 'react-admin';
import AuditInfo from './AuditInfo';

const AuditShow = ({ children, showAuditSection = true, auditVariant = 'default', ...props }) => {
    return (
        <Show {...props}>
            <SimpleShowLayout>
                {children}
                
                {showAuditSection && (
                    <AuditSection variant={auditVariant} />
                )}
            </SimpleShowLayout>
        </Show>
    );
};

const AuditSection = ({ variant = 'default' }) => {
    const record = useRecordContext();
    
    if (!record) return null;

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Informações de Auditoria
            </Typography>
            <Card variant="outlined" sx={{ mt: 1 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimeIcon color="primary" />
                        Histórico de Alterações
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <AuditInfo 
                        record={record} 
                        variant={variant} 
                        showLabels={true}
                    />
                </CardContent>
            </Card>
        </Box>
    );
};

export default AuditShow; 
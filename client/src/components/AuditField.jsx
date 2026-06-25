import React from 'react';
import { useRecordContext } from 'react-admin';
import AuditInfo from './AuditInfo';

const AuditField = ({ source, variant = 'default', showLabels = true, ...props }) => {
    const record = useRecordContext();
    
    if (!record) return null;

    // Se source for especificado, usa apenas esse campo
    if (source) {
        const auditRecord = {
            criadoEm: record[source],
            alteradoEm: record[source]
        };
        return <AuditInfo record={auditRecord} variant={variant} showLabels={showLabels} {...props} />;
    }

    // Caso contrário, usa os campos padrão de auditoria
    const auditRecord = {
        criadoEm: record.criadoEm,
        alteradoEm: record.alteradoEm
    };

    return <AuditInfo record={auditRecord} variant={variant} showLabels={showLabels} {...props} />;
};

export default AuditField; 
import React from 'react';
import { Datagrid, DeleteButton, EditButton, List, ShowButton } from 'react-admin';
import AuditField from './AuditField';

const AuditList = ({ 
    children, 
    showAuditInfo = true, 
    auditVariant = 'compact',
    auditPosition = 'end',
    ...props 
}) => {
    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return child;
        }
        return child;
    });

    const auditColumn = showAuditInfo ? (
        <AuditField 
            variant={auditVariant} 
            showLabels={false}
            label="Auditoria"
        />
    ) : null;

    const columns = React.Children.toArray(enhancedChildren);
    
    if (showAuditInfo && auditColumn) {
        if (auditPosition === 'start') {
            columns.unshift(auditColumn);
        } else {
            columns.push(auditColumn);
        }
    }

    return (
        <List {...props}>
            <Datagrid>
                {columns}
                <ShowButton />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    );
};

export default AuditList; 
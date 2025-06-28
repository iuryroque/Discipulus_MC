# Componentes de Auditoria - Frontend

## Visão Geral

Este conjunto de componentes fornece uma interface padronizada para exibir informações de auditoria (`criadoEm` e `alteradoEm`) em todo o sistema frontend.

## Componentes Disponíveis

### 1. AuditInfo
Componente base para exibir informações de auditoria.

**Props:**
- `record`: Objeto com campos `criadoEm` e `alteradoEm`
- `showLabels`: Boolean para mostrar/ocultar labels (padrão: true)
- `variant`: Tipo de exibição ('default', 'compact', 'chips')

**Exemplo:**
```jsx
import AuditInfo from './components/AuditInfo';

<AuditInfo 
    record={pessoa} 
    variant="compact" 
    showLabels={false} 
/>
```

### 2. AuditField
Campo personalizado para React Admin que exibe informações de auditoria.

**Props:**
- `source`: Campo específico para exibir (opcional)
- `variant`: Tipo de exibição
- `showLabels`: Boolean para mostrar/ocultar labels

**Exemplo:**
```jsx
import AuditField from './components/AuditField';

<AuditField 
    variant="compact" 
    label="Auditoria" 
/>
```

### 3. AuditList
Lista personalizada que inclui automaticamente informações de auditoria.

**Props:**
- `showAuditInfo`: Boolean para mostrar/ocultar coluna de auditoria
- `auditVariant`: Tipo de exibição da auditoria
- `auditPosition`: Posição da coluna ('start' ou 'end')

**Exemplo:**
```jsx
import AuditList from './components/AuditList';

<AuditList 
    showAuditInfo={true}
    auditVariant="compact"
    auditPosition="end"
>
    <TextField source="nome" />
    <TextField source="email" />
</AuditList>
```

### 4. AuditShow
Componente de detalhes que inclui seção de auditoria.

**Props:**
- `showAuditSection`: Boolean para mostrar/ocultar seção de auditoria
- `auditVariant`: Tipo de exibição da auditoria

**Exemplo:**
```jsx
import AuditShow from './components/AuditShow';

<AuditShow 
    showAuditSection={true}
    auditVariant="default"
>
    <TextField source="nome" />
    <TextField source="email" />
</AuditShow>
```

## Hook Personalizado

### useAuditFormat
Hook que fornece funções para formatação de datas de auditoria.

**Funções disponíveis:**
- `formatDate`: Formata data completa (dd/mm/yyyy hh:mm)
- `formatDateOnly`: Formata apenas data (dd/mm/yyyy)
- `formatTimeOnly`: Formata apenas hora (hh:mm)
- `getTimeAgo`: Retorna tempo relativo ("2h atrás")
- `isRecentlyModified`: Verifica se foi modificado recentemente

**Exemplo:**
```jsx
import { useAuditFormat } from './hooks/useAuditFormat';

const MyComponent = () => {
    const { formatDate, getTimeAgo, isRecentlyModified } = useAuditFormat();
    
    return (
        <div>
            <p>Criado: {formatDate(record.criadoEm)}</p>
            <p>Modificado: {getTimeAgo(record.alteradoEm)}</p>
            {isRecentlyModified(record.alteradoEm) && (
                <span>Modificado recentemente!</span>
            )}
        </div>
    );
};
```

## Variantes de Exibição

### 1. Default
Exibe informações completas com labels:
```
Criado em: 15/12/2023 14:30
Alterado em: 16/12/2023 09:15
```

### 2. Compact
Exibe informações resumidas sem labels:
```
🕐 2h atrás ✏️ 30 min atrás
```

### 3. Chips
Exibe informações em chips coloridos:
```
[Criado: 15/12/2023 14:30] [Alterado: 16/12/2023 09:15]
```

## Migração de Listas Existentes

### Antes
```jsx
<Datagrid>
    <TextField source="nome" />
    <TextField source="email" />
    <DateField source="criado em" />
    <DateField source="alterado em" />
</Datagrid>
```

### Depois
```jsx
<Datagrid>
    <TextField source="nome" />
    <TextField source="email" />
    <AuditField variant="compact" label="Auditoria" />
</Datagrid>
```

## Migração de Detalhes Existentes

### Antes
```jsx
<SimpleShowLayout>
    <TextField source="nome" />
    <TextField source="email" />
    <DateField source="criado em" />
    <DateField source="alterado em" />
</SimpleShowLayout>
```

### Depois
```jsx
<AuditShow>
    <TextField source="nome" />
    <TextField source="email" />
</AuditShow>
```

## Benefícios

1. **Consistência**: Interface padronizada em todo o sistema
2. **Reutilização**: Componentes podem ser usados em qualquer lugar
3. **Flexibilidade**: Múltiplas variantes de exibição
4. **Manutenibilidade**: Mudanças centralizadas
5. **UX Melhorada**: Informações de auditoria mais legíveis
6. **Responsividade**: Adapta-se a diferentes tamanhos de tela

## Configuração Global

Para aplicar automaticamente em todas as listas, você pode:

1. Substituir `List` por `AuditList` nos componentes
2. Substituir `Show` por `AuditShow` nos componentes
3. Usar `AuditField` em vez de campos de data separados

## Exemplo Completo

```jsx
import React from 'react';
import { TextField, NumberField } from 'react-admin';
import AuditList from './components/AuditList';
import AuditShow from './components/AuditShow';

// Lista com auditoria
const PessoaList = () => (
    <AuditList 
        showAuditInfo={true}
        auditVariant="compact"
        filters={[...]}
    >
        <NumberField source="id" />
        <TextField source="nome" />
        <TextField source="email" />
    </AuditList>
);

// Detalhes com auditoria
const PessoaShow = () => (
    <AuditShow 
        showAuditSection={true}
        auditVariant="default"
    >
        <NumberField source="id" />
        <TextField source="nome" />
        <TextField source="email" />
    </AuditShow>
);
``` 
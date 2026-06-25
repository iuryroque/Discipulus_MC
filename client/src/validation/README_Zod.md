# Zod com React Admin v5 - Guia Completo

## Introdução

Este guia explica como integrar o Zod com React Admin v5 para validação de formulários robusta e type-safe.

## Instalação

```bash
npm install zod @hookform/resolvers
```

## Estrutura de Arquivos

```
src/validation/
├── schemas.js              # Esquemas Zod principais
├── useZodValidation.js     # Hooks personalizados
├── zodConfig.js           # Configuração global do Zod
├── examples.js             # Exemplos avançados
├── testValidation.js       # Testes de validação
├── README_Zod.md          # Esta documentação
└── IMPLEMENTACAO_ZOD.md   # Resumo da implementação
```

## Configuração Global

### Mensagens em Português

O sistema está configurado para exibir todas as mensagens de validação em português. A configuração global está no arquivo `zodConfig.js`:

```javascript
import { z } from 'zod';

// Configuração global do Zod para mensagens em português
z.setErrorMap((error, ctx) => {
  switch (error.code) {
    case z.ZodIssueCode.invalid_type:
      if (error.received === 'undefined' || error.received === 'null') {
        return { message: 'Campo obrigatório' };
      }
      return { message: `Tipo inválido, esperado ${error.expected}` };
    
    case z.ZodIssueCode.invalid_string:
      if (error.validation === 'email') {
        return { message: 'Email inválido' };
      }
      // ... outras validações
  }
});
```

### Mensagens Padrão

```javascript
export const defaultMessages = {
  required: 'Campo obrigatório',
  email: 'Email inválido',
  minLength: (min) => `Mínimo de ${min} caracteres`,
  maxLength: (max) => `Máximo de ${max} caracteres`,
  invalidDate: 'Data inválida',
  invalidPhone: 'Telefone inválido',
  invalidCPF: 'CPF inválido',
  passwordsNotMatch: 'Senhas não coincidem',
  invalidFormat: 'Formato inválido'
};
```

## Uso Básico

### 1. Definindo um Esquema

```javascript
import { z } from 'zod';

export const pessoaSchema = z.object({
  nomeCompleto: z.string()
    .min(1, 'Nome completo é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string()
    .email('Email deve ser válido')
    .optional()
    .or(z.literal('')),
  telefone: z.string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Telefone deve conter apenas números, espaços, hífens, parênteses e +'),
  status: z.enum(['ATIVO', 'INATIVO', 'PENDENTE'], {
    errorMap: () => ({ message: 'Status deve ser ATIVO, INATIVO ou PENDENTE' })
  }).default('ATIVO')
});
```

### 2. Usando no Componente

```javascript
import React from 'react';
import { Create, SimpleForm, TextInput, SelectInput } from 'react-admin';
import { useZodValidation } from '../validation/useZodValidation';
import { pessoaSchema } from '../validation/schemas';

const PessoaCreate = () => {
  const validate = useZodValidation(pessoaSchema);

  return (
    <Create title="Nova Pessoa">
      <SimpleForm validate={validate}>
        <TextInput source="nomeCompleto" />
        <TextInput source="email" />
        <TextInput source="telefone" />
        <SelectInput 
          source="status" 
          choices={[
            { id: 'ATIVO', name: 'Ativo' },
            { id: 'INATIVO', name: 'Inativo' },
            { id: 'PENDENTE', name: 'Pendente' }
          ]}
        />
      </SimpleForm>
    </Create>
  );
};
```

## Hooks Disponíveis

### useZodValidation

Hook principal para validação síncrona:

```javascript
import { useZodValidation } from '../validation/useZodValidation';

const validate = useZodValidation(pessoaSchema);
```

### useAsyncZodValidation

Para validações que dependem de APIs:

```javascript
import { useAsyncZodValidation } from '../validation/useZodValidation';

const validate = useAsyncZodValidation(async (values) => {
  // Lógica assíncrona aqui
  return schema;
});
```

### useFieldValidation

Para validar campos individuais:

```javascript
import { useFieldValidation } from '../validation/useZodValidation';

const validateEmail = useFieldValidation(z.string().email());
```

## Validações Avançadas

### 1. Validação Condicional

```javascript
const conditionalSchema = z.object({
  tipo: z.enum(['MEMBRO', 'VISITANTE']),
  email: z.string().email().optional()
}).refine((data) => {
  if (data.tipo === 'MEMBRO') {
    return data.email && data.email.length > 0;
  }
  return true;
}, {
  message: "Email é obrigatório para membros",
  path: ["email"]
});
```

### 2. Validação de Data

```javascript
const dataSchema = z.object({
  dataNascimento: z.string()
    .refine((val) => {
      if (!val) return true;
      const data = new Date(val);
      const hoje = new Date();
      return data <= hoje;
    }, {
      message: 'Data não pode ser no futuro'
    })
});
```

### 3. Validação de Senha Forte

```javascript
const senhaSchema = z.object({
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/^(?=.*[A-Z])/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/^(?=.*\d)/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"]
});
```

### 4. Validação de CPF Brasileiro

```javascript
const cpfSchema = z.object({
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00')
    .refine((cpf) => {
      // Lógica de validação do CPF aqui
      return true; // Implementar validação real
    }, {
      message: 'CPF inválido'
    })
});
```

## Integração com React Hook Form

O React Admin v5 usa React Hook Form internamente. O Zod se integra perfeitamente:

```javascript
import { zodResolver } from '@hookform/resolvers/zod';

// Em um componente customizado
const CustomForm = () => {
  const methods = useForm({
    resolver: zodResolver(pessoaSchema),
    defaultValues: {
      nomeCompleto: '',
      email: '',
      status: 'ATIVO'
    }
  });

  return (
    <FormProvider {...methods}>
      {/* Seus campos aqui */}
    </FormProvider>
  );
};
```

## Tratamento de Erros

### Personalizando Mensagens de Erro

```javascript
const schema = z.object({
  email: z.string().email('Por favor, insira um email válido'),
  telefone: z.string().min(1, 'Telefone é obrigatório')
});
```

### Erros Customizados

```javascript
const schema = z.object({
  status: z.enum(['ATIVO', 'INATIVO'], {
    errorMap: () => ({ message: 'Status deve ser Ativo ou Inativo' })
  })
});
```

## Testando Validações

### Executar Testes no Console

```javascript
// No console do navegador
import { testValidationMessages, testSchema } from './validation/testValidation';

// Testar todas as mensagens
testValidationMessages();

// Testar um esquema específico
const pessoaSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email()
});

testSchema(pessoaSchema, { nome: 'Jo', email: 'email-invalido' });
```

### Exemplo de Saída dos Testes

```
=== Teste de Mensagens de Validação em Português ===
Campo obrigatório: Campo obrigatório
Email inválido: Email inválido
String muito pequena: Mínimo de 5 caracteres
String muito grande: Máximo de 3 caracteres
Enum inválido: Valor inválido. Opções válidas: ATIVO, INATIVO
Número muito pequeno: Mínimo de 18
Data inválida: Data inválida
=== Fim dos Testes ===
```

## Validações Específicas do Sistema

### Presença

```javascript
export const presencaSchema = z.object({
  pessoa: z.object({
    id: z.number().min(1, 'Pessoa é obrigatória')
  }),
  presente: z.enum(['SIM', 'NAO', 'JUSTIFICADO'], {
    errorMap: () => ({ message: 'Status de presença deve ser SIM, NAO ou JUSTIFICADO' })
  }),
  observacoes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
    .or(z.literal(''))
});
```

### Culto

```javascript
export const cultoSchema = z.object({
  nome: z.string()
    .min(1, 'Nome do culto é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  tipo: z.enum(['DOMINGO', 'MEIO_SEMANA', 'ESPECIAL']),
  dataHora: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Data e hora devem ser válidas'
    }),
  local: z.string().min(1, 'Local é obrigatório')
});
```

## Boas Práticas

### 1. Reutilização de Esquemas

```javascript
// schemas.js
const basePessoaSchema = z.object({
  nomeCompleto: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório')
});

export const pessoaCreateSchema = basePessoaSchema.extend({
  email: z.string().email('Email inválido')
});

export const pessoaEditSchema = basePessoaSchema.extend({
  email: z.string().email('Email inválido').optional()
});
```

### 2. Validações Condicionais

```javascript
const schema = z.object({
  tipo: z.enum(['MEMBRO', 'VISITANTE']),
  email: z.string().email().optional()
}).superRefine((data, ctx) => {
  if (data.tipo === 'MEMBRO' && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Email é obrigatório para membros',
      path: ['email']
    });
  }
});
```

### 3. Transformações

```javascript
const schema = z.object({
  telefone: z.string()
    .transform((val) => val.replace(/[^\d]/g, '')) // Remove caracteres não numéricos
    .refine((val) => val.length === 11, {
      message: 'Telefone deve ter 11 dígitos'
    })
});
```

## Debugging

### Habilitando Logs de Validação

```javascript
const validate = useZodValidation(schema);

// No componente
const handleSubmit = (values) => {
  console.log('Valores sendo validados:', values);
  const errors = validate(values);
  console.log('Erros de validação:', errors);
  return errors;
};
```

### Validação Manual

```javascript
import { pessoaSchema } from '../validation/schemas';

// Testar validação
try {
  const result = pessoaSchema.parse(data);
  console.log('Dados válidos:', result);
} catch (error) {
  console.log('Erros de validação:', error.errors);
}
```

## Migração de Validações Existentes

### Antes (React Admin v4)

```javascript
import { required, minLength, email } from 'react-admin';

<TextInput 
  source="nomeCompleto" 
  validate={[required(), minLength(3)]} 
/>
<TextInput 
  source="email" 
  validate={[email()]} 
/>
```

### Depois (React Admin v5 + Zod)

```javascript
import { useZodValidation } from '../validation/useZodValidation';

const schema = z.object({
  nomeCompleto: z.string().min(1).min(3),
  email: z.string().email()
});

const validate = useZodValidation(schema);

<SimpleForm validate={validate}>
  <TextInput source="nomeCompleto" />
  <TextInput source="email" />
</SimpleForm>
```

## Conclusão

O Zod oferece uma solução robusta e type-safe para validação de formulários no React Admin v5. Com sua integração, você obtém:

- ✅ Validação type-safe
- ✅ Mensagens de erro personalizadas em português
- ✅ Validações condicionais
- ✅ Validações assíncronas
- ✅ Transformações de dados
- ✅ Reutilização de esquemas
- ✅ Debugging facilitado
- ✅ Configuração global para internacionalização

Para mais informações, consulte a [documentação oficial do Zod](https://zod.dev/). 
// Teste específico para validação de hora
import { cultoRecorrenteSchema } from './schemas';

// Teste de validação de hora
export const testHoraValidation = () => {
  console.log('=== Teste de Validação de Hora Melhorada ===');
  
  const testCases = [
    // Formatos válidos
    { input: '19:30', expected: '19:30', description: 'Formato padrão HH:MM' },
    { input: '09:15', expected: '09:15', description: 'Formato com zero à esquerda' },
    { input: '7:30', expected: '07:30', description: 'Formato H:MM (normalizado)' },
    { input: '23:59', expected: '23:59', description: 'Hora limite' },
    { input: '00:00', expected: '00:00', description: 'Meia-noite' },
    { input: '19:30:00', expected: '19:30', description: 'Com segundos (normalizado)' },
    { input: '19:30:45', expected: '19:30', description: 'Com segundos (normalizado)' },
    { input: '19:30:00.000', expected: '19:30', description: 'Com milissegundos (normalizado)' },
    { input: '19:30:00.000Z', expected: '19:30', description: 'Formato ISO (normalizado)' },
    { input: ' 19:30 ', expected: '19:30', description: 'Com espaços (normalizado)' },
    
    // Formatos inválidos
    { input: '25:00', expected: 'error', description: 'Hora inválida (> 23)' },
    { input: '19:60', expected: 'error', description: 'Minuto inválido (> 59)' },
    { input: '19:30:60', expected: 'error', description: 'Segundo inválido (> 59)' },
    { input: '19', expected: 'error', description: 'Formato incompleto' },
    { input: '19:', expected: 'error', description: 'Formato incompleto' },
    { input: ':30', expected: 'error', description: 'Formato incompleto' },
    { input: 'abc', expected: 'error', description: 'Caracteres inválidos' },
    { input: '19:30:abc', expected: 'error', description: 'Segundos inválidos' },
    { input: '', expected: 'error', description: 'Vazio' },
    { input: '   ', expected: 'error', description: 'Apenas espaços' }
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach(({ input, expected, description }) => {
    try {
      const result = cultoRecorrenteSchema.shape.hora.parse(input);
      
      if (expected === 'error') {
        console.log(`❌ "${input}" - DEVERIA FALHAR: ${description}`);
        failed++;
      } else if (result === expected) {
        console.log(`✅ "${input}" -> "${result}" - ${description}`);
        passed++;
      } else {
        console.log(`❌ "${input}" -> "${result}" (esperado: "${expected}") - ${description}`);
        failed++;
      }
    } catch (error) {
      if (expected === 'error') {
        console.log(`✅ "${input}" - FALHOU CORRETAMENTE: ${description}`);
        passed++;
      } else {
        console.log(`❌ "${input}" - FALHOU INESPERADAMENTE: ${error.message} - ${description}`);
        failed++;
      }
    }
  });

  console.log(`\n📊 Resultado: ${passed} passaram, ${failed} falharam`);
  console.log(`🎯 Taxa de sucesso: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
};

// Teste de transformação
export const testHoraTransformation = () => {
  console.log('\n=== Teste de Transformação de Hora ===');
  
  const transformCases = [
    '19:30',
    '7:30',
    '09:15',
    '19:30:00',
    '19:30:45.123',
    '19:30:00.000Z'
  ];

  transformCases.forEach(input => {
    try {
      const result = cultoRecorrenteSchema.shape.hora.parse(input);
      console.log(`"${input}" -> "${result}"`);
    } catch (error) {
      console.log(`"${input}" -> ERRO: ${error.message}`);
    }
  });
};

// Teste de schema completo
export const testCompleteSchemaWithHora = () => {
  console.log('\n=== Teste de Schema Completo com Hora ===');
  
  const testData = {
    titulo: 'Culto de Domingo',
    hora: '19:30:00', // Formato que pode vir do TimeInput
    local: 'Templo Principal',
    descricao: 'Culto dominical',
    pregador: 'Pr. João',
    status: 'Agendado',
    observacoes: 'Observações do culto',
    diaSemana: 'DOMINGO',
    dataInicio: '2025-01-01',
    dataFim: '2025-12-31',
    ativo: true
  };

  try {
    const result = cultoRecorrenteSchema.parse(testData);
    console.log('✅ Schema válido!');
    console.log('Hora original:', testData.hora);
    console.log('Hora normalizada:', result.hora);
  } catch (error) {
    console.log('❌ Erro no schema:', error.errors);
  }
};

// Executar testes no browser
if (typeof window !== 'undefined') {
  window.testHoraValidation = testHoraValidation;
  window.testHoraTransformation = testHoraTransformation;
  window.testCompleteSchemaWithHora = testCompleteSchemaWithHora;
  
  console.log('Testes de hora disponíveis:');
  console.log('- testHoraValidation()');
  console.log('- testHoraTransformation()');
  console.log('- testCompleteSchemaWithHora()');
} 
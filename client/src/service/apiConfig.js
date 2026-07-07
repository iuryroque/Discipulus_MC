// URL base da API.
// Em produção (vite build) as chamadas ficam relativas ao próprio domínio:
// o nginx do container faz o proxy de /api/ para o backend. Em
// desenvolvimento cai no localhost:8080. VITE_API_URL sobrescreve ambos.
export const apiUrl =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? '/api' : 'http://localhost:8080');

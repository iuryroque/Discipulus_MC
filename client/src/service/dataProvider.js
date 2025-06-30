import { stringify } from 'query-string';
import { fetchUtils } from 'react-admin';

const apiUrl = 'http://localhost:8080';

const httpClient = (url, options = {}) => {
    let token = localStorage.getItem('auth');
    if(token){
        token = JSON.parse(token).accessToken
    }

    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // Inclui o token no cabeçalho Authorization se existir
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }
    return fetchUtils.fetchJson(url, options);
};

export default {
    getList: (resource, params) => {
       /*filtros padrões*/ 
       const { page, perPage } = params.pagination;
       const {order, field } = params.sort;
       const filter = encodeURIComponent(JSON.stringify(params.filter))
       
      // Endpoint especial para cards de pessoa
      let url = `${apiUrl}/${resource}`;
      if (resource === 'pessoa/cards') {
          url = `${apiUrl}/pessoa/cards`;
          return httpClient(url).then((response) => ({
              data: response.json.data,
              total: response.json.total
          }));
      }
      
      url += `?linesPerPage=${perPage}&orderBy=${field}&direction=${order}&page=${page-1}&filter=${filter}`;
      
       return httpClient(url).then((response) => ({
           data: response.json.content,
           total: response.json.totalPages
       }));
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        
        return httpClient(`${apiUrl}/${resource}/many/${params.ids}`, {
            method: 'GET',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    updateMany: (resource, params) => {
        
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
           
        })),

    delete: (resource, params) =>
        
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany:(resource, params) => {

        return httpClient(`${apiUrl}/${resource}/many/${params.ids}`, {
            method: 'DELETE',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },
};
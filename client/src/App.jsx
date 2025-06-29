// src/App.jsx

import React from 'react';
import { Admin, Resource } from 'react-admin';

// Importe seu novo Layout
import MyLayout from './components/layout/MyLayout';

// Suas importações existentes
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import i18nProvider from './i18n/index.js';
import authProvider from './service/authProvider';
import dataProvider from './service/dataProvider';
import myTheme from './theme/myTheme';

import {
  Book,
  CheckCircle,
  Event,
  LibraryBooks,
  Notifications,
  People,
  School,
  TaskAlt
} from '@mui/icons-material';

// Suas importações de componentes de CRUD (Create, Read, Update, Delete)
import acompanhamentoEstudoCreate from './forms/AcompanhamentoEstudo/acompanhamentoEstudoCreate';
import acompanhamentoEstudoEdit from './forms/AcompanhamentoEstudo/acompanhamentoEstudoEdit';
import acompanhamentoEstudoList from './forms/AcompanhamentoEstudo/acompanhamentoEstudoList';
import alertasCreate from './forms/Alertas/alertasCreate';
import alertasEdit from './forms/Alertas/alertasEdit';
import alertasList from './forms/Alertas/alertasList';
import cultoCreate from './forms/Culto/cultoCreate';
import cultoEdit from './forms/Culto/cultoEdit';
import cultoList from './forms/Culto/cultoList';
import curriculoEstudoCreate from './forms/CurriculoEstudo/curriculoEstudoCreate';
import curriculoEstudoEdit from './forms/CurriculoEstudo/curriculoEstudoEdit';
import curriculoEstudoList from './forms/CurriculoEstudo/curriculoEstudoList';
import licoesConcluidasPessoaCreate from './forms/LicoesConcluidasPessoa/licoesConcluidasPessoaCreate';
import licoesConcluidasPessoaEdit from './forms/LicoesConcluidasPessoa/licoesConcluidasPessoaEdit';
import licoesConcluidasPessoaList from './forms/LicoesConcluidasPessoa/licoesConcluidasPessoaList';
import licoesCurriculoCreate from './forms/LicoesCurriculo/licoesCurriculoCreate';
import licoesCurriculoEdit from './forms/LicoesCurriculo/licoesCurriculoEdit';
import licoesCurriculoList from './forms/LicoesCurriculo/licoesCurriculoList';
import pessoaCreate from './forms/Pessoa/pessoaCreate';
import pessoaEdit from './forms/Pessoa/pessoaEdit';
import pessoaList from './forms/Pessoa/pessoaList';
import pessoaShow from './forms/Pessoa/pessoaShow';
import presencaCreate from './forms/Presenca/presencaCreate';
import presencaEdit from './forms/Presenca/presencaEdit';
import presencaList from './forms/Presenca/presencaList';
import presencaShow from './forms/Presenca/presencaShow';


function App() {
  return (
    <div className="App">
      <Admin 
        dataProvider={dataProvider} 
        authProvider={authProvider} 
        i18nProvider={i18nProvider}
        loginPage={LoginPage}
        dashboard={Dashboard}
        theme={myTheme}
        // A grande mudança está aqui:
        layout={MyLayout}
      >
        {/*
          IMPORTANTE: Todos os Resources devem continuar aqui.
          Eles registram as rotas (/pessoa, /presenca, etc) no React-Admin.
          O nosso menu customizado apenas controla como os links para eles são exibidos.
        */}
        <Resource name="pessoa" list={pessoaList} create={pessoaCreate} edit={pessoaEdit} show={pessoaShow} icon={People} options={{ label: 'Pessoas' }} />
        <Resource name="presenca" list={presencaList} create={presencaCreate} edit={presencaEdit} show={presencaShow} icon={CheckCircle} options={{ label: 'Controle de Presença' }} />
        <Resource name="culto" list={cultoList} create={cultoCreate} edit={cultoEdit} icon={Event} options={{ label: 'Cultos e Eventos' }} />
        <Resource name="acompanhamentoEstudo" list={acompanhamentoEstudoList} create={acompanhamentoEstudoCreate} edit={acompanhamentoEstudoEdit} icon={School} options={{ label: 'Acompanhamento de Estudos' }} />
        <Resource name="curriculoEstudo" list={curriculoEstudoList} create={curriculoEstudoCreate} edit={curriculoEstudoEdit} icon={LibraryBooks} options={{ label: 'Estudos' }} />
        <Resource name="licoesCurriculo" list={licoesCurriculoList} create={licoesCurriculoCreate} edit={licoesCurriculoEdit} icon={Book} options={{ label: 'Lições' }} />
        <Resource name="licoesConcluidasPessoa" list={licoesConcluidasPessoaList} create={licoesConcluidasPessoaCreate} edit={licoesConcluidasPessoaEdit} icon={TaskAlt} options={{ label: 'Lições Concluídas' }} />
        <Resource name="alertas" list={alertasList} create={alertasCreate} edit={alertasEdit} icon={Notifications} options={{ label: 'Alertas e Notificações' }} />
      </Admin>
    </div>
  )
}

export default App;
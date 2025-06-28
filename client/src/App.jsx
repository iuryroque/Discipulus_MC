import React from 'react';
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
import { Admin, Resource } from 'react-admin';
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
       >
            {/* Gestão de Pessoas */}
            <Resource 
              name="pessoa" 
              create={pessoaCreate} 
              list={pessoaList} 
              edit={pessoaEdit} 
              show={pessoaShow}
              icon={People}
              options={{ label: 'Pessoas' }}
            />
            
            {/* Gestão de Presença */}
            <Resource 
              name="presenca" 
              create={presencaCreate} 
              list={presencaList} 
              edit={presencaEdit} 
              show={presencaShow} 
              icon={CheckCircle}
              options={{ label: 'Controle de Presença' }}
            />
            
            {/* Gestão de Cultos */}
            <Resource 
              name="culto" 
              create={cultoCreate} 
              list={cultoList} 
              edit={cultoEdit} 
              icon={Event}
              options={{ label: 'Cultos e Eventos' }}
            />
            
            {/* Gestão de Estudos */}
            <Resource 
              name="acompanhamentoEstudo" 
              create={acompanhamentoEstudoCreate} 
              list={acompanhamentoEstudoList} 
              edit={acompanhamentoEstudoEdit} 
              icon={School}
              options={{ label: 'Acompanhamento de Estudos' }}
            />
            
            {/* Currículo de Estudos */}
            <Resource 
              name="curriculoEstudo" 
              create={curriculoEstudoCreate} 
              list={curriculoEstudoList} 
              edit={curriculoEstudoEdit} 
              icon={LibraryBooks}
              options={{ label: 'Currículo de Estudos' }}
            />
            
            {/* Lições do Currículo */}
            <Resource 
              name="licoesCurriculo" 
              create={licoesCurriculoCreate} 
              list={licoesCurriculoList} 
              edit={licoesCurriculoEdit} 
              icon={Book}
              options={{ label: 'Lições do Currículo' }}
            />
            
            {/* Lições Concluídas */}
            <Resource 
              name="licoesConcluidasPessoa" 
              create={licoesConcluidasPessoaCreate} 
              list={licoesConcluidasPessoaList} 
              edit={licoesConcluidasPessoaEdit} 
              icon={TaskAlt}
              options={{ label: 'Lições Concluídas' }}
            />
            
            {/* Sistema de Alertas */}
            <Resource 
              name="alertas" 
              create={alertasCreate} 
              list={alertasList} 
              edit={alertasEdit} 
              icon={Notifications}
              options={{ label: 'Alertas e Notificações' }}
            />
        </Admin>
    </div>
  )
}

export default App

    

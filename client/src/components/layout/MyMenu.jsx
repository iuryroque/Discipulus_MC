import {
    CheckCircle,
    Event,
    Home,
    Notifications,
    People,
    ViewModule
} from '@mui/icons-material';
import { Collapse, List } from '@mui/material';
import React, { useState } from 'react';
import { DashboardMenuItem, MenuItemLink, useSidebarState } from 'react-admin';

const MyMenu = ({ onMenuClick }) => {
  const [open, setOpen] = useSidebarState();
  // Estado para controlar apenas o nosso submenu de Currículo
  const [isCurriculoOpen, setIsCurriculoOpen] = useState(true);

  const handleCurriculoClick = () => {
    setIsCurriculoOpen(!isCurriculoOpen);
  };

  return (
    <List>
      {/* Item do Dashboard */}
      <DashboardMenuItem leftIcon={<Home />} onClick={onMenuClick} sidebarIsOpen={open} />

      {/* Itens de menu que continuarão no nível principal */}
      <MenuItemLink to="/pessoa" primaryText="Pessoas" leftIcon={<People />} onClick={onMenuClick} sidebarIsOpen={open} />
      <MenuItemLink to="/pessoa/cards" primaryText="Visitantes" leftIcon={<ViewModule />} onClick={onMenuClick} sidebarIsOpen={open} />
      <MenuItemLink to="/presenca" primaryText="Controle de Presença" leftIcon={<CheckCircle />} onClick={onMenuClick} sidebarIsOpen={open} />
      <MenuItemLink to="/culto" primaryText="Cultos e Eventos" leftIcon={<Event />} onClick={onMenuClick} sidebarIsOpen={open} />
      {/* <MenuItemLink to="/acompanhamentoEstudo" primaryText="Acompanhamento de Estudos" leftIcon={<School />} onClick={onMenuClick} sidebarIsOpen={open} /> */}
      
      {/* --- Início do Submenu de Currículo --- */}
      {/* <ListItem button onClick={handleCurriculoClick}>
        <ListItemIcon><LibraryBooks /></ListItemIcon>
        <ListItemText primary="Gerenciar Currículo" />
        {isCurriculoOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem> */}
      <Collapse in={isCurriculoOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Item "Estudos" dentro do submenu */}
          {/* <MenuItemLink
            to="/curriculoEstudo"
            primaryText="Estudos"
            leftIcon={<LibraryBooks />}
            onClick={onMenuClick}
            sidebarIsOpen={open}
            sx={{ pl: 4 }} // Padding para identação
          /> */}
          {/* Item "Lições" dentro do submenu */}
          {/* <MenuItemLink
            to="/licoesCurriculo"
            primaryText="Lições"
            leftIcon={<Book />}
            onClick={onMenuClick}
            sidebarIsOpen={open}
            sx={{ pl: 4 }} // Padding para identação
          /> */}
        </List>
      </Collapse>
      {/* --- Fim do Submenu de Currículo --- */}

      {/* Restante dos itens de menu */}
      {/* <MenuItemLink to="/licoesConcluidasPessoa" primaryText="Lições Concluídas" leftIcon={<TaskAlt />} onClick={onMenuClick} sidebarIsOpen={open} /> */}
      <MenuItemLink to="/alertas" primaryText="Alertas e Notificações" leftIcon={<Notifications />} onClick={onMenuClick} sidebarIsOpen={open} />
    </List>
  );
};

export default MyMenu;
import React from 'react';
import { 
  Switch,
  Route
} from 'react-router-dom'
import PropTypes from 'prop-types';

import CuadranteTable from './models-tables/cuadrante-table/CuadranteEnhancedTable'
import GrupoEnfoqueTable from './models-tables/grupo_enfoque-table/Grupo_enfoqueEnhancedTable'
import SitioTable from './models-tables/sitio-table/SitioEnhancedTable'
import TaxonTable from './models-tables/taxon-table/TaxonEnhancedTable'
import TipoPlantaTable from './models-tables/tipo_planta-table/Tipo_plantaEnhancedTable'
import RoleTable from './admin-tables/role-table/RoleEnhancedTable'
import RoleToUserTable from './admin-tables/role_to_user-table/Role_to_userEnhancedTable'
import UserTable from './admin-tables/user-table/UserEnhancedTable'
import NotFoundSection from '../pages/NotFoundSectionPage'
import NoPermissionSectionPage from '../pages/NoPermissionSectionPage'

export default function TablesSwitch(props) {
  const { permissions } = props;

  return (
    
    <Switch>

        {/* Models */}
        <Route exact path="/main/model/cuadrante" 
          render={
            /* acl check */
            (permissions&&permissions.cuadrante&&Array.isArray(permissions.cuadrante)
            &&(permissions.cuadrante.includes('read') || permissions.cuadrante.includes('*')))
            ? ((props) => <CuadranteTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/grupo_enfoque" 
          render={
            /* acl check */
            (permissions&&permissions.grupo_enfoque&&Array.isArray(permissions.grupo_enfoque)
            &&(permissions.grupo_enfoque.includes('read') || permissions.grupo_enfoque.includes('*')))
            ? ((props) => <GrupoEnfoqueTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/sitio" 
          render={
            /* acl check */
            (permissions&&permissions.sitio&&Array.isArray(permissions.sitio)
            &&(permissions.sitio.includes('read') || permissions.sitio.includes('*')))
            ? ((props) => <SitioTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/taxon" 
          render={
            /* acl check */
            (permissions&&permissions.taxon&&Array.isArray(permissions.taxon)
            &&(permissions.taxon.includes('read') || permissions.taxon.includes('*')))
            ? ((props) => <TaxonTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/tipo_planta" 
          render={
            /* acl check */
            (permissions&&permissions.tipo_planta&&Array.isArray(permissions.tipo_planta)
            &&(permissions.tipo_planta.includes('read') || permissions.tipo_planta.includes('*')))
            ? ((props) => <TipoPlantaTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />

        {/* Admin models */}
        <Route exact path="/main/admin/role" 
          render={
            /* acl check */
            (permissions&&permissions.role&&Array.isArray(permissions.role)
            &&(permissions.role.includes('read') || permissions.role.includes('*')))
            ? ((props) => <RoleTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/admin/role_to_user" 
          render={
            /* acl check */
            (permissions&&permissions.role_to_user&&Array.isArray(permissions.role_to_user)
            &&(permissions.role_to_user.includes('read') || permissions.role_to_user.includes('*')))
            ? ((props) => <RoleToUserTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/admin/user" 
          render={
            /* acl check */
            (permissions&&permissions.user&&Array.isArray(permissions.user)
            &&(permissions.user.includes('read') || permissions.user.includes('*')))
            ? ((props) => <UserTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />

        {/* Default */}
        <Route path="/main/" component={NotFoundSection} />

    </Switch>
  );
}

TablesSwitch.propTypes = {
  permissions: PropTypes.object,
};
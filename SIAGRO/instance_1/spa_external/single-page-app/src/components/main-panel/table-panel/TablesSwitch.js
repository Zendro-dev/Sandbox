import React, { Suspense, lazy } from 'react';
import { 
  Switch,
  Route
} from 'react-router-dom'
import PropTypes from 'prop-types';
import NotFoundSection from '../pages/NotFoundSectionPage'
import NoPermissionSectionPage from '../pages/NoPermissionSectionPage'
const CaracteristicaCuantitativaTable = lazy(() => import(/* webpackChunkName: "Table-CaracteristicaCuantitativa" */ './models-tables/caracteristica_cuantitativa-table/Caracteristica_cuantitativaEnhancedTable'));
const MetodoTable = lazy(() => import(/* webpackChunkName: "Table-Metodo" */ './models-tables/metodo-table/MetodoEnhancedTable'));
const ReferenciaTable = lazy(() => import(/* webpackChunkName: "Table-Referencia" */ './models-tables/referencia-table/ReferenciaEnhancedTable'));
const TaxonTable = lazy(() => import(/* webpackChunkName: "Table-Taxon" */ './models-tables/taxon-table/TaxonEnhancedTable'));
const RoleTable = lazy(() => import(/* webpackChunkName: "Table-Role" */ './admin-tables/role-table/RoleEnhancedTable'));
const RoleToUserTable = lazy(() => import(/* webpackChunkName: "Table-RoleToUser" */ './admin-tables/role_to_user-table/Role_to_userEnhancedTable'));
const UserTable = lazy(() => import(/* webpackChunkName: "Table-User" */ './admin-tables/user-table/UserEnhancedTable'));

export default function TablesSwitch(props) {
  const { permissions } = props;

  return (
    
    <Suspense fallback={<div />}>
      <Switch>
        {/* Models */}
        <Route exact path="/main/model/caracteristica_cuantitativa" 
          render={
            /* acl check */
            (permissions&&permissions.caracteristica_cuantitativa&&Array.isArray(permissions.caracteristica_cuantitativa)
            &&(permissions.caracteristica_cuantitativa.includes('read') || permissions.caracteristica_cuantitativa.includes('*')))
            ? ((props) => <CaracteristicaCuantitativaTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/metodo" 
          render={
            /* acl check */
            (permissions&&permissions.metodo&&Array.isArray(permissions.metodo)
            &&(permissions.metodo.includes('read') || permissions.metodo.includes('*')))
            ? ((props) => <MetodoTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/referencia" 
          render={
            /* acl check */
            (permissions&&permissions.referencia&&Array.isArray(permissions.referencia)
            &&(permissions.referencia.includes('read') || permissions.referencia.includes('*')))
            ? ((props) => <ReferenciaTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/taxon" 
          render={
            /* acl check */
            (permissions&&permissions.taxon&&Array.isArray(permissions.taxon)
            &&(permissions.taxon.includes('read') || permissions.taxon.includes('*')))
            ? ((props) => <TaxonTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
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
    </Suspense>
  );
}

TablesSwitch.propTypes = {
  permissions: PropTypes.object,
};

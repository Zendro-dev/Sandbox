import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { retry } from '../../../utils.js';
import PropTypes from 'prop-types';
import NotFoundSection from '../pages/NotFoundSectionPage';
import NoPermissionSectionPage from '../pages/NoPermissionSectionPage';
import ErrorBoundary from '../../pages/ErrorBoundary';

//lazy loading
const AlienTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-Alien" */ './models-tables/alien-table/AlienEnhancedTable')));
const CapitalTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-Capital" */ './models-tables/capital-table/CapitalEnhancedTable')));
const ContinentTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-Continent" */ './models-tables/continent-table/ContinentEnhancedTable')));
const CountryTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-Country" */ './models-tables/country-table/CountryEnhancedTable')));
const RiverTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-River" */ './models-tables/river-table/RiverEnhancedTable')));
const RoleTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-Role" */ './admin-tables/role-table/RoleEnhancedTable')));
const RoleToUserTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-RoleToUser" */ './admin-tables/role_to_user-table/Role_to_userEnhancedTable')));
const UserTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-User" */ './admin-tables/user-table/UserEnhancedTable')));

export default function TablesSwitch(props) {
  const { permissions } = props;

  return (
    
    <Suspense fallback={<div />}>
      <Switch>
        {/* Models */}
        <Route exact path="/main/model/alien" 
          render={
            /* acl check */
            (permissions&&permissions.alien&&Array.isArray(permissions.alien)
            &&(permissions.alien.includes('read') || permissions.alien.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><AlienTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/capital" 
          render={
            /* acl check */
            (permissions&&permissions.capital&&Array.isArray(permissions.capital)
            &&(permissions.capital.includes('read') || permissions.capital.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><CapitalTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/continent" 
          render={
            /* acl check */
            (permissions&&permissions.continent&&Array.isArray(permissions.continent)
            &&(permissions.continent.includes('read') || permissions.continent.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><ContinentTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/country" 
          render={
            /* acl check */
            (permissions&&permissions.country&&Array.isArray(permissions.country)
            &&(permissions.country.includes('read') || permissions.country.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><CountryTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/river" 
          render={
            /* acl check */
            (permissions&&permissions.river&&Array.isArray(permissions.river)
            &&(permissions.river.includes('read') || permissions.river.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><RiverTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />

        {/* Admin models */}
        <Route exact path="/main/admin/role" 
          render={
            /* acl check */
            (permissions&&permissions.role&&Array.isArray(permissions.role)
            &&(permissions.role.includes('read') || permissions.role.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><RoleTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/admin/role_to_user" 
          render={
            /* acl check */
            (permissions&&permissions.role_to_user&&Array.isArray(permissions.role_to_user)
            &&(permissions.role_to_user.includes('read') || permissions.role_to_user.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><RoleToUserTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/admin/user" 
          render={
            /* acl check */
            (permissions&&permissions.user&&Array.isArray(permissions.user)
            &&(permissions.user.includes('read') || permissions.user.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><UserTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
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

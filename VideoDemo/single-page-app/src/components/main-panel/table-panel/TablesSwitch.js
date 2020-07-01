import React from 'react';
import { 
  Switch,
  Route
} from 'react-router-dom'
import PropTypes from 'prop-types';

import PlantVariantTable from './models-tables/plant_variant-table/Plant_variantEnhancedTable'
import TomatoMeasurementTable from './models-tables/tomato_Measurement-table/Tomato_MeasurementEnhancedTable'
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
        <Route exact path="/main/model/plant_variant" 
          render={
            /* acl check */
            (permissions&&permissions.plant_variant&&Array.isArray(permissions.plant_variant)
            &&(permissions.plant_variant.includes('read') || permissions.plant_variant.includes('*')))
            ? ((props) => <PlantVariantTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/tomato_Measurement" 
          render={
            /* acl check */
            (permissions&&permissions.tomato_Measurement&&Array.isArray(permissions.tomato_Measurement)
            &&(permissions.tomato_Measurement.includes('read') || permissions.tomato_Measurement.includes('*')))
            ? ((props) => <TomatoMeasurementTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
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

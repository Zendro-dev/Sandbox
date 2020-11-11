import React, { Suspense, lazy } from 'react';
import { 
  Switch,
  Route
} from 'react-router-dom'
import PropTypes from 'prop-types';
import NotFoundSection from '../pages/NotFoundSectionPage'
import NoPermissionSectionPage from '../pages/NoPermissionSectionPage'
const AssayTable = lazy(() => import('./models-tables/assay-table/AssayEnhancedTable'));
const AssayResultTable = lazy(() => import('./models-tables/assayResult-table/AssayResultEnhancedTable'));
const ContactTable = lazy(() => import('./models-tables/contact-table/ContactEnhancedTable'));
const FactorTable = lazy(() => import('./models-tables/factor-table/FactorEnhancedTable'));
const FileAttachmentTable = lazy(() => import('./models-tables/fileAttachment-table/FileAttachmentEnhancedTable'));
const InvestigationTable = lazy(() => import('./models-tables/investigation-table/InvestigationEnhancedTable'));
const MaterialTable = lazy(() => import('./models-tables/material-table/MaterialEnhancedTable'));
const OntologyAnnotationTable = lazy(() => import('./models-tables/ontologyAnnotation-table/OntologyAnnotationEnhancedTable'));
const ProtocolTable = lazy(() => import('./models-tables/protocol-table/ProtocolEnhancedTable'));
const StudyTable = lazy(() => import('./models-tables/study-table/StudyEnhancedTable'));
const RoleTable = lazy(() => import('./admin-tables/role-table/RoleEnhancedTable'));
const RoleToUserTable = lazy(() => import('./admin-tables/role_to_user-table/Role_to_userEnhancedTable'));
const UserTable = lazy(() => import('./admin-tables/user-table/UserEnhancedTable'));

export default function TablesSwitch(props) {
  const { permissions } = props;

  return (
    
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {/* Models */}
        <Route exact path="/main/model/assay" 
          render={
            /* acl check */
            (permissions&&permissions.assay&&Array.isArray(permissions.assay)
            &&(permissions.assay.includes('read') || permissions.assay.includes('*')))
            ? ((props) => <AssayTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/assayResult" 
          render={
            /* acl check */
            (permissions&&permissions.assayResult&&Array.isArray(permissions.assayResult)
            &&(permissions.assayResult.includes('read') || permissions.assayResult.includes('*')))
            ? ((props) => <AssayResultTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/contact" 
          render={
            /* acl check */
            (permissions&&permissions.contact&&Array.isArray(permissions.contact)
            &&(permissions.contact.includes('read') || permissions.contact.includes('*')))
            ? ((props) => <ContactTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/factor" 
          render={
            /* acl check */
            (permissions&&permissions.factor&&Array.isArray(permissions.factor)
            &&(permissions.factor.includes('read') || permissions.factor.includes('*')))
            ? ((props) => <FactorTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/fileAttachment" 
          render={
            /* acl check */
            (permissions&&permissions.fileAttachment&&Array.isArray(permissions.fileAttachment)
            &&(permissions.fileAttachment.includes('read') || permissions.fileAttachment.includes('*')))
            ? ((props) => <FileAttachmentTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/investigation" 
          render={
            /* acl check */
            (permissions&&permissions.investigation&&Array.isArray(permissions.investigation)
            &&(permissions.investigation.includes('read') || permissions.investigation.includes('*')))
            ? ((props) => <InvestigationTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/material" 
          render={
            /* acl check */
            (permissions&&permissions.material&&Array.isArray(permissions.material)
            &&(permissions.material.includes('read') || permissions.material.includes('*')))
            ? ((props) => <MaterialTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/ontologyAnnotation" 
          render={
            /* acl check */
            (permissions&&permissions.ontologyAnnotation&&Array.isArray(permissions.ontologyAnnotation)
            &&(permissions.ontologyAnnotation.includes('read') || permissions.ontologyAnnotation.includes('*')))
            ? ((props) => <OntologyAnnotationTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/protocol" 
          render={
            /* acl check */
            (permissions&&permissions.protocol&&Array.isArray(permissions.protocol)
            &&(permissions.protocol.includes('read') || permissions.protocol.includes('*')))
            ? ((props) => <ProtocolTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/study" 
          render={
            /* acl check */
            (permissions&&permissions.study&&Array.isArray(permissions.study)
            &&(permissions.study.includes('read') || permissions.study.includes('*')))
            ? ((props) => <StudyTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
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

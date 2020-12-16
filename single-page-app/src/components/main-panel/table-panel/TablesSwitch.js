import React, { Suspense, lazy } from 'react';
import { 
  Switch,
  Route
} from 'react-router-dom'
import PropTypes from 'prop-types';
import NotFoundSection from '../pages/NotFoundSectionPage'
import NoPermissionSectionPage from '../pages/NoPermissionSectionPage'
const BreedingMethodTable = lazy(() => import(/* webpackChunkName: "Table-BreedingMethod" */ './models-tables/breedingMethod-table/BreedingMethodEnhancedTable'));
const ContactTable = lazy(() => import(/* webpackChunkName: "Table-Contact" */ './models-tables/contact-table/ContactEnhancedTable'));
const EnvironmentParameterTable = lazy(() => import(/* webpackChunkName: "Table-EnvironmentParameter" */ './models-tables/environmentParameter-table/EnvironmentParameterEnhancedTable'));
const EventTable = lazy(() => import(/* webpackChunkName: "Table-Event" */ './models-tables/event-table/EventEnhancedTable'));
const EventParameterTable = lazy(() => import(/* webpackChunkName: "Table-EventParameter" */ './models-tables/eventParameter-table/EventParameterEnhancedTable'));
const GermplasmTable = lazy(() => import(/* webpackChunkName: "Table-Germplasm" */ './models-tables/germplasm-table/GermplasmEnhancedTable'));
const ImageTable = lazy(() => import(/* webpackChunkName: "Table-Image" */ './models-tables/image-table/ImageEnhancedTable'));
const LocationTable = lazy(() => import(/* webpackChunkName: "Table-Location" */ './models-tables/location-table/LocationEnhancedTable'));
const MethodTable = lazy(() => import(/* webpackChunkName: "Table-Method" */ './models-tables/method-table/MethodEnhancedTable'));
const ObservationTable = lazy(() => import(/* webpackChunkName: "Table-Observation" */ './models-tables/observation-table/ObservationEnhancedTable'));
const ObservationTreatmentTable = lazy(() => import(/* webpackChunkName: "Table-ObservationTreatment" */ './models-tables/observationTreatment-table/ObservationTreatmentEnhancedTable'));
const ObservationUnitTable = lazy(() => import(/* webpackChunkName: "Table-ObservationUnit" */ './models-tables/observationUnit-table/ObservationUnitEnhancedTable'));
const ObservationUnitPositionTable = lazy(() => import(/* webpackChunkName: "Table-ObservationUnitPosition" */ './models-tables/observationUnitPosition-table/ObservationUnitPositionEnhancedTable'));
const ObservationVariableTable = lazy(() => import(/* webpackChunkName: "Table-ObservationVariable" */ './models-tables/observationVariable-table/ObservationVariableEnhancedTable'));
const OntologyReferenceTable = lazy(() => import(/* webpackChunkName: "Table-OntologyReference" */ './models-tables/ontologyReference-table/OntologyReferenceEnhancedTable'));
const ProgramTable = lazy(() => import(/* webpackChunkName: "Table-Program" */ './models-tables/program-table/ProgramEnhancedTable'));
const ScaleTable = lazy(() => import(/* webpackChunkName: "Table-Scale" */ './models-tables/scale-table/ScaleEnhancedTable'));
const SeasonTable = lazy(() => import(/* webpackChunkName: "Table-Season" */ './models-tables/season-table/SeasonEnhancedTable'));
const StudyTable = lazy(() => import(/* webpackChunkName: "Table-Study" */ './models-tables/study-table/StudyEnhancedTable'));
const TraitTable = lazy(() => import(/* webpackChunkName: "Table-Trait" */ './models-tables/trait-table/TraitEnhancedTable'));
const TrialTable = lazy(() => import(/* webpackChunkName: "Table-Trial" */ './models-tables/trial-table/TrialEnhancedTable'));
const RoleTable = lazy(() => import(/* webpackChunkName: "Table-Role" */ './admin-tables/role-table/RoleEnhancedTable'));
const RoleToUserTable = lazy(() => import(/* webpackChunkName: "Table-RoleToUser" */ './admin-tables/role_to_user-table/Role_to_userEnhancedTable'));
const UserTable = lazy(() => import(/* webpackChunkName: "Table-User" */ './admin-tables/user-table/UserEnhancedTable'));

export default function TablesSwitch(props) {
  const { permissions } = props;

  return (
    
    <Suspense fallback={<div />}>
      <Switch>
        {/* Models */}
        <Route exact path="/main/model/breedingMethod" 
          render={
            /* acl check */
            (permissions&&permissions.breedingMethod&&Array.isArray(permissions.breedingMethod)
            &&(permissions.breedingMethod.includes('read') || permissions.breedingMethod.includes('*')))
            ? ((props) => <BreedingMethodTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/contact" 
          render={
            /* acl check */
            (permissions&&permissions.contact&&Array.isArray(permissions.contact)
            &&(permissions.contact.includes('read') || permissions.contact.includes('*')))
            ? ((props) => <ContactTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/environmentParameter" 
          render={
            /* acl check */
            (permissions&&permissions.environmentParameter&&Array.isArray(permissions.environmentParameter)
            &&(permissions.environmentParameter.includes('read') || permissions.environmentParameter.includes('*')))
            ? ((props) => <EnvironmentParameterTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/event" 
          render={
            /* acl check */
            (permissions&&permissions.event&&Array.isArray(permissions.event)
            &&(permissions.event.includes('read') || permissions.event.includes('*')))
            ? ((props) => <EventTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/eventParameter" 
          render={
            /* acl check */
            (permissions&&permissions.eventParameter&&Array.isArray(permissions.eventParameter)
            &&(permissions.eventParameter.includes('read') || permissions.eventParameter.includes('*')))
            ? ((props) => <EventParameterTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/germplasm" 
          render={
            /* acl check */
            (permissions&&permissions.germplasm&&Array.isArray(permissions.germplasm)
            &&(permissions.germplasm.includes('read') || permissions.germplasm.includes('*')))
            ? ((props) => <GermplasmTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/image" 
          render={
            /* acl check */
            (permissions&&permissions.image&&Array.isArray(permissions.image)
            &&(permissions.image.includes('read') || permissions.image.includes('*')))
            ? ((props) => <ImageTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/location" 
          render={
            /* acl check */
            (permissions&&permissions.location&&Array.isArray(permissions.location)
            &&(permissions.location.includes('read') || permissions.location.includes('*')))
            ? ((props) => <LocationTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/method" 
          render={
            /* acl check */
            (permissions&&permissions.method&&Array.isArray(permissions.method)
            &&(permissions.method.includes('read') || permissions.method.includes('*')))
            ? ((props) => <MethodTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/observation" 
          render={
            /* acl check */
            (permissions&&permissions.observation&&Array.isArray(permissions.observation)
            &&(permissions.observation.includes('read') || permissions.observation.includes('*')))
            ? ((props) => <ObservationTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/observationTreatment" 
          render={
            /* acl check */
            (permissions&&permissions.observationTreatment&&Array.isArray(permissions.observationTreatment)
            &&(permissions.observationTreatment.includes('read') || permissions.observationTreatment.includes('*')))
            ? ((props) => <ObservationTreatmentTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/observationUnit" 
          render={
            /* acl check */
            (permissions&&permissions.observationUnit&&Array.isArray(permissions.observationUnit)
            &&(permissions.observationUnit.includes('read') || permissions.observationUnit.includes('*')))
            ? ((props) => <ObservationUnitTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/observationUnitPosition" 
          render={
            /* acl check */
            (permissions&&permissions.observationUnitPosition&&Array.isArray(permissions.observationUnitPosition)
            &&(permissions.observationUnitPosition.includes('read') || permissions.observationUnitPosition.includes('*')))
            ? ((props) => <ObservationUnitPositionTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/observationVariable" 
          render={
            /* acl check */
            (permissions&&permissions.observationVariable&&Array.isArray(permissions.observationVariable)
            &&(permissions.observationVariable.includes('read') || permissions.observationVariable.includes('*')))
            ? ((props) => <ObservationVariableTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/ontologyReference" 
          render={
            /* acl check */
            (permissions&&permissions.ontologyReference&&Array.isArray(permissions.ontologyReference)
            &&(permissions.ontologyReference.includes('read') || permissions.ontologyReference.includes('*')))
            ? ((props) => <OntologyReferenceTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/program" 
          render={
            /* acl check */
            (permissions&&permissions.program&&Array.isArray(permissions.program)
            &&(permissions.program.includes('read') || permissions.program.includes('*')))
            ? ((props) => <ProgramTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/scale" 
          render={
            /* acl check */
            (permissions&&permissions.scale&&Array.isArray(permissions.scale)
            &&(permissions.scale.includes('read') || permissions.scale.includes('*')))
            ? ((props) => <ScaleTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/season" 
          render={
            /* acl check */
            (permissions&&permissions.season&&Array.isArray(permissions.season)
            &&(permissions.season.includes('read') || permissions.season.includes('*')))
            ? ((props) => <SeasonTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/study" 
          render={
            /* acl check */
            (permissions&&permissions.study&&Array.isArray(permissions.study)
            &&(permissions.study.includes('read') || permissions.study.includes('*')))
            ? ((props) => <StudyTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/trait" 
          render={
            /* acl check */
            (permissions&&permissions.trait&&Array.isArray(permissions.trait)
            &&(permissions.trait.includes('read') || permissions.trait.includes('*')))
            ? ((props) => <TraitTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/trial" 
          render={
            /* acl check */
            (permissions&&permissions.trial&&Array.isArray(permissions.trial)
            &&(permissions.trial.includes('read') || permissions.trial.includes('*')))
            ? ((props) => <TrialTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
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

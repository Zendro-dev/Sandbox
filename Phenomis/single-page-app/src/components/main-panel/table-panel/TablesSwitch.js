import React from 'react';
import { 
  Switch,
  Route
} from 'react-router-dom'
import PropTypes from 'prop-types';

import BreedingMethodTable from './models-tables/breedingMethod-table/BreedingMethodEnhancedTable'
import ContactTable from './models-tables/contact-table/ContactEnhancedTable'
import EnvironmentParameterTable from './models-tables/environmentParameter-table/EnvironmentParameterEnhancedTable'
import EventTable from './models-tables/event-table/EventEnhancedTable'
import EventParameterTable from './models-tables/eventParameter-table/EventParameterEnhancedTable'
import GermplasmTable from './models-tables/germplasm-table/GermplasmEnhancedTable'
import ImageTable from './models-tables/image-table/ImageEnhancedTable'
import LocationTable from './models-tables/location-table/LocationEnhancedTable'
import MethodTable from './models-tables/method-table/MethodEnhancedTable'
import ObservationTable from './models-tables/observation-table/ObservationEnhancedTable'
import ObservationTreatmentTable from './models-tables/observationTreatment-table/ObservationTreatmentEnhancedTable'
import ObservationUnitTable from './models-tables/observationUnit-table/ObservationUnitEnhancedTable'
import ObservationUnitPositionTable from './models-tables/observationUnitPosition-table/ObservationUnitPositionEnhancedTable'
import ObservationUnitToEventTable from './models-tables/observationUnit_to_event-table/ObservationUnit_to_eventEnhancedTable'
import ObservationVariableTable from './models-tables/observationVariable-table/ObservationVariableEnhancedTable'
import OntologyReferenceTable from './models-tables/ontologyReference-table/OntologyReferenceEnhancedTable'
import ProgramTable from './models-tables/program-table/ProgramEnhancedTable'
import RoleToUserTable from './models-tables/role_to_user-table/Role_to_userEnhancedTable'
import ScaleTable from './models-tables/scale-table/ScaleEnhancedTable'
import SeasonTable from './models-tables/season-table/SeasonEnhancedTable'
import StudyTable from './models-tables/study-table/StudyEnhancedTable'
import StudyToContactTable from './models-tables/study_to_contact-table/Study_to_contactEnhancedTable'
import StudyToSeasonTable from './models-tables/study_to_season-table/Study_to_seasonEnhancedTable'
import TraitTable from './models-tables/trait-table/TraitEnhancedTable'
import TrialTable from './models-tables/trial-table/TrialEnhancedTable'
import TrialToContactTable from './models-tables/trial_to_contact-table/Trial_to_contactEnhancedTable'
import RoleTable from './admin-tables/role-table/RoleEnhancedTable'
import UserTable from './admin-tables/user-table/UserEnhancedTable'
import NotFoundSection from '../pages/NotFoundSectionPage'
import NoPermissionSectionPage from '../pages/NoPermissionSectionPage'

export default function TablesSwitch(props) {
  const { permissions } = props;

  return (
    
    <Switch>

        {/* Models */}
        <Route exact path="/main/model/breedingMethod" 
          render={
            /* acl check */
            (permissions&&permissions.breedingMethod&&Array.isArray(permissions.breedingMethod)
            &&(permissions.breedingMethod.includes('read') || permissions.breedingMethod.includes('*')))
            ? ((props) => <BreedingMethodTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/contact" 
          render={
            /* acl check */
            (permissions&&permissions.contact&&Array.isArray(permissions.contact)
            &&(permissions.contact.includes('read') || permissions.contact.includes('*')))
            ? ((props) => <ContactTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/environmentParameter" 
          render={
            /* acl check */
            (permissions&&permissions.environmentParameter&&Array.isArray(permissions.environmentParameter)
            &&(permissions.environmentParameter.includes('read') || permissions.environmentParameter.includes('*')))
            ? ((props) => <EnvironmentParameterTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/event" 
          render={
            /* acl check */
            (permissions&&permissions.event&&Array.isArray(permissions.event)
            &&(permissions.event.includes('read') || permissions.event.includes('*')))
            ? ((props) => <EventTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/eventParameter" 
          render={
            /* acl check */
            (permissions&&permissions.eventParameter&&Array.isArray(permissions.eventParameter)
            &&(permissions.eventParameter.includes('read') || permissions.eventParameter.includes('*')))
            ? ((props) => <EventParameterTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/germplasm" 
          render={
            /* acl check */
            (permissions&&permissions.germplasm&&Array.isArray(permissions.germplasm)
            &&(permissions.germplasm.includes('read') || permissions.germplasm.includes('*')))
            ? ((props) => <GermplasmTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/image" 
          render={
            /* acl check */
            (permissions&&permissions.image&&Array.isArray(permissions.image)
            &&(permissions.image.includes('read') || permissions.image.includes('*')))
            ? ((props) => <ImageTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/location" 
          render={
            /* acl check */
            (permissions&&permissions.location&&Array.isArray(permissions.location)
            &&(permissions.location.includes('read') || permissions.location.includes('*')))
            ? ((props) => <LocationTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/method" 
          render={
            /* acl check */
            (permissions&&permissions.method&&Array.isArray(permissions.method)
            &&(permissions.method.includes('read') || permissions.method.includes('*')))
            ? ((props) => <MethodTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/observation" 
          render={
            /* acl check */
            (permissions&&permissions.observation&&Array.isArray(permissions.observation)
            &&(permissions.observation.includes('read') || permissions.observation.includes('*')))
            ? ((props) => <ObservationTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/observationTreatment" 
          render={
            /* acl check */
            (permissions&&permissions.observationTreatment&&Array.isArray(permissions.observationTreatment)
            &&(permissions.observationTreatment.includes('read') || permissions.observationTreatment.includes('*')))
            ? ((props) => <ObservationTreatmentTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/observationUnit" 
          render={
            /* acl check */
            (permissions&&permissions.observationUnit&&Array.isArray(permissions.observationUnit)
            &&(permissions.observationUnit.includes('read') || permissions.observationUnit.includes('*')))
            ? ((props) => <ObservationUnitTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/observationUnitPosition" 
          render={
            /* acl check */
            (permissions&&permissions.observationUnitPosition&&Array.isArray(permissions.observationUnitPosition)
            &&(permissions.observationUnitPosition.includes('read') || permissions.observationUnitPosition.includes('*')))
            ? ((props) => <ObservationUnitPositionTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/observationUnit_to_event" 
          render={
            /* acl check */
            (permissions&&permissions.observationUnit_to_event&&Array.isArray(permissions.observationUnit_to_event)
            &&(permissions.observationUnit_to_event.includes('read') || permissions.observationUnit_to_event.includes('*')))
            ? ((props) => <ObservationUnitToEventTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/observationVariable" 
          render={
            /* acl check */
            (permissions&&permissions.observationVariable&&Array.isArray(permissions.observationVariable)
            &&(permissions.observationVariable.includes('read') || permissions.observationVariable.includes('*')))
            ? ((props) => <ObservationVariableTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/ontologyReference" 
          render={
            /* acl check */
            (permissions&&permissions.ontologyReference&&Array.isArray(permissions.ontologyReference)
            &&(permissions.ontologyReference.includes('read') || permissions.ontologyReference.includes('*')))
            ? ((props) => <OntologyReferenceTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/program" 
          render={
            /* acl check */
            (permissions&&permissions.program&&Array.isArray(permissions.program)
            &&(permissions.program.includes('read') || permissions.program.includes('*')))
            ? ((props) => <ProgramTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/role_to_user" 
          render={
            /* acl check */
            (permissions&&permissions.role_to_user&&Array.isArray(permissions.role_to_user)
            &&(permissions.role_to_user.includes('read') || permissions.role_to_user.includes('*')))
            ? ((props) => <RoleToUserTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/scale" 
          render={
            /* acl check */
            (permissions&&permissions.scale&&Array.isArray(permissions.scale)
            &&(permissions.scale.includes('read') || permissions.scale.includes('*')))
            ? ((props) => <ScaleTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/season" 
          render={
            /* acl check */
            (permissions&&permissions.season&&Array.isArray(permissions.season)
            &&(permissions.season.includes('read') || permissions.season.includes('*')))
            ? ((props) => <SeasonTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/study" 
          render={
            /* acl check */
            (permissions&&permissions.study&&Array.isArray(permissions.study)
            &&(permissions.study.includes('read') || permissions.study.includes('*')))
            ? ((props) => <StudyTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/study_to_contact" 
          render={
            /* acl check */
            (permissions&&permissions.study_to_contact&&Array.isArray(permissions.study_to_contact)
            &&(permissions.study_to_contact.includes('read') || permissions.study_to_contact.includes('*')))
            ? ((props) => <StudyToContactTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/study_to_season" 
          render={
            /* acl check */
            (permissions&&permissions.study_to_season&&Array.isArray(permissions.study_to_season)
            &&(permissions.study_to_season.includes('read') || permissions.study_to_season.includes('*')))
            ? ((props) => <StudyToSeasonTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/trait" 
          render={
            /* acl check */
            (permissions&&permissions.trait&&Array.isArray(permissions.trait)
            &&(permissions.trait.includes('read') || permissions.trait.includes('*')))
            ? ((props) => <TraitTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/trial" 
          render={
            /* acl check */
            (permissions&&permissions.trial&&Array.isArray(permissions.trial)
            &&(permissions.trial.includes('read') || permissions.trial.includes('*')))
            ? ((props) => <TrialTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/model/trial_to_contact" 
          render={
            /* acl check */
            (permissions&&permissions.trial_to_contact&&Array.isArray(permissions.trial_to_contact)
            &&(permissions.trial_to_contact.includes('read') || permissions.trial_to_contact.includes('*')))
            ? ((props) => <TrialToContactTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />

        {/* Admin models */}
        <Route exact path="/main/admin/role" 
          render={
            /* acl check */
            (permissions&&permissions.role&&Array.isArray(permissions.role)
            &&(permissions.role.includes('read') || permissions.role.includes('*')))
            ? ((props) => <RoleTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />
        <Route exact path="/main/admin/user" 
          render={
            /* acl check */
            (permissions&&permissions.user&&Array.isArray(permissions.user)
            &&(permissions.user.includes('read') || permissions.user.includes('*')))
            ? ((props) => <UserTable {...props} permissions={permissions}/>) : (NoPermissionSectionPage)
        } />

        {/* Default */}
        <Route path="/main/" component={NotFoundSection} />

    </Switch>
  );
}

TablesSwitch.propTypes = {
  permissions: PropTypes.object,
};

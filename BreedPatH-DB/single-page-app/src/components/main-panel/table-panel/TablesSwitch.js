import React from 'react';
import { 
  Switch,
  Route
} from 'react-router-dom'
import PropTypes from 'prop-types';

import BreedingPoolTable from './models-tables/breeding_pool-table/Breeding_poolEnhancedTable'
import FieldPlotTable from './models-tables/field_plot-table/Field_plotEnhancedTable'
import FieldPlotTreatmentTable from './models-tables/field_plot_treatment-table/Field_plot_treatmentEnhancedTable'
import GenotypeTable from './models-tables/genotype-table/GenotypeEnhancedTable'
import IndividualTable from './models-tables/individual-table/IndividualEnhancedTable'
import MarkerDataTable from './models-tables/marker_data-table/Marker_dataEnhancedTable'
import MeasurementTable from './models-tables/measurement-table/MeasurementEnhancedTable'
import NucAcidLibraryResultTable from './models-tables/nuc_acid_library_result-table/Nuc_acid_library_resultEnhancedTable'
import SampleTable from './models-tables/sample-table/SampleEnhancedTable'
import SequencingExperimentTable from './models-tables/sequencing_experiment-table/Sequencing_experimentEnhancedTable'
import TranscriptCountTable from './models-tables/transcript_count-table/Transcript_countEnhancedTable'
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
        <Route exact path="/main/model/breeding_pool" 
          render={
            /* acl check */
            (permissions&&permissions.breeding_pool&&Array.isArray(permissions.breeding_pool)
            &&(permissions.breeding_pool.includes('read') || permissions.breeding_pool.includes('*')))
            ? ((props) => <BreedingPoolTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/field_plot" 
          render={
            /* acl check */
            (permissions&&permissions.field_plot&&Array.isArray(permissions.field_plot)
            &&(permissions.field_plot.includes('read') || permissions.field_plot.includes('*')))
            ? ((props) => <FieldPlotTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/field_plot_treatment" 
          render={
            /* acl check */
            (permissions&&permissions.field_plot_treatment&&Array.isArray(permissions.field_plot_treatment)
            &&(permissions.field_plot_treatment.includes('read') || permissions.field_plot_treatment.includes('*')))
            ? ((props) => <FieldPlotTreatmentTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/genotype" 
          render={
            /* acl check */
            (permissions&&permissions.genotype&&Array.isArray(permissions.genotype)
            &&(permissions.genotype.includes('read') || permissions.genotype.includes('*')))
            ? ((props) => <GenotypeTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/individual" 
          render={
            /* acl check */
            (permissions&&permissions.individual&&Array.isArray(permissions.individual)
            &&(permissions.individual.includes('read') || permissions.individual.includes('*')))
            ? ((props) => <IndividualTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/marker_data" 
          render={
            /* acl check */
            (permissions&&permissions.marker_data&&Array.isArray(permissions.marker_data)
            &&(permissions.marker_data.includes('read') || permissions.marker_data.includes('*')))
            ? ((props) => <MarkerDataTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/measurement" 
          render={
            /* acl check */
            (permissions&&permissions.measurement&&Array.isArray(permissions.measurement)
            &&(permissions.measurement.includes('read') || permissions.measurement.includes('*')))
            ? ((props) => <MeasurementTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/nuc_acid_library_result" 
          render={
            /* acl check */
            (permissions&&permissions.nuc_acid_library_result&&Array.isArray(permissions.nuc_acid_library_result)
            &&(permissions.nuc_acid_library_result.includes('read') || permissions.nuc_acid_library_result.includes('*')))
            ? ((props) => <NucAcidLibraryResultTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/sample" 
          render={
            /* acl check */
            (permissions&&permissions.sample&&Array.isArray(permissions.sample)
            &&(permissions.sample.includes('read') || permissions.sample.includes('*')))
            ? ((props) => <SampleTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/sequencing_experiment" 
          render={
            /* acl check */
            (permissions&&permissions.sequencing_experiment&&Array.isArray(permissions.sequencing_experiment)
            &&(permissions.sequencing_experiment.includes('read') || permissions.sequencing_experiment.includes('*')))
            ? ((props) => <SequencingExperimentTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/model/transcript_count" 
          render={
            /* acl check */
            (permissions&&permissions.transcript_count&&Array.isArray(permissions.transcript_count)
            &&(permissions.transcript_count.includes('read') || permissions.transcript_count.includes('*')))
            ? ((props) => <TranscriptCountTable {...props} permissions={permissions}/>) : ((props) => <NoPermissionSectionPage {...props}/>)
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

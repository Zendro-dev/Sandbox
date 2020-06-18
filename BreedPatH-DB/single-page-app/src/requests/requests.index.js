import breeding_poolQueries from './breeding_pool'
import field_plotQueries from './field_plot'
import field_plot_treatmentQueries from './field_plot_treatment'
import genotypeQueries from './genotype'
import individualQueries from './individual'
import marker_dataQueries from './marker_data'
import measurementQueries from './measurement'
import nuc_acid_library_resultQueries from './nuc_acid_library_result'
import sampleQueries from './sample'
import sequencing_experimentQueries from './sequencing_experiment'
import transcript_countQueries from './transcript_count'
import roleQueries from './role'
import role_to_userQueries from './role_to_user'
import userQueries from './user'

export default {
  breeding_pool: breeding_poolQueries,
  field_plot: field_plotQueries,
  field_plot_treatment: field_plot_treatmentQueries,
  genotype: genotypeQueries,
  individual: individualQueries,
  marker_data: marker_dataQueries,
  measurement: measurementQueries,
  nuc_acid_library_result: nuc_acid_library_resultQueries,
  sample: sampleQueries,
  sequencing_experiment: sequencing_experimentQueries,
  transcript_count: transcript_countQueries,
  role: roleQueries,
  role_to_user: role_to_userQueries,
  user: userQueries,
}

export default function getAttributes(filterName) {
  switch(filterName) {
    case 'breeding_pool':
      return {
        "id": "Int",
        "name": "String",
        "description": "String",
      };
    case 'field_plot':
      return {
        "id": "Int",
        "field_name": "String",
        "coordinates_or_name": "String",
        "year": "String",
        "area_sqm": "Float",
        "type": "String",
        "genotype_id": "Int",
        "field_plot_treatment_id": "Int",
      };
    case 'field_plot_treatment':
      return {
        "id": "Int",
        "start_date": "String",
        "end_date": "String",
        "name": "String",
        "description": "String",
        "chemical": "String",
        "pesticide_type": "String",
        "field_plot_id": "Int",
      };
    case 'genotype':
      return {
        "id": "Int",
        "name": "String",
        "description": "String",
        "pedigree_type": "String",
        "mother_id": "Int",
        "father_id": "Int",
        "breeding_pool_id": "Int",
      };
    case 'individual':
      return {
        "id": "Int",
        "name": "String",
        "description": "String",
        "genotype_id": "Int",
        "individual_id": "Int",
      };
    case 'marker_data':
      return {
        "id": "Int",
        "marker_name": "String",
        "nucleotide": "String",
        "individual_id": "Int",
      };
    case 'measurement':
      return {
        "id": "Int",
        "method": "String",
        "reference": "String",
        "float_value": "Float",
        "int_value": "Int",
        "text_value": "String",
        "unit": "String",
        "field_plot_id": "Int",
      };
    case 'nuc_acid_library_result':
      return {
        "id": "Int",
        "lab_code": "String",
        "file_name": "String",
        "file_uri": "String",
        "type": "String",
        "insert_size": "Float",
        "technical_replicate": "Int",
        "trimmed": "Boolean",
        "sample_id": "Int",
        "sequencing_experiment_id": "Int",
      };
    case 'sample':
      return {
        "id": "Int",
        "name": "String",
        "sampling_date": "String",
        "type": "String",
        "biological_replicate_no": "Int",
        "lab_code": "String",
        "treatment": "String",
        "tissue": "String",
        "individual_id": "Int",
        "sequencing_experiment_id": "Int",
      };
    case 'sequencing_experiment':
      return {
        "id": "Int",
        "name": "String",
        "description": "String",
        "start_date": "String",
        "end_date": "String",
        "protocol": "String",
        "platform": "String",
        "data_type": "String",
        "library_type": "String",
        "library_preparation": "String",
        "aimed_coverage": "Float",
        "resulting_coverage": "Float",
        "insert_size": "Float",
        "aimed_read_length": "String",
        "genome_complexity_reduction": "String",
        "contamination": "String",
      };
    case 'transcript_count':
      return {
        "id": "Int",
        "gene": "String",
        "value": "Float",
        "method": "String",
        "reference_genome": "String",
        "sample_id": "Int",
      };
    case 'role':
      return {
        "id": "Int",
        "name": "String",
        "description": "String",
    };
    case 'role_to_user':
      return {
        "id": "Int",
        "userId": "Int",
        "roleId": "Int",
    };
    case 'user':
      return {
        "id": "Int",
        "email": "String",
        "password": "String",
    };

    default:
      return {};
  }
}
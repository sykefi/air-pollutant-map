DROP TABLE IF EXISTS grid_data_gnfr_dev;

CREATE TABLE grid_data_gnfr_dev AS (
    SELECT vuosi, grid_id, gnfr, s16,s15,s22,s13,s28,s29,s27,s43,s5,s18,s3,s12,s1,s7,s8,s14,s37,s25,s19,s17,s38,s40 FROM grid_data_import_temp
);

CREATE INDEX gnfr_dev_year_gnfr_idx ON grid_data_gnfr_dev (vuosi, gnfr);
GRANT SELECT ON grid_data_gnfr_dev TO paastotkartalla;

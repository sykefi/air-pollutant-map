
DROP TABLE IF EXISTS muni_data_totals;
SELECT * INTO muni_data_totals FROM muni_data_totals_backup;
GRANT SELECT ON muni_data_totals TO paastotkartalla;

DROP TABLE IF EXISTS muni_data_gnfr_dev;
SELECT * INTO muni_data_gnfr_dev FROM muni_data_gnfr_dev_backup;
GRANT SELECT ON muni_data_gnfr_dev TO paastotkartalla;

DROP TABLE IF EXISTS muni_data_gnfr_prod;
SELECT * INTO muni_data_gnfr_prod FROM muni_data_gnfr_prod_backup;
GRANT SELECT ON muni_data_gnfr_prod TO paastotkartalla;

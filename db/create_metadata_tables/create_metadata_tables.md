### Create metadata tables

1. Run the SQL script: [create_gnfr_meta_table.sql](./create_gnfr_meta_table.sql) (gnfr names and descriptions).
2. Run the SQL script: [create_pollutant_meta_table.sql](./create_pollutant_meta_table.sql) (pollutant names and descriptions).
3. Run the SQL script: [create_gnfr_pollutant_meta_table.sql](./create_gnfr_pollutant_meta_table.sql) (shares of reported and modeled emissions at by gnfr-pollutant combinations ).

To insert data to gnfr_pollutant_meta_table, run:

```
C:\"Program Files\pgAdmin 4\v4\runtime\psql.exe" -h kkxpgdbt1 -d PaastotKartalla -U paastotkartalla -c "\copy public.gnfr_pollutant_meta (year, gnfr, pollutant, rep_share, calc_share) FROM 'CalcShare.csv' with (format csv, header true, delimiter ';', encoding 'utf-8');"
```

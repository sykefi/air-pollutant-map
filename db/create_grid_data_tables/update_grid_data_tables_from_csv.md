### 1. Import (raw) grid data to table: grid_data (replace with new data from CSV)

1. Run the SQL script: [create_grid_data_master_table.sql](./create_grid_data_master_table.sql) to drop the old table and create a new one (public.grid_data_master).
2. Ensure that the column order, delimiter (`;`) and encoding (`utf-8`) in the CSV file match the ones in the copy clause (below). Column names don't need to match.
3. Run the psql command below (update the location of psql.exe to the command):

```
C:\"Program Files\pgAdmin 4\v4\runtime\psql.exe" -h kkxpgdbt1 -d PaastotKartalla -U paastotkartalla -c "\copy public.grid_data_master (vuosi,rivi,long,lat,gnfr,s16,s15,s22,s13,s28,s29,s27,s43,s5,s18,s3,s12,s1,s7,s8,s14,s37,s25,s19,s17,s38,s40) FROM 'griddata3.csv' with (format csv, header true, delimiter ';', encoding 'utf-8');"
```

### 2. Update imported grid data to tables: grid_data_gnfr_dev & grid_data_totals

1. Run the SQL script: [create_grid_data_gnfr_dev_table.sql](./create_grid_data_gnfr_dev_table.sql) (drops & creates the table with geometry column and index).
2. Run the SQL script: [create_grid_data_totals_table.sql](./create_grid_data_totals_table.sql) (drops & creates the table with geometry column).

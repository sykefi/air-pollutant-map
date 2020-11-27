### Update municipality geometries

See external documentation.

### Update municipality data

1. Run the SQL script: [create_muni_data_master_table.sql](./create_muni_data_master_table.sql) to drop the old table and create a new one.
2. Ensure that the column order, delimiter (`;`) and encoding (`utf-8`) in the CSV file match the ones in the copy clause (below). Column names don't need to match.
3. Run the psql command below (update the location of psql.exe to the command):

```
C:\"Program Files\pgAdmin 4\v4\runtime\psql.exe" -h hostname -d databasename -U databaseuser -c "\copy public.muni_data_master (vuosi,kuntanro,nimi,gnfr,s16,s15,s22,s13,s28,s29,s27,s43,s5,s18,s3,s12,s1,s7,s8,s14,s37,s25,s19,s17,s38,s40) FROM 'kuntadata5.csv' with (format csv, header true, delimiter ';', encoding 'utf-8');"
```

4. Run the SQL script: [create_muni_data_gnfr_dev_table.sql](./create_muni_data_gnfr_dev_table.sql)
5. Run the SQL script: [create_muni_data_gnfr_prod_table.sql](./create_muni_data_gnfr_prod_table.sql)
6. Finally, to update muni_data_totals table, run the script [create_muni_data_totals_table.sql](./create_muni_data_totals_table.sql)

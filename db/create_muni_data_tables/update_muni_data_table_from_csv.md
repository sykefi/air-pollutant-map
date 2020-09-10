### Update municipality data

1. Run the SQL script: [create_muni_data_table.sql](./create_muni_data_table.sql) to drop the old table and create a new one.
2. Ensure that the column order, delimiter (`;`) and encoding (`utf-8`) in the CSV file match the ones in the copy clause (below). Column names don't need to match.
3. Run the psql command below (update the location of psql.exe to the command):

```
C:\"Program Files\pgAdmin 4\v4\runtime\psql.exe" -h kkxpgdbt1 -d PaastotKartalla -U paastotkartalla -c "\copy public.muni_data (vuosi,kuntanro,nimi,gnfr,s16,s15,s22,s13,s28,s29,s27,s43,s5,s18,s3,s12,s1,s7,s8,s14,s37,s25,s19,s17,s38,s40) FROM 'kuntadata5.csv' with (format csv, header true, delimiter ';', encoding 'utf-8');"
```

4. Run the SQL script: [join_muni_data_geom.sql](./join_muni_data_geom.sql) to add geometry column (with geometries) to the newly created table.

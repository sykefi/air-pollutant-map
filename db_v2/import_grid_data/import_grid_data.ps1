
# adjust psql path if needed
$psql = "C:\'Program Files\pgAdmin 4\v4\runtime\psql.exe'"

# these need to be set
$dbHost = ''
$dbName = ''
$dbUser = ''

# $csvFile = 'csv_data/griddata3.csv'
$csvFile = 'csv_data/PaastotRuuduittain1990-2019.csv'

Read-Host -Prompt "`nConnecting to db $dbName at $dbHost as $dbUser. Updating grid data from $csvFile. Press any key to continue"

Write-Output "`n1/6 Backups all grid data tables used by APIs"
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/backup_grid_data_tables.sql"

Write-Output "`n2/6 Creates an empty table grid_data_import_temp"
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/create_table_grid_data_import.sql"

Write-Output "`n3/6 Imports new grid data to grid_data_import_temp from csv."
$copyCsvSql = @'
"\copy public.grid_data_import_temp (vuosi,grid_id,long,lat,gnfr,s16,s15,s22,s13,s28,s29,s27,s43,s5,s18,s3,s12,s1,s7,s8,s14,s37,s25,s19,s17,s38,s40) FROM '$csvFile' with (format csv, header true, delimiter ';', encoding 'utf-8');"
'@
iex "& $psql -h $dbHost -d $dbName -U $dbUser -c $copyCsvSql"
Read-Host -Prompt "`nPress CTRL+C if the import was not successful or any key to continue"

Write-Output "`n4/6 Updates new grid data to table grid_data_gnfr_dev (from grid_data_import_temp)."
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/create_table_grid_data_gnfr_dev.sql"

Write-Output "`n5/6 Updates new grid data to table grid_data_gnfr_prod (from grid_data_import_temp)."
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/create_table_grid_data_gnfr_prod.sql"

Write-Output "`n6/6 Updates new grid data to table grid_data_totals (from grid_data_import_temp)."
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/create_table_grid_data_totals.sql"

Write-Output "`nAll grid data tables updated."


# Option to revert the import by restoring grid data from backup tables
Read-Host -Prompt "`nExit here (CTRL+C) if you do not want to restore grid data from backup tables (or press any key)"
Read-Host -Prompt "`nIf you proceed, grid data will be restored from backup tables. Exit with CTRL+C or press any key to contnue"
Write-Output "`nRestoring grid data from backup tables..."
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/restore_grid_data_tables.sql"


Write-Output "`nAll done."

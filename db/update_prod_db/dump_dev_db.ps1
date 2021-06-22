$pg_dump = "C:\'Program Files\pgAdmin 4\v4\runtime\pg_dump.exe'"

$dump_file = "'dev_dumps\dev.dump'"

$dbHost = ''
$dbName = ''
$dbUser = ''

# dump the whole db
iex "& $pg_dump --file $dump_file -h $dbHost -U $dbUser --no-owner --format=c --encoding 'UTF8' $dbName"

# dump only one table (optional)
# $table_name = "hall100kunta2020"
# iex "& $pg_dump --file $dump_file -h $dbHost -U $dbUser --no-owner --table=$table_name --format=c --encoding 'UTF8' $dbName"

# these need to be set
$pg_dump = "C:\'Program Files\pgAdmin 4\v4\runtime\pg_dump.exe'"

$dump_file = "''"
# $table_name = "hall100kunta2020"

$dbHost = ''
$dbName = ''
$dbUser = ''


# iex "& $pg_dump --file $dump_file -h $dbHost -U $dbUser --no-owner --table=$table_name --format=c --encoding 'UTF8' $dbName"

iex "& $pg_dump --file $dump_file -h $dbHost -U $dbUser --no-owner --format=c --encoding 'UTF8' $dbName"

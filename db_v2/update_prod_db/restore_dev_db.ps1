
# these need to be set
$pg_restore = "C:\'Program Files\pgAdmin 4\v4\runtime\pg_restore.exe'"

$dump_file = "''"
$table_name = "hall100kunta2021"

$dbHost = ''
$dbName = ''
$dbUser = ''


iex "& $pg_restore -h $dbHost -d $dbName -U $dbUser --no-owner --role=$dbUser --table=$table_name --clean --single-transaction --format=c $dump_file"
# --clean for drop & restore

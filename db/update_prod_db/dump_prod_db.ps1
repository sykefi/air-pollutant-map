$pg_dump = "C:\'Program Files\pgAdmin 4\v5\runtime\pg_dump.exe'"

$dump_file = "'prod_dumps\dump_name.dump'"

$dbHost = ''
$dbName = ''
$dbUser = ''

# backup the entire db
iex "& $pg_dump --file $dump_file -h $dbHost -U $dbUser --no-owner --format=c --encoding 'UTF8' $dbName"

# backup just one table (optional)
# iex "& $pg_dump --file $dump_file -h $dbHost -U $dbUser --no-owner --table=$table_name --format=c --encoding 'UTF8' $dbName"

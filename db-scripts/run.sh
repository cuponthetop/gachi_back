#/bin/bash

USERNAME="gachi"
PASS=""
DATABASE="gachi"


(mysql -p "$PASS" -u "$USERNAME" "$DATABASE" < reset-tables.sql)

(mysql -p "$PASS" -u "$USERNAME" "$DATABASE" < generate-tables.sql)

(mysql -p "$PASS" -u "$USERNAME" "$DATABASE" < populate-tables.sql)

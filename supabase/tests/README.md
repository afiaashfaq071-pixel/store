# Database tests (optional, for developers)

`20_database_tests.sql` checks the rules in `../schema.sql` (customers cannot change prices or stock,
orders are re-priced on the server, stock is reduced and restored once, status moves are validated,
only the owner can manage data). It runs against a throw-away **local PostgreSQL** (not Supabase itself):

```bash
createdb ahs_test
psql -d ahs_test -f 00_supabase_stubs.sql                        # fake Supabase roles + auth.jwt()
sed "s/CHANGE-ME@example.com/owner@shop.test/" ../schema.sql | psql -d ahs_test -v ON_ERROR_STOP=1
psql -d ahs_test -v ON_ERROR_STOP=1 -f 20_database_tests.sql      # prints PASS lines, then ALL DATABASE TESTS PASSED
```

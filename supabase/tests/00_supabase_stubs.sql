-- Minimal stand-ins for what Supabase provides (roles, auth.jwt(), default grants).
do $$ begin if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if; if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if; end $$;
create schema auth;
create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
grant usage on schema public, auth to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;
alter default privileges in schema public grant all on functions to anon, authenticated;
create schema test; grant usage on schema test to anon, authenticated;
create function test.fails(q text) returns boolean language plpgsql as $$ begin execute q; return false; exception when others then return true; end $$;
create function test.ok(cond boolean, name text) returns void language plpgsql as $$ begin
  if cond is true then raise notice 'PASS  %', name; else raise exception 'FAIL  %', name; end if; end $$;
grant execute on all functions in schema test to anon, authenticated;

-- ============================================================
-- Fix Supabase Auth createUser identity creation search_path
-- ============================================================
-- Context:
-- Auth Admin createUser runs as supabase_auth_admin and inserts into
-- unqualified auth tables such as "users" and "identities" while relying on
-- search_path=auth. Our auth.users/profile trigger functions had
-- search_path='' configured. Production Auth/Postgres logs showed createUser
-- successfully inserting auth.users and running public.handle_new_user(), then
-- failing on INSERT INTO "identities" with SQLSTATE 42P01 because the relation
-- was no longer resolvable by the unqualified name.
--
-- Keep the functions SECURITY DEFINER and schema-qualified internally, but set
-- their runtime search_path to auth so GoTrue's surrounding transaction can
-- continue resolving unqualified Auth-managed tables correctly.

ALTER FUNCTION public.handle_new_user()
  SET search_path TO auth;

ALTER FUNCTION public.sync_display_name_from_auth()
  SET search_path TO auth;

ALTER FUNCTION public.claim_orphan_hutko_subscriptions_for_profile()
  SET search_path TO auth;

ALTER FUNCTION public.audit_profile_changes()
  SET search_path TO auth;

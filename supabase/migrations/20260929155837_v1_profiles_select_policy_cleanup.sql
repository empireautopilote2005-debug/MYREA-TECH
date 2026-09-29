-- MYRÉA TECH V1: separate profile write policies from community-member SELECT policy.
drop policy if exists profiles_write_self on public.profiles;
create policy profiles_insert_self on public.profiles for insert to authenticated
with check ((select auth.uid())=id);
create policy profiles_update_self on public.profiles for update to authenticated
using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy profiles_delete_self on public.profiles for delete to authenticated
using ((select auth.uid())=id);
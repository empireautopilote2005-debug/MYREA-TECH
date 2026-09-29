-- MYRÉA TECH V1: keep profile write access private while allowing community member lookup.
drop policy if exists profiles_self on public.profiles;
create policy profiles_write_self on public.profiles
for all to authenticated
using ((select auth.uid())=id)
with check ((select auth.uid())=id);
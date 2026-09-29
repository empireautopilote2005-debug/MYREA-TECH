-- MYRÉA TECH V1: community member visibility for collaborative project assignment.
drop policy if exists members_select on public.community_members;
create policy members_select on public.community_members for select to authenticated
using (private.is_member(community_id,(select auth.uid())));

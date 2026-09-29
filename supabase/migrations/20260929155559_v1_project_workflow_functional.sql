-- MYRÉA TECH V1: project workflow and automatic progress.
drop policy if exists members_insert on public.community_members;
create policy members_insert on public.community_members for insert to authenticated
with check (private.is_admin(community_id, (select auth.uid())));

drop policy if exists profiles_community_select on public.profiles;
create policy profiles_community_select on public.profiles for select to authenticated
using (exists (
  select 1 from public.community_members me
  join public.community_members cm on cm.community_id=me.community_id
  where me.user_id=(select auth.uid()) and cm.user_id=profiles.id
));

drop policy if exists project_members_insert on public.project_members;
create policy project_members_insert on public.project_members for insert to authenticated
with check (exists (
  select 1 from public.projects p
  where p.id=project_members.project_id
    and (p.owner_id=(select auth.uid()) or private.is_admin(p.community_id,(select auth.uid())))
    and exists (select 1 from public.community_members cm where cm.community_id=p.community_id and cm.user_id=project_members.user_id)
));

drop policy if exists tasks_all on public.tasks;
create policy tasks_all on public.tasks for all to authenticated
using (exists (select 1 from public.projects p where p.id=tasks.project_id and private.is_member(p.community_id,(select auth.uid()))))
with check (
  exists (select 1 from public.projects p where p.id=tasks.project_id and private.is_member(p.community_id,(select auth.uid())))
  and (assignee_id is null or exists (select 1 from public.project_members pm where pm.project_id=tasks.project_id and pm.user_id=tasks.assignee_id))
);

create or replace function public.add_project_owner_member()
returns trigger language plpgsql security definer set search_path=public,private as $$
begin
  insert into public.project_members(project_id,user_id,role) values(new.id,new.owner_id,'owner')
  on conflict(project_id,user_id) do update set role='owner';
  return new;
end; $$;
drop trigger if exists on_project_created_add_owner on public.projects;
create trigger on_project_created_add_owner after insert on public.projects for each row execute function public.add_project_owner_member();

create or replace function public.refresh_project_progress()
returns trigger language plpgsql security definer set search_path=public,private as $$
declare pid uuid; total_count integer; done_count integer; new_progress integer;
begin
  pid:=coalesce(new.project_id,old.project_id);
  select count(*)::integer,count(*) filter(where status in('done','validated'))::integer
  into total_count,done_count from public.tasks where project_id=pid;
  if total_count=0 then new_progress:=0;
  else new_progress:=round((done_count::numeric/total_count::numeric)*100)::integer;
  end if;
  update public.projects set progress=new_progress,status=case when new_progress=100 then 'completed' else 'active' end,updated_at=now() where id=pid;
  return coalesce(new,old);
end; $$;
drop trigger if exists on_task_progress_refresh on public.tasks;
create trigger on_task_progress_refresh after insert or update of status or delete on public.tasks for each row execute function public.refresh_project_progress();

revoke execute on function public.add_project_owner_member() from public,anon,authenticated;
revoke execute on function public.refresh_project_progress() from public,anon,authenticated;

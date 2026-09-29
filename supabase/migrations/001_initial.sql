create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.profiles(id uuid primary key references auth.users(id) on delete cascade,display_name text,skills text,availability text,created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists public.communities(id uuid primary key default gen_random_uuid(),name text not null,description text,owner_id uuid not null references auth.users(id),created_at timestamptz default now());
create table if not exists public.community_members(id uuid primary key default gen_random_uuid(),community_id uuid not null references public.communities(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,role text not null check(role in('owner','admin','member')),joined_at timestamptz default now(),unique(community_id,user_id));
create table if not exists public.community_invites(id uuid primary key default gen_random_uuid(),community_id uuid not null references public.communities(id) on delete cascade,code text not null unique,created_by uuid not null references auth.users(id),expires_at timestamptz,used_at timestamptz,used_by uuid references auth.users(id),created_at timestamptz default now());
create table if not exists public.ideas(id uuid primary key default gen_random_uuid(),community_id uuid not null references public.communities(id) on delete cascade,title text not null,description text,category text,problem text,solution text,status text not null default 'a_etudier',author_id uuid not null references auth.users(id),created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists public.projects(id uuid primary key default gen_random_uuid(),community_id uuid not null references public.communities(id) on delete cascade,name text not null,description text,objective text,status text default 'active',progress integer default 0 check(progress between 0 and 100),owner_id uuid not null references auth.users(id),created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists public.project_stages(id uuid primary key default gen_random_uuid(),project_id uuid not null references public.projects(id) on delete cascade,name text not null,position integer not null,goal text,completed boolean default false);
create table if not exists public.tasks(id uuid primary key default gen_random_uuid(),project_id uuid not null references public.projects(id) on delete cascade,title text not null,description text,assignee_id uuid references auth.users(id),created_by uuid not null references auth.users(id),status text not null default 'todo' check(status in('todo','doing','verify','done','validated')),priority text not null default 'medium' check(priority in('low','medium','high','urgent')),due_at timestamptz,created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists public.task_participants(task_id uuid not null references public.tasks(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,primary key(task_id,user_id));
create table if not exists public.contributions(id uuid primary key default gen_random_uuid(),community_id uuid not null references public.communities(id) on delete cascade,user_id uuid not null references auth.users(id),title text not null,description text,status text default 'proposed' check(status in('proposed','completed','validated','rejected')),points_proposed integer default 0,points_validated integer default 0,created_at timestamptz default now(),validated_at timestamptz,validated_by uuid references auth.users(id));
create table if not exists public.assets(id uuid primary key default gen_random_uuid(),community_id uuid not null references public.communities(id) on delete cascade,name text not null,description text,business_model text,status text default 'active',owner_id uuid not null references auth.users(id),revenue numeric(14,2) default 0,expenses numeric(14,2) default 0,created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists public.asset_revenues(id uuid primary key default gen_random_uuid(),asset_id uuid not null references public.assets(id) on delete cascade,amount numeric(14,2) not null,source text,received_at timestamptz default now(),created_by uuid not null references auth.users(id));
create table if not exists public.asset_expenses(id uuid primary key default gen_random_uuid(),asset_id uuid not null references public.assets(id) on delete cascade,amount numeric(14,2) not null,description text,spent_at timestamptz default now(),created_by uuid not null references auth.users(id));
create table if not exists public.myrea_contracts(id uuid primary key default gen_random_uuid(),community_id uuid not null references public.communities(id) on delete cascade,user_id uuid not null references auth.users(id),version text not null,acceptance_type text default 'digital',accepted_at timestamptz default now(),document_hash text);
create table if not exists public.decisions(id uuid primary key default gen_random_uuid(),community_id uuid not null references public.communities(id) on delete cascade,title text not null,description text,decision text,status text default 'open',created_by uuid not null references auth.users(id),created_at timestamptz default now());
create table if not exists public.notifications(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,title text not null,body text,read_at timestamptz,created_at timestamptz default now());
create table if not exists public.project_history(id uuid primary key default gen_random_uuid(),project_id uuid not null references public.projects(id) on delete cascade,user_id uuid not null references auth.users(id),action text not null,details jsonb,created_at timestamptz default now());

create index if not exists idx_members_user on public.community_members(user_id);
create index if not exists idx_members_community on public.community_members(community_id);
create index if not exists idx_ideas_community on public.ideas(community_id);
create index if not exists idx_projects_community on public.projects(community_id);
create index if not exists idx_tasks_project on public.tasks(project_id);
create index if not exists idx_contrib_community on public.contributions(community_id);
create index if not exists idx_assets_community on public.assets(community_id);

create or replace function private.is_member(c uuid,u uuid) returns boolean language sql security definer set search_path=public,private stable as $$select exists(select 1 from public.community_members where community_id=c and user_id=u)$$;
create or replace function private.is_admin(c uuid,u uuid) returns boolean language sql security definer set search_path=public,private stable as $$select exists(select 1 from public.community_members where community_id=c and user_id=u and role in('owner','admin'))$$;
revoke all on function private.is_member(uuid,uuid),private.is_admin(uuid,uuid) from public;
grant execute on function private.is_member(uuid,uuid),private.is_admin(uuid,uuid) to authenticated;

create or replace function private.add_owner_membership() returns trigger language plpgsql security definer set search_path=public,private as $$begin insert into public.community_members(community_id,user_id,role) values(new.id,new.owner_id,'owner') on conflict do nothing; return new; end;$$;
drop trigger if exists trg_community_owner_membership on public.communities;
create trigger trg_community_owner_membership after insert on public.communities for each row execute function private.add_owner_membership();
revoke all on function private.add_owner_membership() from public;

create or replace function public.join_with_invite(p_code text) returns uuid language plpgsql security definer set search_path=public,private as $$
declare i public.community_invites%rowtype;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 select * into i from public.community_invites where code=p_code and used_at is null and (expires_at is null or expires_at>now()) for update;
 if not found then raise exception 'INVITE_INVALID'; end if;
 insert into public.community_members(community_id,user_id,role) values(i.community_id,auth.uid(),'member') on conflict do nothing;
 update public.community_invites set used_at=now(),used_by=auth.uid() where id=i.id;
 return i.community_id;
end;$$;
revoke all on function public.join_with_invite(text) from public;
grant execute on function public.join_with_invite(text) to authenticated;

grant usage on schema public to authenticated;
grant select,insert,update,delete on all tables in schema public to authenticated;

alter table public.profiles enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.community_invites enable row level security;
alter table public.ideas enable row level security;
alter table public.projects enable row level security;
alter table public.project_stages enable row level security;
alter table public.tasks enable row level security;
alter table public.task_participants enable row level security;
alter table public.contributions enable row level security;
alter table public.assets enable row level security;
alter table public.asset_revenues enable row level security;
alter table public.asset_expenses enable row level security;
alter table public.myrea_contracts enable row level security;
alter table public.decisions enable row level security;
alter table public.notifications enable row level security;
alter table public.project_history enable row level security;

create policy profiles_self on public.profiles for all to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy communities_select on public.communities for select to authenticated using(owner_id=auth.uid() or private.is_member(id,auth.uid()));
create policy communities_insert on public.communities for insert to authenticated with check(owner_id=auth.uid());
create policy communities_update on public.communities for update to authenticated using(owner_id=auth.uid() or private.is_admin(id,auth.uid())) with check(owner_id=auth.uid() or private.is_admin(id,auth.uid()));
create policy communities_delete on public.communities for delete to authenticated using(owner_id=auth.uid());

create policy members_select on public.community_members for select to authenticated using(user_id=auth.uid() or private.is_admin(community_id,auth.uid()));
create policy members_insert on public.community_members for insert to authenticated with check(user_id=auth.uid() or private.is_admin(community_id,auth.uid()));
create policy members_update on public.community_members for update to authenticated using(private.is_admin(community_id,auth.uid())) with check(private.is_admin(community_id,auth.uid()));
create policy members_delete on public.community_members for delete to authenticated using(user_id=auth.uid() or private.is_admin(community_id,auth.uid()));

create policy ideas_all on public.ideas for all to authenticated using(private.is_member(community_id,auth.uid())) with check(private.is_member(community_id,auth.uid()));
create policy projects_all on public.projects for all to authenticated using(private.is_member(community_id,auth.uid())) with check(private.is_member(community_id,auth.uid()));
create policy stages_all on public.project_stages for all to authenticated using(exists(select 1 from public.projects p where p.id=project_id and private.is_member(p.community_id,auth.uid()))) with check(exists(select 1 from public.projects p where p.id=project_id and private.is_member(p.community_id,auth.uid())));
create policy tasks_all on public.tasks for all to authenticated using(exists(select 1 from public.projects p where p.id=project_id and private.is_member(p.community_id,auth.uid()))) with check(exists(select 1 from public.projects p where p.id=project_id and private.is_member(p.community_id,auth.uid())));
create policy task_participants_all on public.task_participants for all to authenticated using(exists(select 1 from public.tasks t join public.projects p on p.id=t.project_id where t.id=task_id and private.is_member(p.community_id,auth.uid()))) with check(exists(select 1 from public.tasks t join public.projects p on p.id=t.project_id where t.id=task_id and private.is_member(p.community_id,auth.uid())));
create policy contributions_all on public.contributions for all to authenticated using(private.is_member(community_id,auth.uid())) with check(private.is_member(community_id,auth.uid()));
create policy assets_all on public.assets for all to authenticated using(private.is_member(community_id,auth.uid())) with check(private.is_member(community_id,auth.uid()));
create policy revenues_all on public.asset_revenues for all to authenticated using(exists(select 1 from public.assets a where a.id=asset_id and private.is_member(a.community_id,auth.uid()))) with check(exists(select 1 from public.assets a where a.id=asset_id and private.is_member(a.community_id,auth.uid())));
create policy expenses_all on public.asset_expenses for all to authenticated using(exists(select 1 from public.assets a where a.id=asset_id and private.is_member(a.community_id,auth.uid()))) with check(exists(select 1 from public.assets a where a.id=asset_id and private.is_member(a.community_id,auth.uid())));
create policy contracts_select on public.myrea_contracts for select to authenticated using(user_id=auth.uid() or private.is_admin(community_id,auth.uid()));
create policy contracts_insert on public.myrea_contracts for insert to authenticated with check(user_id=auth.uid() and private.is_member(community_id,auth.uid()));
create policy decisions_all on public.decisions for all to authenticated using(private.is_member(community_id,auth.uid())) with check(private.is_member(community_id,auth.uid()));
create policy notifications_self on public.notifications for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy history_select on public.project_history for select to authenticated using(exists(select 1 from public.projects p where p.id=project_id and private.is_member(p.community_id,auth.uid())));
create policy invites_select on public.community_invites for select to authenticated using(created_by=auth.uid() or private.is_admin(community_id,auth.uid()));
create policy invites_insert on public.community_invites for insert to authenticated with check(private.is_admin(community_id,auth.uid()));

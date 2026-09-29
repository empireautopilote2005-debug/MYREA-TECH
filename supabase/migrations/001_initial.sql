create table communities(
 id uuid primary key default gen_random_uuid(),
 name text not null,
 description text,
 created_at timestamp default now()
);

create table ideas(
 id uuid primary key default gen_random_uuid(),
 title text not null,
 description text,
 status text default 'new',
 created_at timestamp default now()
);

create table projects(
 id uuid primary key default gen_random_uuid(),
 name text not null,
 status text default 'active'
);

create table assets(
 id uuid primary key default gen_random_uuid(),
 name text not null,
 revenue numeric default 0
);

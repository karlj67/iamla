create table if not exists activities (
  id bigint primary key generated always as identity,
  type text not null check (type in ('visit', 'user', 'team')),
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id bigint references users(id),
  visit_id bigint references visits(id),
  team_id bigint references teams(id)
);

create index activities_created_at_idx on activities(created_at desc);
create index activities_user_id_idx on activities(user_id); 
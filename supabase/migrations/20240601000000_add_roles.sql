alter table profiles
add column role varchar(20) not null default 'medical_visitor' check (role in ('admin', 'supervisor', 'medical_visitor')); 
-- 创建一个自增序列, 用于Department表的主键自增
drop sequence if exists dep_auto_inc cascade;
create sequence dep_auto_inc
    minvalue 1
    maxvalue 9999999999999
    start with 1
    increment by 1;

drop table if exists Department cascade;
create table Department(
    id integer primary key default nextval('dep_auto_inc'),
    name varchar(32) unique,
    establish_date date,
    phone varchar(32)
);

-- 将自增学列 dep_auto_inc 与Department关联, 实现主键自增
alter sequence dep_auto_inc owned by department.id;


drop table if exists Teacher cascade;
create table Teacher(
    id char(8) primary key,
    name varchar(32),
    gender tinyint check (gender in (0,1,2)),
    entry_date date,
    term_date date,
    phone varchar(32),
    department integer,
    password varchar(100) not null default '',
    foreign key (department) references department(id),
    position varchar(256),
    job varchar(256),
    email varchar(256)
);


-- 教育经历
drop sequence if exists edu_auto_inc cascade;
create sequence edu_auto_inc
    minvalue 1
    maxvalue 9999999999999
    start with 1
    increment by 1;
drop table if exists Education cascade;
create table Education(
    id integer primary key default nextval('edu_auto_inc'),
    teacher char(8),
    start_date date,
    end_date date,
    school varchar(256),
    Degree varchar(32) check (Degree in ('本科','硕士','博士','博士后')),
    foreign key (teacher) references Teacher(id)
);
alter sequence edu_auto_inc owned by Education.id;


-- 家庭关系
drop sequence if exists fam_auto_inc cascade;
create sequence fam_auto_inc
    minvalue 1
    maxvalue 9999999999999
    start with 1
    increment by 1;
drop table if exists Family cascade;
create table Family(
    id integer primary key default nextval('fam_auto_inc'),
    teacher char(8),
    name varchar(32),
    relation varchar(32),
    phone varchar(32),
    foreign key (teacher) references Teacher(id)
);
alter sequence fam_auto_inc owned by Family.id;


-- 奖惩记录
drop sequence if exists arc_auto_inc cascade;
create sequence arc_auto_inc
    minvalue 1
    maxvalue 9999999999999
    start with 1
    increment by 1;
drop table if exists Archive cascade;
create table Archive(
    id integer primary key default nextval('arc_auto_inc'),
    teacher char(8),
    title varchar(256),
    detail text,
    type tinyint check (type in (0,1)),
    foreign key (teacher) references Teacher(id)
);
alter sequence arc_auto_inc owned by Archive.id;




insert into teacher values('00000000','张三',1,'2000-01-30','2000-01-30','18755005131',null,'123456','副院长','玩','2645827007@qq.com');
insert into teacher values('00000001','李四',1,'2000-01-30','2000-01-30','18755005131',null,'123456','老师','教学神','2645827007@qq.com');
insert into teacher values('00000002','王五',1,'2000-01-30','2000-01-30','18755005131',null,'123456','副教授','学','2645827007@qq.com');
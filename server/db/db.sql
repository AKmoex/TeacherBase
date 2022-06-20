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
    name varchar(128) unique,
    establish_date date,
    phone varchar(32),
    t_count int default 0,
    address varchar(256)
);

-- 将自增学列 dep_auto_inc 与Department关联, 实现主键自增
alter sequence dep_auto_inc owned by department.id;






drop table if exists Teacher cascade;
create table Teacher(
    id char(8) primary key,-- 工号
    name varchar(32), -- 姓名
    gender tinyint check (gender in (1,2)), -- 1男2女
    phone varchar(32), -- 手机号码
    email varchar(256), -- 邮箱
    birthday date, -- 出生日期
    photo varchar(256), -- 照片

    entry_date date, -- 入职时间
    term_date date, -- 离职时间
    
    department_id integer, -- 所属院系
    
    job varchar(256),
    ethnicity varchar(256), -- 民族
    political varchar(256), -- 政治面貌
    address varchar(256), -- 通讯地址
    
    title varchar(256), -- 职称
    password varchar(100) not null default '', --密码
    foreign key (department_id) references department(id)
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
    teacher_id char(8),
    start_date date,
    end_date date,
    school varchar(256),
    degree varchar(32) check (degree in ('本科','硕士','博士','博士后')),
    major varchar(256),
    foreign key (teacher_id) references Teacher(id),
    -- 日期约束
    check(end_date=null or start_date<end_date)
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
    teacher_id char(8),
    name varchar(32) not null ,
    relation varchar(32)not null,
    phone varchar(32),
    foreign key (teacher_id) references Teacher(id)
);
alter sequence fam_auto_inc owned by Family.id;


-- 工作经历
drop sequence if exists work_auto_inc cascade;
create sequence work_auto_inc
    minvalue 1
    maxvalue 9999999999999
    start with 1
    increment by 1;
drop table if exists Work cascade;
create table Work(
    id integer primary key default nextval('work_auto_inc'),
    teacher_id char(8),
    start_date date,
    end_date date,
    location varchar(32),
    content varchar(32),
    foreign key (teacher_id) references Teacher(id)
);
alter sequence work_auto_inc owned by Work.id;


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
    teacher_id char(8),
    title varchar(256),
    obtain_date date,
    detail text,
    -- 奖励为0,惩罚为1
    type tinyint check (type in (0,1)) default 0,
    foreign key (teacher_id) references Teacher(id)
);
alter sequence arc_auto_inc owned by Archive.id;


-- 科研项目
drop sequence if exists res_auto_inc cascade;
create sequence res_auto_inc
    minvalue 1
    maxvalue 9999999999999
    start with 1
    increment by 1;
drop table if exists Research cascade;
create table Research(
    id integer primary key default nextval('res_auto_inc'),
    teacher_id char(8),
    title varchar(256),
    obtain_date date,
    detail text,
    foreign key (teacher_id) references Teacher(id)
);
alter sequence res_auto_inc owned by Research.id;




insert into teacher(id,name,gender,entry_date,phone,job,email,ethnicity,political,address,password)
 values('00000000','张三',1,'2000-01-30','18755005131','掌管一切','akmoex@gmail.com','汉族','中共党员','安徽省合肥市翡翠湖公寓南楼503','123456');
insert into teacher(id,name,gender,entry_date,phone,job,email,ethnicity,political,address,password)
 values('00000001','李三光',2,'2000-01-30','18755005131','教书','akmoex@outlook.com','汉族','中共党员','安徽省合肥市翡翠湖公寓南楼503','123456');
insert into teacher(id,name,gender,entry_date,phone,job,email,ethnicity,political,address,password)
 values('00000002','金毛',1,'2000-01-30','18755005131','科研','akmoex@hfut.edu.com','维吾尔族','共青团员','安徽省合肥市翡翠湖公寓南楼503','123456');

insert into teacher(id,name,gender,phone,email,birthday,photo,entry_date,term_date,department_id,job,ethnicity,political,address,title,password)
 values('66666666','王维新',1,'15155068084','istormlala@mail.hfut.edu.cn','1976-06-12','/static/t.png','1987-12-01',null,'1','学院执行院长','汉族','中共党员','安徽省蜀山区阳光花园5栋301','教授,特任研究员','123456');





insert into Department(name,establish_date,phone,t_count,address)
 values('计算机与信息学院（人工智能学院）','2000-01-30','0551-6290 1380',120,'翡翠湖校区双子楼A做1107');
insert into Department(name,establish_date,phone,t_count,address)
 values('食品与生物工程学院','2021-01-30','0551- 62901362',150,'翡翠湖校区食品与生物工程大楼二楼');
insert into Department(name,establish_date,phone,t_count,address)
 values('材料科学与工程学院','2021-11-30','0551- 62901362',300,'安徽省合肥市屯溪路193号');

 insert into Department(name,establish_date,phone,t_count,address)
 values('外国语学院','2021-11-30','0551-62901716',25,'合肥工业大学翡翠湖校区科教楼A栋第15层');


  insert into Department(name,establish_date,phone,t_count,address)
 values('机械工程学院','2021-11-30','0551-62901326',25,'安徽省合肥市屯溪路193号');
  insert into Department(name,establish_date,phone,t_count,address)
 values('电气与自动化工程学院','2021-11-30','0551-6290-1408',25,'安徽省合肥市屯溪路193号逸夫科教楼');
 

insert into Education(teacher_id,start_date,end_date,school,degree) values('66666666','2016-06-01','2019-07-01','合肥工业大学','本科');
insert into Education(teacher_id,start_date,end_date,school,degree) values('66666666','2019-09-01','2022-07-01','合肥工业大学','硕士');
insert into Education(teacher_id,start_date,end_date,school,degree) values('66666666','2022-08-01','2025-07-01','中国科学技术大学','博士');


insert into Work(teacher_id,start_date,end_date,location,content) values('66666666','2016-06-01','2019-07-01','字节跳动-后端开发部门','负责后端开发');
insert into Work(teacher_id,start_date,end_date,location,content) values('66666666','2020-12-20','2021-07-01','阿里云平台','全栈开发工作');



insert into Archive(teacher_id,title,obtain_date,detail,type) values('66666666','合肥工业大学最受欢迎教师奖','2016-06-01','本奖励是由学生投票选取',0);
insert into Archive(teacher_id,title,obtain_date,detail,type) values('66666666','授课大赛一等奖','2016-06-01','',0);
insert into Archive(teacher_id,title,obtain_date,detail,type) values('66666666','最佳论文奖','2019-07-25','',0);
insert into Archive(teacher_id,title,obtain_date,detail,type) values('66666666','开会缺勤','2019-07-25','年级大会无故缺席',1);



insert into Research(teacher_id,title,obtain_date,detail) values('66666666','基于机器学习的人脸识别项目','2019-01-06','国家基金项目');
insert into Research(teacher_id,title,obtain_date,detail) values('66666666','机器人仿真实验研究','2009-01-06','国家重点实验室项目');



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
    teacher_id char(8),
    name varchar(32) not null ,
    relation varchar(32)not null,
    phone varchar(32),
    foreign key (teacher_id) references Teacher(id)
);
alter sequence fam_auto_inc owned by Family.id;

insert into Family(teacher_id,name,relation,phone) values('66666666','王富贵','父亲','13698745631');
insert into Family(teacher_id,name,relation,phone) values('66666666','林莉心','母亲','15155068479');

drop view if exists TeacherInfoView cascade;
create view TeacherInfoView as select distinct T.*,D.name as department_name from Teacher T left outer join Department D on T.department_id=D.id  ;
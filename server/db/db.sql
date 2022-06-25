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
    email varchar(256), 
    birthday date, -- 出生日期
    photo varchar(256), -- 照片

    entry_date date, -- 入职时间
    term_date date, -- 离职时间
    
    department_id integer, -- 所属院系
    
    job varchar(256), --职务
    ethnicity varchar(256), -- 民族
    political varchar(256), -- 政治面貌
    address varchar(256), -- 通讯地址
    
    title varchar(256), -- 职称
    foreign key (department_id) references department(id),
    CONSTRAINT emailCheck CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')

);

drop sequence if exists user_auto_inc cascade;
create sequence user_auto_inc
    minvalue 1
    maxvalue 9999999999999
    start with 1
    increment by 1;

drop table if exists TUser cascade;
create table TUser(
    id integer primary key default nextval('user_auto_inc'),
    teacher_id char(8),
    password varchar(100) not null default '123456', --密码
    role varchar(16) default 'user',
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE

);
alter sequence user_auto_inc owned by TUser.id;

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
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE,
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
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE
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
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE
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
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE
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
    teacher_id char(8) not null,
    title varchar(256) not null,
    obtain_date date,
    detail text,
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE
);
alter sequence res_auto_inc owned by Research.id;


insert into Department(name,establish_date,phone,t_count,address)
 values('计算机与信息学院（人工智能学院）','2000-01-30','0551-6290 1380',0,'翡翠湖校区双子楼A做1107');
insert into Department(name,establish_date,phone,t_count,address)
 values('食品与生物工程学院','2021-01-30','0551- 62901362',0,'翡翠湖校区食品与生物工程大楼二楼');
insert into Department(name,establish_date,phone,t_count,address)
 values('材料科学与工程学院','2021-11-30','0551- 62901362',0,'安徽省合肥市屯溪路193号');

 insert into Department(name,establish_date,phone,t_count,address)
 values('外国语学院','2021-11-30','0551-62901716',0,'合肥工业大学翡翠湖校区科教楼A栋第15层');


  insert into Department(name,establish_date,phone,t_count,address)
 values('机械工程学院','2021-11-30','0551-62901326',0,'安徽省合肥市屯溪路193号');
  insert into Department(name,establish_date,phone,t_count,address)
 values('电气与自动化工程学院','2021-11-30','0551-6290-1408',0,'安徽省合肥市屯溪路193号逸夫科教楼');

insert into teacher(id,name,gender,entry_date,phone,job,email,ethnicity,political,address)
 values('00000000','张三',1,'2000-01-30','18755005131','掌管一切','akmoex@gmail.com','汉族','中共党员','安徽省合肥市翡翠湖公寓南楼503');
insert into teacher(id,name,gender,entry_date,phone,job,email,ethnicity,political,address)
 values('00000001','李三光',2,'2000-01-30','18755005131','教书','akmoex@outlook.com','汉族','中共党员','安徽省合肥市翡翠湖公寓南楼503');
insert into teacher(id,name,gender,entry_date,phone,job,email,ethnicity,political,address)
 values('00000002','金毛',1,'2000-01-30','18755005131','科研','akmoex@hfut.edu.com','维吾尔族','共青团员','安徽省合肥市翡翠湖公寓南楼503');

insert into teacher(id,name,gender,phone,email,birthday,photo,entry_date,term_date,department_id,job,ethnicity,political,address,title)
 values('66666666','王维新',1,'15155068084','istormlala@mail.hfut.edu.cn','1976-06-12','/static/t.png','1987-12-01',null,'1','学院执行院长','汉族','中共党员','安徽省蜀山区阳光花园5栋301','教授,特任研究员');
 
 
 insert into Tuser(teacher_id,password,role) values('00000000','123456','admin');
 insert into tuser(teacher_id,password,role) values('00000001','123456','user');
  insert into tuser(teacher_id,password,role) values('00000002','123456','user');
   insert into tuser(teacher_id,password,role) values('66666666','123456','user');





 

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



insert into Family(teacher_id,name,relation,phone) values('66666666','王富贵','父亲','13698745631');
insert into Family(teacher_id,name,relation,phone) values('66666666','林莉心','母亲','15155068479');

drop view if exists TeacherInfoView cascade;
create view TeacherInfoView as select distinct T.*,D.name as department_name from Teacher T left outer join Department D on T.department_id=D.id  ;

drop view if exists ResearchInfoView cascade;
create view ResearchInfoView as select distinct R.*,T.name as teacher_name from Research R,Teacher T where R.teacher_id=T.id  ;

drop view if exists ArchiveInfoView cascade;
create view ArchiveInfoView as select distinct A.*,T.name as teacher_name from Archive A,Teacher T where A.teacher_id=T.id  ;



--创建存储过程update_teacher
CREATE OR REPLACE PROCEDURE update_teacher
(
    tea_id char(8),
    tea_name varchar(32),
    tea_password varchar(100),
    tea_gender tinyint,
    tea_phone varchar(32),
    tea_email varchar(256), -- 邮箱
    tea_birthday date, -- 出生日期
    tea_photo varchar(256), -- 照片
    tea_entry_date date, -- 入职时间
    tea_department_id integer, -- 所属院系
    tea_job varchar(256),
    tea_ethnicity varchar(256), -- 民族
    tea_political varchar(256), -- 政治面貌
    tea_address varchar(256), -- 通讯地址
    tea_title varchar(256), -- 职称
    tea_term_date date --离职时间
)
IS
BEGIN
-- 存在, 则更新
if exists(select * from tuser where teacher_id=tea_id) then
   UPDATE teacher SET name=tea_name,gender=tea_gender,phone=tea_phone,email=tea_email,birthday=tea_birthday,
   photo=tea_photo, entry_date=tea_entry_date,department_id=tea_department_id,job=tea_job, ethnicity=tea_ethnicity,
   political=tea_political,address=tea_address,title=tea_title,term_date=tea_term_date WHERE id = tea_id;
   if tea_password is not null then
        UPDATE TUser SET password=tea_password WHERE teacher_id=tea_id;
   end if; 
else
    -- 没有则插入
    INSERT INTO teacher(id, name,gender,phone,email,birthday,photo,entry_date,department_id,job,ethnicity,political,address,title,term_date)
     VALUES(tea_id,tea_name,tea_gender,tea_phone,tea_email,tea_birthday,tea_photo,tea_entry_date,tea_department_id,tea_job,tea_ethnicity,tea_political,tea_address,tea_title,tea_term_date);
end if;

END;
/




--创建存储过程update_family
CREATE OR REPLACE PROCEDURE update_family
(
    fam_id integer,
    fam_teacher_id char(8),
    fam_name varchar(32),
    fam_relation varchar(32),
    fam_phone varchar(32)
)
IS
BEGIN
-- 存在,则更新
if exists(select * from Family where id=fam_id) then
   UPDATE Family SET teacher_id=fam_teacher_id,name=fam_name,relation=fam_relation,phone=fam_phone WHERE id = fam_id;
-- 没有则插入
else
   INSERT INTO family(teacher_id,name,relation,phone) VALUES(fam_teacher_id,fam_name,fam_relation,fam_phone);
end if;

END;
/


--创建存储过程update_archive
CREATE OR REPLACE PROCEDURE update_archive
(
    arc_id integer,
    arc_teacher_id char(8),
    arc_title varchar(32),
    arc_obtain_date date,
    arc_detail text,
    arc_type tinyint
)
IS
BEGIN
-- 存在,则更新
if exists(select * from Archive where id=arc_id) then
   UPDATE Archive SET teacher_id=arc_teacher_id,title=arc_title,obtain_date=arc_obtain_date,detail=arc_detail,type=arc_type WHERE id = arc_id;
-- 没有则插入
else
   INSERT INTO Archive(teacher_id,title,obtain_date,detail,type) VALUES(arc_teacher_id,arc_title,arc_obtain_date,arc_detail,arc_type);
end if;

END;
/


--创建存储过程update_research
CREATE OR REPLACE PROCEDURE update_research
(
    res_id integer ,
    res_teacher_id char(8),
    res_title varchar(256),
    res_obtain_date date,
    res_detail text
)
IS
BEGIN
-- 存在,则更新
if exists(select * from Research where id=res_id) then
   UPDATE Research SET teacher_id=res_teacher_id,title=res_title,obtain_date=res_obtain_date,detail=res_detail WHERE id = res_id;
-- 没有则插入
else
   INSERT INTO Research(teacher_id,title,obtain_date,detail) VALUES(res_teacher_id,res_title,res_obtain_date,res_detail);
end if;

END;
/



--创建存储过程update_education
CREATE OR REPLACE PROCEDURE update_education
(
    edu_id integer,
    edu_teacher_id char(8),
    edu_start_date date,
    edu_end_date date,
    edu_school varchar(256),
    edu_degree varchar(32) ,
    edu_major varchar(256)
)
IS
BEGIN
-- 存在,则更新
if exists(select * from Education where id=edu_id) then
   UPDATE Education SET teacher_id=edu_teacher_id, start_date=edu_start_date,end_date=edu_end_date,school=edu_school,
   degree=edu_degree,major=edu_major WHERE id = edu_id;
-- 没有则插入
else
   INSERT INTO Education(teacher_id,start_date,end_date,school,degree,major) VALUES(edu_teacher_id,edu_start_date,edu_end_date,edu_school,edu_degree,edu_major);
end if;

END;
/



--创建存储过程update_work
CREATE OR REPLACE PROCEDURE update_work
(
    work_id integer,
    work_teacher_id char(8),
    work_start_date date,
    work_end_date date,
    work_location varchar(32),
    work_content varchar(32)
)
IS
BEGIN
-- 存在,则更新
if exists(select * from Work where id=work_id) then
   UPDATE Work SET teacher_id=work_teacher_id,start_date=work_start_date,end_date=work_end_date,location=work_location,content=work_content WHERE id = work_id;
-- 没有则插入
else
   INSERT INTO Work(teacher_id,start_date,end_date,location,content) VALUES(work_teacher_id,work_start_date,work_end_date,work_location,work_content);
end if;

END;
/
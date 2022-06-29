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
    phone varchar(20),
    t_count int default 0,
    address varchar(255),
    -- 成立时间约束
    CONSTRAINT dateCheck CHECK (establish_date is null or establish_date<=now())
);
-- 将自增学列 dep_auto_inc 与Department关联, 实现主键自增
alter sequence dep_auto_inc owned by department.id;



drop table if exists Teacher cascade;
create table Teacher(
    id char(8) primary key,-- 工号
    name varchar(32) not null, -- 姓名
    gender tinyint, -- 1男2女
    phone varchar(20), -- 手机号码
    email varchar(127), --邮箱
    birthday date, -- 出生日期
    photo varchar(255), -- 照片
    entry_date date, -- 入职时间
    term_date date, -- 离职时间
    department_id integer, -- 所属院系
    job varchar(255), --职务
    ethnicity varchar(16), -- 民族
    political varchar(16), -- 政治面貌
    address varchar(255), -- 通讯地址
    title varchar(16), -- 职称
    foreign key (department_id) references department(id),
    -- 邮箱约束
    CONSTRAINT emailCheck CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    CONSTRAINT idCheck CHECK (id ~* '^\d{8}'),
    
    -- 入职离职时间的约束
    CONSTRAINT dateCheck CHECK (not(
       
        (entry_date>term_date) or
        (entry_date>now()) or 
        (term_date >now())
    )),
    -- 性别约束 1男2女
    CONSTRAINT genderCheck CHECK (gender in (1,2)),
    
);
CREATE INDEX  pol_index ON Teacher(political);
CREATE INDEX dep_index ON Teacher(department_id);
CREATE INDEX tit_index ON Teacher(title);


--TUser表
drop sequence if exists user_auto_inc cascade;
create sequence user_auto_inc
    minvalue 1
    maxvalue 9999999999999
    start with 1
    increment by 1;
drop table if exists TUser cascade;
create table TUser(
    id integer primary key default nextval('user_auto_inc'),
    teacher_id char(8) not null,
    password text not null , --密码
    role varchar(16) default 'user',
    status tinyint default 1, -- 1有效在职,0无效离职
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE,
    CONSTRAINT statusCheck CHECK (status in (1,0)),
    CONSTRAINT passwordCheck CHECK(password ~* '^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,16}$')
);
CREATE UNIQUE INDEX tuser_tea_index ON TUser(teacher_id);




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
    teacher_id char(8) not null,
    start_date date not null,
    end_date date not null,
    school varchar(64) not null,
    degree varchar(16) not null,
    major varchar(32),
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE,
    CONSTRAINT degreeCheck CHECK (degree in ('本科','硕士','博士','博士后')),
    CONSTRAINT dateCheck CHECK (start_date<end_date and start_date<=now()),
    CONSTRAINT uniqueCheck UNIQUE (teacher_id,degree)
);
alter sequence edu_auto_inc owned by Education.id;
CREATE INDEX edu_tea_index ON Education(teacher_id);


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
    teacher_id char(8) not null,
    name varchar(32) not null ,
    relation varchar(32) not null,
    phone varchar(20),
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE,
    CONSTRAINT uniqueCheck1 UNIQUE (teacher_id,name),
    CONSTRAINT uniqueCheck2 UNIQUE (teacher_id,relation)
);
alter sequence fam_auto_inc owned by Family.id;
CREATE INDEX fam_tea_index ON Family(teacher_id);

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
    teacher_id char(8) not null,
    start_date date not null,
    end_date date not null,
    location varchar(32) not null,
    content varchar(255),
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE,
    CONSTRAINT dateCheck CHECK (start_date<end_date and start_date<=now())
);
alter sequence work_auto_inc owned by Work.id;
CREATE INDEX work_tea_index ON Work(teacher_id);



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
    teacher_id char(8) not null,
    title varchar(128) not null,
    obtain_date date,
    detail text,
    -- 奖励为0,惩罚为1
    type tinyint default 0,
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE,
    CONSTRAINT typeCheck CHECK( type in (0,1)),
    CONSTRAINT dateCheck CHECK (obtain_date is null or obtain_date<=now())
);
alter sequence arc_auto_inc owned by Archive.id;
CREATE INDEX work_tea_index ON Work(teacher_id);


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
    title varchar(128) not null,
    obtain_date date,
    detail text,
    foreign key (teacher_id) references Teacher(id) ON DELETE CASCADE,
    CONSTRAINT dateCheck CHECK (obtain_date is null or obtain_date<=now())
);
alter sequence res_auto_inc owned by Research.id;
CREATE INDEX res_tea_index ON Research(teacher_id);




drop view if exists TeacherInfoView cascade;
create view TeacherInfoView as select distinct T.*,D.name as department_name from Teacher T left outer join Department D on T.department_id=D.id  ;

drop view if exists ResearchInfoView cascade;
create view ResearchInfoView as select distinct R.*,T.name as teacher_name from Research R,Teacher T where R.teacher_id=T.id  ;

drop view if exists ArchiveInfoView cascade;
create view ArchiveInfoView as select distinct A.*,T.name as teacher_name from Archive A,Teacher T where A.teacher_id=T.id  ;






insert into Department(name,establish_date,phone,address)
 values('计算机与信息学院（人工智能学院）','2000-01-30','0551-6290 1380','翡翠湖校区双子楼A做1107');
insert into Department(name,establish_date,phone,address)
 values('食品与生物工程学院','2021-01-30','0551-62901362','翡翠湖校区食品与生物工程大楼二楼');
insert into Department(name,establish_date,phone,address)
 values('材料科学与工程学院','2021-11-30','0551-62901362','安徽省合肥市屯溪路193号');

 insert into Department(name,establish_date,phone,address)
 values('外国语学院','2021-11-30','0551-62901716','合肥工业大学翡翠湖校区科教楼A栋第15层');


  insert into Department(name,establish_date,phone,address)
 values('机械工程学院','2021-11-30','0551-62901326','安徽省合肥市屯溪路193号');
  insert into Department(name,establish_date,phone,address)
 values('电气与自动化工程学院','2021-11-30','0551-6290-1408','安徽省合肥市屯溪路193号逸夫科教楼');



--创建存储过程update_teacher
CREATE OR REPLACE PROCEDURE update_teacher
(
    tea_id char(8),
    tea_name varchar(32),
    tea_password text,
    tea_gender tinyint,
    tea_phone varchar(20),
    tea_email varchar(127), -- 邮箱
    tea_birthday date, -- 出生日期
    tea_photo varchar(255), -- 照片
    tea_entry_date date, -- 入职时间
    tea_department_id integer, -- 所属院系
    tea_job varchar(255),
    tea_ethnicity varchar(16), -- 民族
    tea_political varchar(16), -- 政治面貌
    tea_address varchar(255), -- 通讯地址
    tea_title varchar(16), -- 职称
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
    insert into tuser(teacher_id,password) values(tea_id,tea_password);
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
    fam_phone varchar(20)
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
    arc_title varchar(128),
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
    res_title varchar(128),
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
    edu_school varchar(64),
    edu_degree varchar(16) ,
    edu_major varchar(32)
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
    work_content varchar(255)
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




CREATE OR REPLACE FUNCTION updateDepNumFun() RETURNS TRIGGER AS 
$$

DECLARE
    new_dep INTEGER;
    old_dep INTEGER;
    
BEGIN
    IF (TG_OP = 'INSERT') THEN
        new_dep = NEW.department_id;
        UPDATE Department
        SET t_count = t_count + 1
        WHERE new_dep = Department.id;
    ELSIF (TG_OP='UPDATE') THEN
        new_dep = NEW.department_id;
        old_dep =OLD.department_id;
        UPDATE Department
        SET t_count = t_count + 1
        WHERE new_dep = Department.id;
        UPDATE department SET t_count=t_count-1 WHERE old_dep=department.id;
    ELSIF (TG_OP='DELETE') THEN
        old_dep=OLD.department_id;
        update department SET t_count=t_count-1 where old_dep=department.id;
    END IF;
RETURN NULL;    
END
$$ LANGUAGE plpgsql;



CREATE TRIGGER updateDepNum
AFTER INSERT OR UPDATE OR DELETE ON Teacher
FOR EACH ROW 
EXECUTE PROCEDURE updateDepNumFun();



-- 改变TUser状态
CREATE OR REPLACE FUNCTION autoUserStatusFun() RETURNS TRIGGER AS 
$$
DECLARE
BEGIN
    IF NEW.term_date is not null THEN
    UPDATE TUser
    SET status = 0
    WHERE NEW.id = TUser.teacher_id;
    END IF;
RETURN NULL;    
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER autoUserStatus
AFTER UPDATE of term_date ON Teacher
FOR EACH ROW 
EXECUTE PROCEDURE autoUserStatusFun();



CREATE OR REPLACE FUNCTION autoDeleteUserFun() RETURNS TRIGGER AS 
$$
DECLARE
    old_id char(8);
BEGIN
    old_id = OLD.id;
    DELETE FROM TUser WHERE old_id=TUser.teacher_id;
RETURN NULL;    
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER autoDeleteUser
AFTER DELETE ON Teacher
FOR EACH ROW 
EXECUTE PROCEDURE autoDeleteUserFun();


create type sys_type as (tea_cnt bigint,dep_cnt bigint,res_cnt bigint,arc_cnt bigint);
create or replace function getSys()
returns sys_type as 
$$
declare
   result_record sys_type;
begin
    select count(*) from teacher into result_record.tea_cnt;
    select count(*) from department into result_record.dep_cnt;
    select count(*) from Archive INTO result_record.arc_cnt;
    select count(*) from Research into result_record.res_cnt;
    return result_record;
end;
$$ language plpgsql;





CREATE OR REPLACE FUNCTION encrypt_password()
  RETURNS TRIGGER AS
$func$
BEGIN  
 --IF (TG_OP='UPDATE')THEN
 --   NEW.password := gs_encrypt_aes128(OLD.password, 'Asdf1234'); 
 --ELSE 
    NEW.password := gs_encrypt_aes128(NEW.password, 'Asdf1234'); 
 --END IF;
 RETURN NEW;
END
$func$ LANGUAGE plpgsql;

CREATE TRIGGER encrypt_userdata
BEFORE INSERT OR UPDATE  ON tuser
FOR EACH ROW
EXECUTE PROCEDURE encrypt_password();


create type user_type as (tea_role varchar(16),tea_status tinyint);
create or replace function getUser(
    tea_id char(8),
    tea_password text
)
returns user_type as 
$$
declare
   result_record user_type;
begin
    select  role,status from tuser into result_record.tea_role,result_record.tea_status  
    where teacher_id=tea_id and gs_decrypt_aes128(password,'Asdf1234')=tea_password;
    return result_record;
end;
$$ language plpgsql;
















insert into teacher(id,name,gender,entry_date,phone,job,email,ethnicity,political,address)
 values('00000000','张三',1,'2000-01-30','18755005131','掌管一切','akmoex@gmail.com','汉族','中共党员','安徽省合肥市翡翠湖公寓南楼503');
insert into teacher(id,name,gender,entry_date,phone,job,email,ethnicity,political,address)
 values('00000001','李三光',2,'2000-01-30','18755005131','教书','akmoex@outlook.com','汉族','中共党员','安徽省合肥市翡翠湖公寓南楼503');
insert into teacher(id,name,gender,entry_date,phone,job,email,ethnicity,political,address)
 values('00000002','金毛',1,'2000-01-30','18755005131','科研','akmoex@hfut.edu.com','维吾尔族','共青团员','安徽省合肥市翡翠湖公寓南楼503');

insert into teacher(id,name,gender,phone,email,birthday,photo,entry_date,term_date,department_id,job,ethnicity,political,address,title)
 values('66666666','王维新',1,'15155068084','istormlala@mail.hfut.edu.cn','1976-06-12','/static/t.png','1987-12-01',null,'1','学院执行院长','汉族','中共党员','安徽省蜀山区阳光花园5栋301','教授');
 
insert into teacher(id,name,gender,phone,email,birthday,photo,entry_date,term_date,department_id,job,ethnicity,political,address,title)
 values('20192146','何斌',1,'15155068084','istormlala@mail.hfut.edu.cn','1976-06-12','/static/t.png','1987-12-01',null,'1','学院执行院长','汉族','中共党员','安徽省蜀山区阳光花园5栋301','教授');

 insert into teacher(id,name,gender,phone,email,birthday,photo,entry_date,term_date,department_id,job,ethnicity,political,address,title)
 values('20192147','李样',1,'15155068084','istormlala@mail.hfut.edu.cn','1976-06-12','/static/t.png','1987-12-01',null,'1','学院执行院长','汉族','中共党员','安徽省蜀山区阳光花园5栋301','副教授');

insert into teacher(id,name,gender,phone,email,birthday,photo,entry_date,term_date,department_id,job,ethnicity,political,address,title)
 values('20192149','李死光',1,'15155068084','istormlala@mail.hfut.edu.cn','1976-06-12','/static/t.png','1987-12-01',null,'1','学院执行院长','汉族','中共党员','安徽省蜀山区阳光花园5栋301','院士');

 insert into teacher(id,name,gender,phone,email,birthday,photo,entry_date,term_date,department_id,job,ethnicity,political,address,title)
 values('20192186','张艺兴',1,'15155068084','istormlala@mail.hfut.edu.cn','1976-06-12','/static/t.png','1987-12-01',null,'1','学院执行院长','汉族','中共党员','安徽省蜀山区阳光花园5栋301','特任研究员');


insert into teacher(id,name,gender,phone,email,birthday,photo,entry_date,term_date,department_id,job,ethnicity,political,address,title)
 values('30192146','宇文杜',1,'15155068084','istormlala@mail.hfut.edu.cn','1976-06-12','/static/t.png','1987-12-01',null,'1','学院执行院长','汉族','中共党员','安徽省蜀山区阳光花园5栋301','特任研究员');

insert into teacher(id,name,gender,phone,email,birthday,photo,entry_date,term_date,department_id,job,ethnicity,political,address,title)
 values('20199146','李李',1,'15155068084','istormlala@mail.hfut.edu.cn','1976-06-12','/static/t.png','1987-12-01',null,'1','学院执行院长','汉族','中共党员','安徽省蜀山区阳光花园5栋301','特任教授');

insert into teacher(id,name,gender,phone,email,birthday,photo,entry_date,term_date,department_id,job,ethnicity,political,address,title)
 values('20112146','换行',1,'15155068084','istormlala@mail.hfut.edu.cn','1976-06-12','/static/t.png','1987-12-01',null,'1','学院执行院长','汉族','中共党员','安徽省蜀山区阳光花园5栋301','院士');



 insert into Tuser(teacher_id,password,role) values('00000000','123456','admin');
 insert into tuser(teacher_id,password,role) values('00000001','123456','user');
  insert into tuser(teacher_id,password,role) values('00000002','123456','user');
   insert into tuser(teacher_id,password,role) values('66666666','123456','user');

   insert into tuser(teacher_id,password,role) values('20192146','123456','user');
   insert into tuser(teacher_id,password,role) values('20192147','123456','user');
   insert into tuser(teacher_id,password,role) values('20192149','123456','user');
   insert into tuser(teacher_id,password,role) values('20192186','123456','user');
   insert into tuser(teacher_id,password,role) values('30192146','123456','user');
   insert into tuser(teacher_id,password,role) values('20199146','123456','user');
   insert into tuser(teacher_id,password,role) values('20112146','123456','user');



insert into Education(teacher_id,start_date,end_date,school,degree) values('66666666','2016-06-01','2019-07-01','合肥工业大学','本科');
insert into Education(teacher_id,start_date,end_date,school,degree) values('66666666','2019-09-01','2020-07-01','合肥工业大学','硕士');
insert into Education(teacher_id,start_date,end_date,school,degree) values('66666666','2021-08-01','2022-06-01','中国科学技术大学','博士');

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







create type dt_type as (name varchar(128),title varchar(16),cnt bigint);
create or replace function departmentTitle()
returns setof dt_type as 
$$
declare
   r dt_type%rowtype;
begin
   return query select D.name,title,count(*) from (SELECT id,title,department_id from teacher where department_id is not null) as T(id,title,department_id),Department D
    where  T.department_id=D.id group by D.name,T.title;
   
end;
$$ language plpgsql;
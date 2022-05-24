DROP SEQUENCE IF EXISTS dep_auto_inc;
CREATE SEQUENCE dep_auto_inc
    MINVALUE 1
    MAXVALUE 9999999999999
    START WITH 1
    INCREMENT BY 1;

DROP TABLE IF EXISTS Department CASCADE;
CREATE TABLE Department(
    id INTEGER PRIMARY KEY DEFAULT nextval('dep_auto_inc'),
    name VARCHAR(32) UNIQUE,
    establish_date DATE,
    phone VARCHAR(32)
);

ALTER SEQUENCE dep_auto_inc OWNED BY Department.id;

DROP TABLE IF EXISTS Teacher CASCADE;
CREATE TABLE Teacher(
    id CHAR(8) PRIMARY KEY,
    name VARCHAR(32),
    sex TINYINT CHECK (sex IN (1,2)),
    entry_date DATE,
    term_date DATE,
    phone VARCHAR(32),
    department INTEGER,
    password VARCHAR(100) NOT NULL DEFAULT '',
    FOREIGN KEY (department) REFERENCES Department(id)
);
INSERT INTO Teacher VALUES('00000000','张三',1,'2000-01-30','2000-01-30','18755005131',NULL,'123456');
INSERT INTO Teacher VALUES('00000001','李四',1,'2000-01-30','2000-01-30','18755005131',NULL,'123456');
INSERT INTO Teacher VALUES('00000002','王五',1,'2000-01-30','2000-01-30','18755005131',NULL,'123456');
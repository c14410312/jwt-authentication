INSERT INTO users (uname, password) VALUES('dbutler@test.com', crypt('password', gen_salt('bf', 8)));

INSERT INTO users (uname, password) VALUES('test@test.com', crypt('testpass', gen_salt('bf', 8)));


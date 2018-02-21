CREATE TABLE Users(
	id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
	uname text NOT NULL,
	password text NOT NULL
);	

DROP TABLE IF EXISTS public.muni_data;

CREATE TABLE public.muni_data
(
    id SERIAL PRIMARY KEY,
    vuosi integer,
    nimi varchar(30),
    kuntanro integer,
    s1 double precision,
    s43 double precision,
    s3 double precision,
    s5 double precision,
    s7 double precision,
    s8 double precision,
    s38 double precision,
    s12 double precision,
    s13 double precision,
    s14 double precision,
    s15 double precision,
    s16 double precision,
    s17 double precision,
    s18 double precision,
    s40 double precision,
    s19 double precision,
    s29 double precision,
    s28 double precision,
    s37 double precision,
    s22 double precision,
    s27 double precision,
    s25 double precision
);

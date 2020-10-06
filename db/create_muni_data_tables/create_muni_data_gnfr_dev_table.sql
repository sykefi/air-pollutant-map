-- create final muni_data_gnfr_dev table by joining geometry to muni_data_master table
DROP TABLE IF EXISTS public.muni_data_gnfr_dev;
CREATE TABLE public.muni_data_gnfr_dev AS (
  SELECT K100.kuntanimi as nimi, K100.kuntanimir as namn, MD.kuntanro, vuosi, gnfr, K45.geom, K100.shape_star as area, s16,s15,s22,s13,s28,s29,s27,s43,s5,s18,s3,s12,s1,s7,s8,s14,s37,s25,s19,s17,s38,s40
  FROM public.muni_data_master AS MD
  INNER JOIN public.hall100kunta2020 AS K100 ON K100.kuntanro = MD.kuntanro
  INNER JOIN public.hall4_5miljkunta2020 AS K45 ON K45.kuntanro = MD.kuntanro  
);

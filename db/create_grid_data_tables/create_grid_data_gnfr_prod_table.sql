DROP TABLE IF EXISTS public.gnfr_dev_prod_map;

CREATE TABLE public.gnfr_dev_prod_map (
  gnfr_dev VARCHAR(40) NOT NULL,
  gnfr_prod VARCHAR(40) NOT NULL
);

INSERT INTO
  public.gnfr_dev_prod_map (gnfr_dev, gnfr_prod)
VALUES
  ('A_PublicPower',	'GROUP_PowerIndustry'),
  ('B_Industry',	'GROUP_PowerIndustry'),
  ('D_Fugitive',	'GROUP_PowerIndustry'),
  ('C_OtherStationaryComb',	'GROUP_OtherComb'),
  ('I_Offroad',	'GROUP_Transport'),
  ('H_Aviation',	'GROUP_Transport'),
  ('F_RoadTransport',	'GROUP_Transport'),
  ('G_Shipping',	'GROUP_Transport'),
  ('E_Solvents',	'GROUP_Products'),
  ('M_Other',	'GROUP_Products'),
  ('J_Waste',	'GROUP_Products'),
  ('K_AgriLivestock',	'GROUP_Agriculture'),
  ('L_AgriOther',	'GROUP_Agriculture');

-- group grid data (master) by prod gnfr names -> create a temporary tables
DROP TABLE IF EXISTS public.grid_data_gnfr_prod_groups;
CREATE TABLE public.grid_data_gnfr_prod_groups AS (
    SELECT vuosi,rivi,gnfr_prod,sum(s16) as s16,sum(s15) as s15,sum(s22) as s22,sum(s13) as s13,sum(s28) as s28,sum(s29) as s29,sum(s27) as s27,sum(s43) as s43,sum(s5) as s5,sum(s18) as s18,sum(s3) as s3,sum(s12) as s12,sum(s1) as s1,sum(s7) as s7,sum(s8) as s8,sum(s14) as s14,sum(s37) as s37,sum(s25) as s25,sum(s19) as s19,sum(s17) as s17,sum(s38) as s38,sum(s40) as s40
    FROM grid_data_master AS GD
    INNER JOIN public.gnfr_dev_prod_map AS GNFR_MAP ON GNFR_MAP.gnfr_dev = GD.gnfr
    GROUP BY vuosi, rivi, gnfr_prod
);
-- select vuosi, rivi, gnfr_prod, s16 from public.grid_data_gnfr_prod_groups ORDER BY rivi limit 30;

-- create final grid_data_gnfr_prod table by joining geometry to grid_data_gnfr_prod_groups table
DROP TABLE IF EXISTS grid_data_gnfr_prod;
CREATE TABLE grid_data_gnfr_prod AS (
    SELECT vuosi,rivi,geom_web as geom,gnfr_prod as gnfr,s16,s15,s22,s13,s28,s29,s27,s43,s5,s18,s3,s12,s1,s7,s8,s14,s37,s25,s19,s17,s38,s40
    FROM grid_data_gnfr_prod_groups AS GD
    INNER JOIN emep_grid_01 AS G ON G.ruutu_id = GD.rivi
);
CREATE INDEX gnfr_prod_year_gnfr_idx ON grid_data_gnfr_prod (vuosi, gnfr);

-- drop temporary tables
DROP TABLE grid_data_gnfr_prod_groups;
DROP TABLE gnfr_dev_prod_map;

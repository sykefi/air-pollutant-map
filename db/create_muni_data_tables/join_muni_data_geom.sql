ALTER TABLE public.muni_data
    DROP COLUMN IF EXISTS geom, DROP COLUMN IF EXISTS area;

ALTER TABLE public.muni_data 
    ADD COLUMN IF NOT EXISTS namn varchar(30),
    ADD COLUMN IF NOT EXISTS geom geometry(MultiPolygon,3857),
    ADD COLUMN IF NOT EXISTS area double precision;

UPDATE muni_data
    SET namn = hall100kunta2020.kuntanimir
    FROM hall100kunta2020 WHERE hall100kunta2020.kuntanro = muni_data.kuntanro;

UPDATE muni_data
    SET geom = hall4_5miljkunta2020.geom
    FROM hall4_5miljkunta2020 WHERE hall4_5miljkunta2020.kuntanro = muni_data.kuntanro;

UPDATE muni_data
    SET area = hall100kunta2020.shape_star
    FROM hall100kunta2020 WHERE hall100kunta2020.kuntanro = muni_data.kuntanro;

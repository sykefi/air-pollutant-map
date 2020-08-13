ALTER TABLE public.muni_data
    DROP COLUMN IF EXISTS geom, DROP COLUMN IF EXISTS area;

ALTER TABLE public.muni_data 
    ADD COLUMN IF NOT EXISTS geom geometry(MultiPolygon,3857),
    ADD COLUMN IF NOT EXISTS area double precision;

UPDATE muni_data
    SET geom = hall4_5miljkunta2019.geom
    FROM hall4_5miljkunta2019 WHERE hall4_5miljkunta2019.kuntanro = muni_data.kuntanro;

UPDATE muni_data
    SET area = hall4_5miljkunta2019.area
    FROM hall4_5miljkunta2019 WHERE hall4_5miljkunta2019.kuntanro = muni_data.kuntanro;

DROP TABLE IF EXISTS grid_data_gnfr;

CREATE TABLE grid_data_gnfr AS (
    SELECT vuosi,rivi,geom_web as geom,gnfr,s16,s15,s22,s13,s28,s29,s27,s43,s5,s18,s3,s12,s1,s7,s8,s14,s19,s17,s38,s40 FROM grid_data AS GD
    INNER JOIN emep_grid_01 AS G ON G.ruutu_id = GD.rivi
);
DROP INDEX IF EXISTS year_gnfr_idx;
CREATE INDEX year_gnfr_idx ON grid_data_gnfr (vuosi, gnfr);

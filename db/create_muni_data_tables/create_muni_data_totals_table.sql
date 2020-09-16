DROP TABLE IF EXISTS muni_data_totals;

CREATE TABLE muni_data_totals AS (
    SELECT K45.kuntanimi as nimi, K45.kuntanimir as namn, K45.geom, K100.shape_star as area, MD.*
    FROM 
        (
        SELECT vuosi,kuntanro, sum(s16) as s16, sum(s15) as s15, sum(s22) as s22, sum(s13) as s13, sum(s28) as s28, sum(s29) as s29, sum(s27) as s27, sum(s43) as s43, sum(s5) as s5, sum(s18) as s18, sum(s3) as s3, sum(s12) as s12, sum(s1) as s1, sum(s7) as s7, sum(s8) as s8, sum(s14) as s14, sum(s37) as s37, sum(s25) as s25, sum(s19) as s19, sum(s17) as s17, sum(s38) as s38, sum(s40) as s40 
        FROM muni_data as MD
        GROUP BY vuosi,kuntanro
        ) AS MD
    INNER JOIN hall4_5miljkunta2020 AS K45 ON K45.kuntanro = MD.kuntanro
    INNER JOIN hall100kunta2020 AS K100 ON K100.kuntanro = MD.kuntanro
);

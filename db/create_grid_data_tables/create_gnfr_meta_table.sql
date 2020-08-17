DROP TABLE IF EXISTS public.gnfr_meta;

CREATE TABLE public.gnfr_meta
(
    id SERIAL PRIMARY KEY,
    db_key VARCHAR(30),
    nimi VARCHAR(30),
    namn VARCHAR(30),
    name VARCHAR(30),
    use_dev BOOLEAN DEFAULT FALSE,
    use_prod BOOLEAN DEFAULT FALSE
);

INSERT INTO 
    public.gnfr_meta (db_key, nimi, namn, name, use_dev)
VALUES
    ('COMBINED', 'Kaikki', 'Combined', 'Combined', 'TRUE'),
    ('I_Offroad', 'I_Offroad', 'I_Offroad', 'I_Offroad', 'TRUE'),
    ('A_PublicPower', 'A_PublicPower', 'A_PublicPower', 'A_PublicPower', 'TRUE'),
    ('K_AgriLivestock', 'K_AgriLivestock', 'K_AgriLivestock', 'K_AgriLivestock', 'TRUE'),
    ('G_Shipping', 'G_Shipping', 'G_Shipping', 'G_Shipping', 'TRUE'),
    ('H_Aviation', 'H_Aviation', 'H_Aviation', 'H_Aviation', 'TRUE'),
    ('F_RoadTransport', 'F_RoadTransport', 'F_RoadTransport', 'F_RoadTransport', 'TRUE'),
    ('B_Industry', 'B_Industry', 'B_Industry', 'B_Industry', 'TRUE'),
    ('C_OtherStationaryComb', 'C_OtherStationaryComb', 'C_OtherStationaryComb', 'C_OtherStationaryComb', 'TRUE'),
    ('L_AgriOther', 'L_AgriOther', 'L_AgriOther', 'L_AgriOther', 'TRUE'),
    ('E_Solvents', 'E_Solvents', 'E_Solvents', 'E_Solvents', 'TRUE'),
    ('J_Waste', 'J_Waste', 'J_Waste', 'J_Waste', 'TRUE'),
    ('D_Fugitive', 'D_Fugitive', 'D_Fugitive', 'D_Fugitive', 'TRUE');

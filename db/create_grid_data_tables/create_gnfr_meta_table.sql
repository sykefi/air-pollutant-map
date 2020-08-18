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
    ('COMBINED', 'Kaikki', 'Combined_sv', 'Combined', 'TRUE'),
    ('I_Offroad', 'I_Offroad_fi', 'I_Offroad_sv', 'I_Offroad_en', 'TRUE'),
    ('A_PublicPower', 'A_PublicPower_fi', 'A_PublicPower_sv', 'A_PublicPower_en', 'TRUE'),
    ('K_AgriLivestock', 'K_AgriLivestock_fi', 'K_AgriLivestock_sv', 'K_AgriLivestock_en', 'TRUE'),
    ('G_Shipping', 'G_Shipping_fi', 'G_Shipping_sv', 'G_Shipping_en', 'TRUE'),
    ('H_Aviation', 'H_Aviation_fi', 'H_Aviation_sv', 'H_Aviation_en', 'TRUE'),
    ('F_RoadTransport', 'F_RoadTransport_fi', 'F_RoadTransport_sv', 'F_RoadTransport_en', 'TRUE'),
    ('B_Industry', 'B_Industry_fi', 'B_Industry_sv', 'B_Industry_en', 'TRUE'),
    ('C_OtherStationaryComb', 'C_OtherStationaryComb_fi', 'C_OtherStationaryComb_sv', 'C_OtherStationaryComb_en', 'TRUE'),
    ('L_AgriOther', 'L_AgriOther_fi', 'L_AgriOther_sv', 'L_AgriOther_en', 'TRUE'),
    ('E_Solvents', 'E_Solvents_fi', 'E_Solvents_sv', 'E_Solvents_en', 'TRUE'),
    ('J_Waste', 'J_Waste_fi', 'J_Waste_sv', 'J_Waste_en', 'TRUE'),
    ('D_Fugitive', 'D_Fugitive_fi', 'D_Fugitive_sv', 'D_Fugitive_en', 'TRUE');

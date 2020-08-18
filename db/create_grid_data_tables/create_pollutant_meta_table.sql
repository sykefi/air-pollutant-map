DROP TABLE IF EXISTS public.pollutant_meta;

CREATE TABLE public.pollutant_meta
(
    id SERIAL PRIMARY KEY,
    parloc_ryhma_tunnus INTEGER NOT NULL,
    parloc_ryhma_nimi VARCHAR(15) NOT NULL,
    db_col VARCHAR(10) NOT NULL,
    nimi VARCHAR(40) NOT NULL,
    namn VARCHAR(40) NOT NULL,
    name VARCHAR(40) NOT NULL,
    raja_arvo DOUBLE PRECISION,
    yksikko VARCHAR(15) NOT NULL,
    rap_yksikko VARCHAR(15) NOT NULL,
    ryhma VARCHAR(10),
    use_dev BOOLEAN NOT NULL DEFAULT FALSE,
    use_prod BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO 
    public.pollutant_meta (parloc_ryhma_tunnus,parloc_ryhma_nimi,db_col,nimi,namn,name,raja_arvo,yksikko,rap_yksikko,ryhma,use_dev,use_prod)
VALUES
    (1, 'As','s1','Arseeni','Arseeni','Arseeni','20','kg','Mg','HM','TRUE','FALSE'),
    (2, 'Bentseeni','s2','Bentseeni','Bentseeni','Bentseeni','1','t','Gg',NULL,'FALSE','FALSE'),
    (3, 'Cd','s3','Kadmium','Kadmium','Kadmium','10','kg','Mg','HM','TRUE','FALSE'),
    (4, 'CH4','s4','Metaani','Metaani','Metaani','100','t','Gg','GHG','FALSE','FALSE'),
    (5, 'CO','s5','Hiilimonoksidi','Hiilimonoksidi','Hiilimonoksidi','500','t','Gg',NULL,'TRUE','FALSE'),
    (6, 'CO2 (FOSS)','s6','Hiilidioksidi, fossiilinen','Hiilidioksidi, fossiilinen','Hiilidioksidi, fossiilinen','100000','t','Gg','GHG','FALSE','FALSE'),
    (7, 'Cr','s7','Kromi','Kromi','Kromi','100','kg','Mg','HM','TRUE','FALSE'),
    (8, 'Cu','s8','Kupari','Kupari','Kupari','100','kg','Mg','HM','TRUE','FALSE'),
    (9, 'DCM','s9','Dikloorimetaani','Dikloorimetaani','Dikloorimetaani','1','t','Gg',NULL,'FALSE','FALSE'),
    (10, 'Fl','s10','Fluorit','Fluorit','Fluorit','5','t','0',NULL,'FALSE','FALSE'),
    (11, 'HCl','s11','Suolahappo','Suolahappo','Suolahappo','10','t','0',NULL,'FALSE','FALSE'),
    (12, 'Hg','s12','Elohopea','Elohopea','Elohopea','10','kg','Mg','HM','TRUE','FALSE'),
    (13, 'NH3 + NH4','s13','Ammoniakki','Ammoniakki','Ammoniakki','10','t','Gg',NULL,'TRUE','FALSE'),
    (14, 'Ni','s14','Nikkeli','Nikkeli','Nikkeli','50','kg','Mg','HM','TRUE','FALSE'),
    (15, 'NMVOC','s15','NMVOC','NMVOC','NMVOC','100','t','Gg',NULL,'TRUE','FALSE'),
    (16, 'Nox','s16','Typen oksidit','Typen oksidit','Typen oksidit','100','t','Gg',NULL,'TRUE','FALSE'),
    (17, 'PAH-yhdisteet','s17','PAH-yhdisteet','PAH-yhdisteet','PAH-yhdisteet','500000','g','Mg','POP','TRUE','FALSE'),
    (18, 'Pb','s18','Lyijy','Lyijy','Lyijy','200','kg','Mg','HM','TRUE','FALSE'),
    (19, 'PCDD + PCDF','s19','Dioksiinit ja furaanit','Dioksiinit ja furaanit','Dioksiinit ja furaanit','1','g','g I-Teq','POP','TRUE','FALSE'),
    (20, 'PER','s20','Tetrakloorietyleeni','Tetrakloorietyleeni','Tetrakloorietyleeni','2','t','Gg',NULL,'FALSE','FALSE'),
    (22, 'SO2','s22','Rikkidioksidi','Rikkidioksidi','Rikkidioksidi','150','t','Gg',NULL,'TRUE','FALSE'),
    (23, 'TCE','s23','Trikloorietaani','Trikloorietaani','Trikloorietaani','0.1','t','Gg',NULL,'FALSE','FALSE'),
    (24, 'TRI','s24','Trikloorietyleeni','Trikloorietyleeni','Trikloorietyleeni','2','t','Gg',NULL,'FALSE','FALSE'),
    (25, 'Zn','s25','Sinkki','Sinkki','Sinkki','200','kg','Mg','HM','FALSE','FALSE'),
    (26, 'N2O','s26','Typpioksiduuli','Typpioksiduuli','Typpioksiduuli','10','t','Gg','GHG','FALSE','FALSE'),
    (27, 'TSP','s27','HIUKKASET','HIUKKASET','HIUKKASET','0','t','Gg',NULL,'TRUE','FALSE'),
    (28, 'PM 2.5','s28','PIENHIUKKASET 2.5','PIENHIUKKASET 2.5','PIENHIUKKASET 2.5','0','t','Gg',NULL,'TRUE','FALSE'),
    (29, 'PM 10','s29','PIENHIUKKASET 10','PIENHIUKKASET 10','PIENHIUKKASET 10','50','t','Gg',NULL,'TRUE','FALSE'),
    (30, 'CO2 (BIO)','s30','Hiilidioksidi, bio','Hiilidioksidi, bio','Hiilidioksidi, bio','0','t','Gg','BIO','FALSE','FALSE'),
    (31, 'V','s31','Vanadiini','Vanadiini','Vanadiini','0','kg','Mg','HM','FALSE','FALSE'),
    (32, 'Styreeni','s32','Styreeni','Styreeni','Styreeni',NULL,'kg','kg',NULL,'FALSE','FALSE'),
    (34, 'Nitraattityppi','s34','Nitraattityppi','Nitraattityppi','Nitraattityppi',NULL,'kg','0',NULL,'FALSE','FALSE'),
    (36, 'cobalt','s36','Koboltti','Koboltti','Koboltti',NULL,'kg','Mg',NULL,'FALSE','FALSE'),
    (38, 'HCB','s38','Heksaklooribentseeni','Heksaklooribentseeni','Heksaklooribentseeni',NULL,'kg','kg','POP','TRUE','FALSE'),
    (40, 'PCB','s40','Polykloorattu bifenyyli','Polykloorattu bifenyyli','Polykloorattu bifenyyli',NULL,'g','kg','POP','TRUE','FALSE'),
    (41, 'Mg','s41','Mangaani','Mangaani','Mangaani',NULL,'kg','Mg',NULL,'FALSE','FALSE'),
    (42, 'HCH','s42','Lindaani','Lindaani','Lindaani',NULL,'g','kg','POP','FALSE','FALSE'),
    (43, 'BC','s43','Mustahiili','Mustahiili','Mustahiili',NULL,'t','Gg',NULL,'TRUE','FALSE'),
    (44, 'PM 1','s44','PIENHIUKKASET 1','PIENHIUKKASET 1','PIENHIUKKASET 1',NULL,'t','Gg',NULL,'FALSE','FALSE'),
    (46, 'BaP','s46','Benzo(a)pyreeni','Benzo(a)pyreeni','Benzo(a)pyreeni',NULL,'g','Mg','POP','FALSE','FALSE'),
    (47, 'BbFA','s47','Bentso(b)fluoranteeni','Bentso(b)fluoranteeni','Bentso(b)fluoranteeni',NULL,'g','Mg','POP','FALSE','FALSE'),
    (48, 'BkF','s48','Bentso(k)fluoranteeni','Bentso(k)fluoranteeni','Bentso(k)fluoranteeni',NULL,'g','Mg','POP','FALSE','FALSE'),
    (49, 'I123cdP','s49','Indeno(1,2,3-cd)pyreeni','Indeno(1,2,3-cd)pyreeni','Indeno(1,2,3-cd)pyreeni',NULL,'g','Mg','POP','FALSE','FALSE'),
    (50, 'PCDD','s50','Polyklooratut dibentso-p-dioksiinit','Polyklooratut dibentso-p-dioksiinit','Polyklooratut dibentso-p-dioksiinit',NULL,'g','g I-Teq','POP','FALSE','FALSE'),
    (51, 'PCDF','s51','Polyklooratut dibentsofuraanit','Polyklooratut dibentsofuraanit','Polyklooratut dibentsofuraanit',NULL,'g','g I-Teq','POP','FALSE','FALSE'),
    (33, 'TRS','s33','Pelkistyneet rikkiyhdisteet SO2:na','Pelkistyneet rikkiyhdisteet SO2:na','Pelkistyneet rikkiyhdisteet SO2:na',NULL,'t','Gg',NULL,'FALSE','FALSE'),
    (35, 'Fluoridi','s35','Fluoridi','Fluoridi','Fluoridi',NULL,'kg','0',NULL,'FALSE','FALSE'),
    (37, 'Se','s37','seleeni','seleeni','seleeni',NULL,'kg','Mg','HM','FALSE','FALSE'),
    (39, 'PCP','s39','Pentakloorifenoli','Pentakloorifenoli','Pentakloorifenoli',NULL,'kg','kg','POP','FALSE','FALSE');

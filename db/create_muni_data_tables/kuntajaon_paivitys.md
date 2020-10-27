### Kuntageometrioiden päivitys

1. Kuntajako-karttatasosta tarvitaan sekä 100k että 45milj versiot. Ensimmäisestä saadaan tarkemmat pinta-alat päästömäärien normalisointia varten (kg / km2) ja jälkkimmäisestä sopivan mittakaavaiset geometriat web-kartalle. Aineistot löytyivät edellisellä päivityskerralla geokäyttöliittymän kautta ja sijaitsivat tietokannassa: INSPIRE1.GEO (taulut: INSPIRE1.GEO.SVW_GEO_Hall4_5miljKunta & INSPIRE1.GEO.SVW_GEO_HALL100KUNTA). Aineistoissa ei tule olla kuntien merialueita.
2. Hall4_5miljKunta -taso avataan QGIS:ssä. Varmistetaan että se on koordinaatistossa EPSG:3067 ja avataan database manager ("DB Manager").
3. Viedään Hall4_5miljKunta-aineisto kantaan - asetetaan kenttien nimiin lowercase valinta ("[x] Convert field names to lower case"), sekä vaihdetaan taulun nimi pieniin kirjaimiin.
4. Seuraavaksi viedään Hall00Kunta-aineisto kantaan - asetetaan kenttien nimiin lowercase valinta (kuten edellä), sekä vaihdetaan taulun nimi pieniin kirjaimiin.
5. Seuraavaksi suoritetaan kohdat 4, 5 ja 6 ohjeesta [update_muni_data_table_from_csv.md](./update_muni_data_table_from_csv.md) samalla tarkistaen että ajettavissa SQL lauseissa viitataan uusimpiin kuntajako-tauluihin ja että niiden kenttien nimet ovat oikein.

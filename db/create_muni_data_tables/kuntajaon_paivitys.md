### Kuntageometrioiden päivitys

1. Kuntajako-karttatasosta tarvitaan sekä 100k että 45milj versiot. Ensimmäisestä saadaan tarkemmat pinta-alat päästömäärien normalisointia varten (kg / km2) ja jälkkimmäisestä sopivan mittakaavaiset geometriat web-kartalle. Aineistot löytyivät edellisellä päivityskerralla geokäyttöliittymän kautta ja sijaitsivat tietokannassa: INSPIRE1.GEO (taulut: INSPIRE1.GEO.SVW_GEO_Hall4_5miljKunta & INSPIRE1.GEO.SVW_GEO_HALL100KUNTA). Aineistoissa ei tule olla kuntien merialueita.
2. 4_5miljKunta -taso avataan esim. QGIS:ssä ja tallennetaan GeoJSON muotoon - tässä projektioksi (CRS) valitaan EPSG:3857 ja koordinaattien desimaalien määräksi 0. Näin aineisto saadaan web-kartan kannalta sopivaan projektioon.
3. Avataan tallennettu GeoJSON QGIS:iin ja avataan database manager ("DB Manager").
4. Viedään Hall4_5miljKunta-aineisto (avattu GeoJSON layer) kantaan - asetetaan kenttien nimiin lowercase valinta ("[x] Convert field names to lower case"), sekä vaihdetaan taulun nimi niin ikään pieniin kirjaimiin.
5. Seuraavaksi viedään Hall00Kunta-aineisto kantaan (esim. QGIS:n DB Managerilla suoraan shapefile-tiedostosta) - asetetaan kenttien nimiin lowercase valinta, sekä vaihdetaan taulun nimi pieniin kirjaimiin.
6. Seuraavaksi suoritetaan kohdat 4 & 5 ohjeesta [update_muni_data_table_from_csv.md](./update_muni_data_table_from_csv.md) samalla tarkistaen että ajettavissa SQL lauseissa viitataan uusimpiin kuntajako-tauluihin.

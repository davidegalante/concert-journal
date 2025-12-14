import { Concert } from './types';

export const INITIAL_DATA_RAW = [
  { "band": "Simple Plan", "date": "14-giu-2017", "city": "Padova, Gran Teatro Geox", "event": "Concerto", "artists": 1, "cost": 30.0, "year": 2017 },
  { "band": "David Guetta", "date": "28-lug-2017", "city": "Padova, Arena Live", "event": "Concerto", "artists": 1, "cost": 35.0, "year": 2017 },
  { "band": "Rancore", "date": "13-set-2018", "city": "San Polo D'enza", "event": "Concerto", "artists": 1, "cost": 5.0, "year": 2018 },
  { "band": "Nitro", "date": "25-set-2018", "city": "Parma, Campus Industry", "event": "Concerto", "artists": 1, "cost": 27.0, "year": 2018 },
  { "band": "Vegas Jones, Gaime, Nitro, Nayt, Gemitaiz, Madman, Emis Killa, Jake la Furia", "date": "17-feb-2019", "city": "Milano, Fabrique", "event": "Concerto", "artists": 8, "cost": 35.99, "year": 2019 },
  { "band": "Rancore", "date": "9-mar-2019", "city": "Bologna, Estragon", "event": "Concerto", "artists": 1, "cost": 40.0, "year": 2019 },
  { "band": "Pinguini Tattici Nucleari, Rovere", "date": "4-apr-2019", "city": "Bologna, Estragon", "event": "Concerto", "artists": 2, "cost": 51.24, "year": 2019 },
  { "band": "Salmo, Linea77", "date": "28-giu-2019", "city": "Bologna, Sonic Park", "event": "Concerto", "artists": 2, "cost": 48.59, "year": 2019 },
  { "band": "Shiva", "date": "7-dic-2019", "city": "Reggio Emilia, Italghisa", "event": "serata", "artists": 1, "cost": 25.0, "year": 2019 },
  { "band": "Lazza", "date": "22-feb-2020", "city": "Reggio Emilia, Italghisa", "event": "serata", "artists": 1, "cost": 25.0, "year": 2020 },
  { "band": "Paky", "date": "2-apr-2022", "city": "Parma, Campus Industry", "event": "serata", "artists": 1, "cost": 10.0, "year": 2022 },
  { "band": "Psicologi", "date": "25-apr-2022", "city": "Parma, Parco Ducale", "event": "Festa della repubblica", "artists": 1, "cost": 0.0, "year": 2022 },
  { "band": "Bnkr44", "date": "25-apr-2022", "city": "Parma, Parco Ducale", "event": "Festa della repubblica", "artists": 1, "cost": 0.0, "year": 2022 },
  { "band": "La Sad", "date": "30-apr-2022", "city": "Bologna, Locomotiv Club", "event": "Prima volta dalla sad", "artists": 1, "cost": 20.5, "year": 2022 },
  { "band": "Il Tre", "date": "3-mag-2022", "city": "Modena, Vox Club", "event": "Concerto", "artists": 1, "cost": 59.01, "year": 2022 },
  { "band": "Fiorella Mannoia, Emma, Alessandra Amoroso, Giorgia, Elisa, Gianna Nannini, Laura Pausini, Caparezza, Brunori Sas, Diodato, Sottotono, Tommaso Paradiso, Coez, Eros Ramazzotti", "date": "11-giu-2022", "city": "Reggio Emilia, RCF Arena (Campovolo)", "event": "Una Nessuna Centomila", "artists": 14, "cost": 57.99, "year": 2022 },
  { "band": "Particles", "date": "24-giu-2022", "city": "Parma, Splinter Club", "event": "PPMP - Pop Punk Mosh Party", "artists": 1, "cost": 10.0, "year": 2022 },
  { "band": "Giorgio Vanni", "date": "26-giu-2022", "city": "Bologna, DumBO", "event": "Bologna Nerd", "artists": 1, "cost": 20.0, "year": 2022 },
  { "band": "Pinguini Tattici Nucleari", "date": "9-lug-2022", "city": "Parma, Parco Ducale", "event": "Concerto", "artists": 1, "cost": 51.63, "year": 2022 },
  { "band": "Carl Brave, Noemi, Gemitaiz, Mara Sattei, Max Gazzè, Pretty Solero", "date": "15-lug-2022", "city": "Roma, Ippodromo delle Capannelle", "event": "Rock In Roma", "artists": 6, "cost": 44.0, "year": 2022 },
  { "band": "Rosa Chemical", "date": "16-lug-2022", "city": "Parma, Parco Ducale", "event": "serata", "artists": 1, "cost": 10.0, "year": 2022 },
  { "band": "Bresh, Matteo Romano", "date": "3-set-2022", "city": "Langhirano, Piazzale Celso Melli", "event": "Festa Del Prosciutto", "artists": 2, "cost": 31.0, "year": 2022 },
  { "band": "La Sad", "date": "4-set-2022", "city": "Bologna, Estragon", "event": "Concerto", "artists": 1, "cost": 25.0, "year": 2022 },
  { "band": "La Sad", "date": "9-set-2022", "city": "Piacenza", "event": "Concerto", "artists": 1, "cost": 25.0, "year": 2022 },
  { "band": "Machine Gun Kelly, Iann Dior, 44Phantom", "date": "27-set-2022", "city": "Milano, Mediolanum Forum", "event": "Concerto", "artists": 3, "cost": 279.28, "year": 2022 },
  { "band": "Sfera Ebbasta", "date": "4-ott-2022", "city": "Bologna, Unipol Arena", "event": "Concerto", "artists": 1, "cost": 58.47, "year": 2022 },
  { "band": "Simple Plan, Sum41", "date": "8-ott-2022", "city": "Bologna, Unipol Arena", "event": "Concerto", "artists": 2, "cost": 53.5, "year": 2022 },
  { "band": "Verdena", "date": "30-ott-2022", "city": "Bologna, Estragon", "event": "Concerto", "artists": 1, "cost": 28.18, "year": 2022 },
  { "band": "Mida, Neima Ezza", "date": "20-nov-2022", "city": "Parma, Italghisa", "event": "serata", "artists": 2, "cost": 10.0, "year": 2022 },
  { "band": "Rocco Hunt", "date": "27-nov-2022", "city": "Milano, Fiera Milano Rho", "event": "Milan Games Week", "artists": 1, "cost": 26.0, "year": 2022 },
  { "band": "Emis Killa", "date": "2-dic-2022", "city": "Parma, Campus Industry", "event": "Concerto", "artists": 1, "cost": 45.45, "year": 2022 },
  { "band": "Rancore", "date": "15-dic-2022", "city": "Parma, Campus Industry", "event": "Concerto", "artists": 1, "cost": 29.99, "year": 2022 },
  { "band": "La Sad", "date": "28-gen-2023", "city": "Modena, Vox Club", "event": "Concerto", "artists": 1, "cost": 29.18, "year": 2023 },
  { "band": "Millefiori, Wikw, Wehavehalflives", "date": "8-apr-2023", "city": "Parma, Splinter Club", "event": "PPMP - Pop Punk Mosh Party", "artists": 3, "cost": 10.0, "year": 2023 },
  { "band": "Il Pagante", "date": "1-mag-2023", "city": "Milano", "event": "serata", "artists": 1, "cost": 5.0, "year": 2023 },
  { "band": "Lazza, Rondo, Emis Killa, Tedua, Giaime", "date": "30-apr-2023", "city": "Milano, Mediolanum Forum", "event": "Concerto", "artists": 5, "cost": 48.8, "year": 2023 },
  { "band": "Simple Plan, Offspring", "date": "3-giu-2023", "city": "Rimini, Beky Bay", "event": "Slamdunk", "artists": 2, "cost": 74.49, "year": 2023 },
  { "band": "La Sad, Mod Sun, Beauty School Dropout, Lil Lotus, Jackout, Nxfeit, Zand, Holy Francesco", "date": "25-giu-2023", "city": "Milano, Circolo Magnolia", "event": "Summersad Fest", "artists": 8, "cost": 40.67, "year": 2023 },
  { "band": "Travis Scott, Anna, Capo Plaza", "date": "30-giu-2023", "city": "Milano, Ippodromo La Maura", "event": "IDays", "artists": 3, "cost": 80.5, "year": 2023 },
  { "band": "Sfera Ebbasta", "date": "10-lug-2023", "city": "Parma, Parco Ducale", "event": "Concerto", "artists": 1, "cost": 55.85, "year": 2023 },
  { "band": "La Sad", "date": "14-lug-2023", "city": "San Polo d'Enza, Bilbao", "event": "generico", "artists": 1, "cost": 17.0, "year": 2023 },
  { "band": "Bambole di Pezza", "date": "23-ago-2023", "city": "Reggio Emilia, Festa del PD", "event": "generico", "artists": 1, "cost": 0.0, "year": 2023 },
  { "band": "La Sad, Naska, Yungblud", "date": "26-ago-2023", "city": "Bassano del Grappa, Villa Ca' Cornaro", "event": "Ama Festival", "artists": 3, "cost": 46.0, "year": 2023 },
  { "band": "Naska", "date": "10-set-2023", "city": "San Polo d'Enza, Bilbao", "event": "Concerto", "artists": 1, "cost": 27.04, "year": 2023 },
  { "band": "Lacuna Coil", "date": "30-set-2023", "city": "Parma, Campus Industry", "event": "Temporock", "artists": 1, "cost": 10.0, "year": 2023 },
  { "band": "Blink 182, The Story So Far", "date": "6-ott-2023", "city": "Bologna, Unipol Arena", "event": "Concerto", "artists": 2, "cost": 88.12, "year": 2023 },
  { "band": "Madman", "date": "9-ott-2023", "city": "Fidenza, San Donnino", "event": "djset", "artists": 1, "cost": 6.0, "year": 2023 },
  { "band": "Sillyelly", "date": "21-ott-2023", "city": "Parma, Splinter Club", "event": "Suner, serata", "artists": 1, "cost": 10.0, "year": 2023 },
  { "band": "Millefiori, Wikw", "date": "4-nov-2023", "city": "Parma, Splinter Club", "event": "PPMP - Pop Punk Mosh Party", "artists": 2, "cost": 10.0, "year": 2023 },
  { "band": "Sfera Ebbasta", "date": "13-nov-2023", "city": "Milano, Allianz Cloud", "event": "Release Party X2vr", "artists": 1, "cost": 0.0, "year": 2023 },
  { "band": "Xdiemondx, Ego, Still Charles, Schiuma", "date": "15-nov-2023", "city": "Milano, Legend Club", "event": "Wendy Nightmare", "artists": 4, "cost": 11.99, "year": 2023 },
  { "band": "Sick Tamburo", "date": "1-dic-2023", "city": "Sissa Trecasali, Teatro Comunale", "event": "Concerto", "artists": 1, "cost": 5.0, "year": 2023 },
  { "band": "Raw Power, Ffd", "date": "27-dic-2023", "city": "Parma, Splinter Club", "event": "serata", "artists": 2, "cost": 10.0, "year": 2023 },
  { "band": "Simple Plan", "date": "25-gen-2024", "city": "Milano, Fabrique", "event": "Concerto", "artists": 1, "cost": 40.29, "year": 2024 },
  { "band": "Yans, Fulgur, Kunai, Sconforto", "date": "10-feb-2024", "city": "Parma, Splinter Club", "event": "PPMP - Pop Punk Mosh Party", "artists": 4, "cost": 10.0, "year": 2024 },
  { "band": "Nothing but Thieves, Bad Bad Nerves", "date": "26-feb-2024", "city": "Milano, Fabrique", "event": "Concerto", "artists": 2, "cost": 0.0, "year": 2024 },
  { "band": "Jackout, Mukunda", "date": "9-mar-2024", "city": "Parma, Splinter Club", "event": "PPMP - Pop Punk Mosh Party", "artists": 2, "cost": 10.0, "year": 2024 },
  { "band": "Sunset Radio, Jackout, Sillysam, WEL", "date": "16-mar-2024", "city": "Ravenna, Bronson", "event": "punkz", "artists": 4, "cost": 16.5, "year": 2024 },
  { "band": "Xdiemondx, Bludy Mary", "date": "22-mar-2024", "city": "Milano, Legend Club", "event": "emonight", "artists": 2, "cost": 0.0, "year": 2024 },
  { "band": "Fracture Zero, Dedalus Project, Sailing Before the Wind", "date": "12-apr-2024", "city": "Parma, Splinter Club", "event": "Blaster", "artists": 3, "cost": 10.0, "year": 2024 },
  { "band": "Asweare", "date": "13-apr-2024", "city": "Parma, Splinter Club", "event": "PPMP - Pop Punk Mosh Party", "artists": 1, "cost": 10.0, "year": 2024 },
  { "band": "Tre Allegri Ragazzi Morti", "date": "30-apr-2024", "city": "Parma, Parco della Musica", "event": "generico", "artists": 1, "cost": 13.0, "year": 2024 },
  { "band": "Naska", "date": "9-mag-2024", "city": "Milano, Fabrique", "event": "release party (berlino)", "artists": 1, "cost": 0.0, "year": 2024 },
  { "band": "Xdiemondx, Sillysam, Lacrima", "date": "10-mag-2024", "city": "Milano, Legend Club", "event": "emonight", "artists": 3, "cost": 0.0, "year": 2024 },
  { "band": "Namida, Sillysam", "date": "11-mag-2024", "city": "Parma, Splinter Club", "event": "PPMP - Pop Punk Mosh Party", "artists": 2, "cost": 10.0, "year": 2024 },
  { "band": "Punkreas, Persiana Jones, Uncle Bard and Dirty Bastard", "date": "25-mag-2024", "city": "Sabbioneta, Spalto Bresciani", "event": "mad one", "artists": 3, "cost": 0.0, "year": 2024 },
  { "band": "Green Day, Nothing but Thieves", "date": "16-giu-2024", "city": "Milano, Ippodromo La Maura", "event": "IDays", "artists": 2, "cost": 85.9, "year": 2024 },
  { "band": "La Sad", "date": "19-giu-2024", "city": "Roma, Rock in Roma", "event": "Concerto", "artists": 1, "cost": 37.35, "year": 2024 },
  { "band": "Xdiemondx, In6n, Zame, Mr. Ugo, Millefiori, Suicide Gvng, Decrow, Uale, Xdemon, Thatskarma", "date": "29-giu-2024", "city": "Roma, Cinecittà World", "event": "punk in park", "artists": 9, "cost": 15.0, "year": 2024 },
  { "band": "Punkreas, The TroubleMakers", "date": "4-lug-2024", "city": "Viarolo (PR)", "event": "Concerto", "artists": 2, "cost": 0.0, "year": 2024 },
  { "band": "Bring Me the Horizon, Yungblud, Imminence", "date": "7-lug-2024", "city": "Milano, Ippodromo San Siro", "event": "IDays", "artists": 3, "cost": 85.9, "year": 2024 },
  { "band": "Avril Lavigne, Sum41, Simple Plan", "date": "9-lug-2024", "city": "Milano, Ippodromo San Siro", "event": "IDays", "artists": 3, "cost": 85.9, "year": 2024 },
  { "band": "La Sad", "date": "12-lug-2024", "city": "Brescia, Campo Marte", "event": "Concerto", "artists": 1, "cost": 21.8, "year": 2024 },
  { "band": "Escape The Fate, Stitched Up Heart", "date": "13-lug-2024", "city": "Cervia, Rock Planet", "event": "Not A Phase", "artists": 2, "cost": 2.0, "year": 2024 },
  { "band": "Sick Tamburo, The TroubleMakers", "date": "18-lug-2024", "city": "Praticello", "event": "Praticio Rock", "artists": 2, "cost": 0.0, "year": 2024 },
  { "band": "La Sad, Bnkr44, Sunset Radio, JackOut, Ego, Holy Francesco", "date": "26-lug-2024", "city": "Rimini, Beky Bay", "event": "SummerSad Fest", "artists": 6, "cost": 31.82, "year": 2024 },
  { "band": "Finley, Rosa Chemical, Naska, Punkreas, Dari, Mondo Marcio", "date": "16-ott-2024", "city": "Milano, Unipol Forum", "event": "Concerto", "artists": 6, "cost": 42.95, "year": 2024 },
  { "band": "Meganoidi, Known Physics", "date": "20-ott-2024", "city": "Trecasali, Arci Stella", "event": "Concerto", "artists": 2, "cost": 10.0, "year": 2024 },
  { "band": "Falling In Reverse, Hollywood Undead, Sleep Theory", "date": "14-nov-2024", "city": "Milano, Fabrique", "event": "Popular Monster Tour", "artists": 3, "cost": 55.37, "year": 2024 },
  { "band": "Giorgio Vanni", "date": "29-nov-2024", "city": "Reggio Emilia, Centro Commerciale I Petali", "event": "Meet And Greet", "artists": 1, "cost": 0.0, "year": 2024 },
  { "band": "Meganoidi, Known Physics", "date": "29-nov-2024", "city": "Taneto, Fuori Orario", "event": "Concerto", "artists": 2, "cost": 0.0, "year": 2024 },
  { "band": "Sunset Radio", "date": "20-dic-2024", "city": "Parma, Splinter Club", "event": "PPMP - Pop Punk Mosh Party", "artists": 1, "cost": 10.0, "year": 2024 },
  { "band": "La Sad", "date": "7-gen-2025", "city": "Parma, Campus Industry", "event": "Concerto Alcatraz", "artists": 1, "cost": 30.95, "year": 2025 },
  { "band": "Motionless in White", "date": "29-gen-2025", "city": "Milano, Alcatraz", "event": "Concerto Alcatraz", "artists": 1, "cost": 40.5, "year": 2025 },
  { "band": "2acrima, krida", "date": "14-mar-2025", "city": "Parma, Splinter Club", "event": "PPMP - Pop Punk Mosh Party", "artists": 2, "cost": 0.0, "year": 2025 },
  { "band": "Gem Boy, Cristina D'avena", "date": "5-apr-2025", "city": "Taneto, Fuori Orario", "event": "Fuori Orario", "artists": 2, "cost": 20.0, "year": 2025 },
  { "band": "Lucio Corsi", "date": "29-apr-2025", "city": "Milano, Alcatraz", "event": "concerto", "artists": 1, "cost": 25.0, "year": 2025 },
  { "band": "Topo Gigio", "date": "10-mag-2025", "city": "Cremona, Centro Commerciale Cremona Po", "event": "cremona po", "artists": 1, "cost": 0.0, "year": 2025 },
  { "band": "WEL, Fracture Zero", "date": "17-mag-2025", "city": "Parma, Splinter Club", "event": "PPMP - Pop Punk Mosh Party", "artists": 2, "cost": 10.0, "year": 2025 },
  { "band": "Tre Allegri Ragazzi Morti", "date": "26-mag-2025", "city": "Taneto, Fuori Orario", "event": "Fuori Orario", "artists": 1, "cost": 10.0, "year": 2025 },
  { "band": "Big Bang Rock History, Titania", "date": "6-giu-2025", "city": "Milano", "event": "festa paese", "artists": 2, "cost": 0.0, "year": 2025 },
  { "band": "The Rumpled", "date": "8-giu-2025", "city": "Sabbioneta, Spalto Bresciani", "event": "mad one", "artists": 1, "cost": 10.0, "year": 2025 },
  { "band": "Linkin Park, Spirit Box, Jpegmafia", "date": "24-giu-2025", "city": "Milano, Ippodromo La Maura", "event": "IDays", "artists": 3, "cost": 123.05, "year": 2025 },
  { "band": "POE (philosophy of evil), Chocobo Band", "date": "27-set-2025", "city": "San Polo D'enza", "event": "Rievocandum", "artists": 2, "cost": 0.0, "year": 2025 },
  { "band": "Zame, Mr. Ugo", "date": "12-dic-2025", "city": "Milano, Legend Club", "event": "concerto", "artists": 1, "cost": 18.75, "year": 2025 },
  { "band": "All Time Low", "date": "13-feb-2026", "city": "Bergamo, Choruslife Arena", "event": "concerto", "artists": 1, "cost": 58.37, "year": 2026 },
  { "band": "Caparezza", "date": "04-lug-2026", "city": "Mantova, Piazza Sordello", "event": "concerto", "artists": 1, "cost": 60.99, "year": 2026 },
  { "band": "My Chemical Romance", "date": "15-lug-2026", "city": "Firenze, Visarno Arena", "event": "concerto", "artists": 1, "cost": 147.66, "year": 2026 }
];

// Helper to convert Italian date string to ISO date
const monthMap: Record<string, string> = {
  "gen": "01", "feb": "02", "mar": "03", "apr": "04", "mag": "05", "giu": "06",
  "lug": "07", "ago": "08", "set": "09", "ott": "10", "nov": "11", "dic": "12"
};

export const parseItalianDate = (dateStr: string): string => {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const monthStr = parts[1].toLowerCase();
      const year = parts[2];
      const month = monthMap[monthStr];
      if (month) {
        return `${year}-${month}-${day}`;
      }
    }
  } catch (e) {
    console.error("Error parsing date:", dateStr);
  }
  return dateStr; // Return original if fail, though logic handles it
};

// Initial data processing to normalize structure
export const INITIAL_CONCERTS: Concert[] = INITIAL_DATA_RAW.map((c, index) => ({
  id: `init-${index}`,
  ...c,
  date: parseItalianDate(c.date)
}));
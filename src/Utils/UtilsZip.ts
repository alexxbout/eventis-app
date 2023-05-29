
class UtilsZip {

  getNearbyZips(zip: string | number): string[] {
    return nearbyZips[zip];
  }

  getDepartement(zip: string | number): string {
    return departements[zip];
  }
}

const departements: { [key: string]: string } = {
  "01": "Ain",
  "02": "Aisne",
  "03": "Allier",
  "04": "Alpes-de-Haute-Provence",
  "05": "Hautes-Alpes",
  "06": "Alpes-Maritimes",
  "07": "Ardèche",
  "08": "Ardennes",
  "09": "Ariège",
  "10": "Aube",
  "11": "Aude",
  "12": "Aveyron",
  "13": "Bouches-du-Rhône",
  "14": "Calvados",
  "15": "Cantal",
  "16": "Charente",
  "17": "Charente-Maritime",
  "18": "Cher",
  "19": "Corrèze",
  "21": "Côte-d'Or",
  "22": "Côtes-d'Armor",
  "23": "Creuse",
  "24": "Dordogne",
  "25": "Doubs",
  "26": "Drôme",
  "27": "Eure",
  "28": "Eure-et-Loir",
  "29": "Finistère",
  "30": "Gard",
  "31": "Haute-Garonne",
  "32": "Gers",
  "33": "Gironde",
  "34": "Hérault",
  "35": "Ille-et-Vilaine",
  "36": "Indre",
  "37": "Indre-et-Loire",
  "38": "Isère",
  "39": "Jura",
  "40": "Landes",
  "41": "Loir-et-Cher",
  "42": "Loire",
  "43": "Haute-Loire",
  "44": "Loire-Atlantique",
  "45": "Loiret",
  "46": "Lot",
  "47": "Lot-et-Garonne",
  "48": "Lozère",
  "49": "Maine-et-Loire",
  "50": "Manche",
  "51": "Marne",
  "52": "Haute-Marne",
  "53": "Mayenne",
  "54": "Meurthe-et-Moselle",
  "55": "Meuse",
  "56": "Morbihan",
  "57": "Moselle",
  "58": "Nièvre",
  "59": "Nord",
  "60": "Oise",
  "61": "Orne",
  "62": "Pas-de-Calais",
  "63": "Puy-de-Dôme",
  "64": "Pyrénées-Atlantiques",
  "65": "Hautes-Pyrénées",
  "66": "Pyrénées-Orientales",
  "67": "Bas-Rhin",
  "68": "Haut-Rhin",
  "69": "Rhône",
  "70": "Haute-Saône",
  "71": "Saône-et-Loire",
  "72": "Sarthe",
  "73": "Savoie",
  "74": "Haute-Savoie",
  "75": "Paris",
  "76": "Seine-Maritime",
  "77": "Seine-et-Marne",
  "78": "Yvelines",
  "79": "Deux-Sèvres",
  "80": "Somme",
  "81": "Tarn",
  "82": "Tarn-et-Garonne",
  "83": "Var",
  "84": "Vaucluse",
  "85": "Vendée",
  "86": "Vienne",
  "87": "Haute-Vienne",
  "88": "Vosges",
  "89": "Yonne",
  "90": "Territoire de Belfort",
  "91": "Essonne",
  "92": "Hauts-de-Seine",
  "93": "Seine-Saint-Denis",
  "94": "Val-de-Marne",
  "95": "Val-d'Oise"
}

const nearbyZips: { [key: string]: string[] } = {
  "01": ["69", "38", "71", "39", "74"],
  "02": ["59", "60", "80", "08", "51", "77"],
  "03": ["58", "18", "42", "63", "71", "58"],
  "04": ["05", "06", "83", "84", "05", "26", "38", "05", "26", "83", "04", "83", "06", "04"],
  "05": ["04", "38", "73", "05", "38"],
  "06": ["04", "83", "04"],
  "07": ["26", "42", "26", "30", "48", "26"],
  "08": ["51", "55", "80", "02", "51"],
  "09": ["11", "31", "66", "09"],
  "10": ["51", "89", "52", "10"],
  "11": ["09", "66", "31", "34", "11"],
  "12": ["15", "48", "30", "34", "46", "82", "81", "15", "30", "48", "81", "82", "48"],
  "13": ["83", "84", "13"],
  "14": ["50", "61", "27", "76"],
  "15": ["43", "63", "48", "12", "19", "43", "46"],
  "16": ["17", "86", "24", "79", "87"],
  "17": ["16", "33", "79", "85"],
  "18": ["58", "45", "03", "36", "41", "58"],
  "19": ["23", "87", "15", "46", "23", "24"],
  "21": ["52", "70", "39", "58", "71", "21", "39"],
  "22": ["29", "56", "35"],
  "23": ["19", "87", "36", "23"],
  "24": ["87", "46", "47", "33", "16", "79"],
  "25": ["70", "90", "39", "68", "25", "70", "90"],
  "26": ["38", "07", "05", "30", "07", "83", "84", "38", "42"],
  "27": ["76", "28", "60", "14", "76"],
  "28": ["27", "61", "41", "45", "78", "28", "41"],
  "29": ["56", "22", "35"],
  "30": ["48", "12", "07", "34", "11", "48"],
  "31": ["09", "81", "82", "11", "32", "65", "31"],
  "32": ["65", "47", "82", "31", "32", "47"],
  "33": ["17", "40", "47", "24", "33", "40"],
  "34": ["48", "11", "30", "81", "66", "48"],
  "35": ["53", "22", "56", "44"],
  "36": ["18", "86", "37", "23", "36"],
  "37": ["41", "49", "72", "86", "41", "37"],
  "38": ["05", "73", "01", "69", "42", "07", "38", "73", "01"],
  "39": ["01", "21", "71", "25", "70", "39"],
  "40": ["64", "47", "32", "33"],
  "41": ["72", "28", "37", "41", "36", "45"],
  "42": ["43", "63", "43", "07", "38", "69", "43", "15"],
  "43": ["42", "15", "63", "42"],
  "44": ["49", "85", "56", "35"],
  "45": ["41", "36", "18", "89", "77", "45", "77"],
  "46": ["19", "24", "47", "82", "15", "82"],
  "47": ["32", "33", "24", "82", "46"],
  "48": ["12", "30", "15", "07"],
  "49": ["72", "53", "72", "85", "79", "44"],
  "50": ["14", "61", "53", "50"],
  "51": ["02", "08", "55", "10", "77", "52", "77", "08"],
  "52": ["55", "08", "10", "51", "70", "21", "25"],
  "53": ["72", "61", "72", "49", "44", "35"],
  "54": ["55", "57", "67", "88"],
  "55": ["57", "88", "54", "57", "88", "08", "51", "54"],
  "56": ["35", "29", "22"],
  "57": ["54", "67", "68", "55", "54", "67", "68", "88"],
  "58": ["71", "89", "45", "18", "21", "71", "03"],
  "59": ["62", "02", "80"],
  "60": ["76", "02", "80", "27"],
  "61": ["50", "14", "72", "53", "28"],
  "62": ["59", "80"],
  "63": ["03", "43", "15", "03"],
  "64": ["40", "33", "47"],
  "65": ["32", "31", "64", "32", "31"],
  "66": ["11", "09", "34"],
  "67": ["68", "88", "54", "57", "68", "88"],
  "68": ["67", "88", "57", "68", "54"],
  "69": ["71", "01", "42", "38", "01", "26", "42", "01"],
  "70": ["90", "25", "52", "21", "88"],
  "71": ["39", "21", "58", "69", "01", "21", "58"],
  "72": ["61", "37", "41", "53", "28", "49", "61"],
  "73": ["38", "74", "01", "07", "73", "74", "38"],
  "74": ["73", "01", "73"],
  "75": ["92", "93", "94"],
  "76": ["80", "27", "60", "14", "50", "76"],
  "77": ["89", "45", "89", "10", "51", "93", "94", "91"],
  "78": ["92", "28", "95", "27", "91", "78", "92"],
  "79": ["86", "49", "17", "85", "86", "17"],
  "80": ["02", "62", "59", "76"],
  "81": ["82", "12", "31", "82", "32", "34"],
  "82": ["46", "47", "81", "31", "12", "32", "47"],
  "83": ["04", "06", "13", "84"],
  "84": ["13", "04", "05", "26", "30", "04", "13"],
  "85": ["79", "44", "49", "17"],
  "86": ["36", "37", "79", "87", "16", "37"],
  "87": ["23", "36", "19", "23", "16", "36"],
  "88": ["70", "54", "55", "57", "68", "67", "70", "55", "54", "57", "68"],
  "89": ["10", "45", "77", "21", "71"],
  "90": ["25", "70", "68", "25", "70"],
  "91": ["77", "78", "92", "94", "77"],
  "92": ["75", "78", "95", "93", "94", "91"],
  "93": ["75", "92", "77", "94", "93", "91"],
  "94": ["75", "92", "91", "93", "77"],
  "95": ["78", "27"]
}

export default new UtilsZip();
import pandas as pd
import json

def process_file(file_path, kind):
    df = pd.read_excel(file_path, skiprows=5)
    df.dropna(how='all', inplace=True)
    
    result = []
    
    for index, row in df.iterrows():
        kurumKodu = None
        
        if kind == "osb":
            kurumAdi = str(row['Unnamed: 2']).strip() if pd.notnull(row['Unnamed: 2']) else ""
            il = str(row['Unnamed: 1']).strip() if pd.notnull(row['Unnamed: 1']) else ""
            ilce = ""
            webSitesi = str(row['Unnamed: 3']).strip() if pd.notnull(row['Unnamed: 3']) else ""
            eposta = str(row['Unnamed: 4']).strip() if pd.notnull(row['Unnamed: 4']) else ""
            telefon = ""
            okulTuru = "Organize Sanayi Bölgesi"
            
        elif kind == "ttso":
            kurumAdi = str(row['Unnamed: 3']).strip() if pd.notnull(row['Unnamed: 3']) else ""
            il = str(row['Unnamed: 1']).strip() if pd.notnull(row['Unnamed: 1']) else ""
            ilce = str(row['Unnamed: 2']).strip() if pd.notnull(row['Unnamed: 2']) else ""
            webSitesi = str(row['Unnamed: 4']).strip() if pd.notnull(row['Unnamed: 4']) else ""
            eposta = str(row['Unnamed: 5']).strip() if pd.notnull(row['Unnamed: 5']) else ""
            telefon = str(row['Unnamed: 6']).strip() if pd.notnull(row['Unnamed: 6']) else ""
            okulTuru = "Ticaret ve Sanayi Odası"
            
        elif kind == "esnaf":
            kurumAdi = str(row['Unnamed: 2']).strip() if pd.notnull(row['Unnamed: 2']) else ""
            il = str(row['Unnamed: 1']).strip() if pd.notnull(row['Unnamed: 1']) else ""
            ilce = ""
            webSitesi = str(row['Unnamed: 3']).strip() if pd.notnull(row['Unnamed: 3']) else ""
            eposta = str(row['Unnamed: 4']).strip() if pd.notnull(row['Unnamed: 4']) else ""
            telefon = str(row['Unnamed: 5']).strip() if pd.notnull(row['Unnamed: 5']) else ""
            okulTuru = "Esnaf ve Sanatkârlar"
            
        if not kurumAdi or kurumAdi.lower() == "nan":
            continue
            
        if webSitesi and webSitesi.lower() == "nan": webSitesi = ""
        if eposta and eposta.lower() == "nan": eposta = ""
        if telefon and telefon.lower() == "nan": telefon = ""
        
        # specific string replacements
        if eposta.lower() == "belirtilmemiş": eposta = ""
            
        result.append({
            "kurumKodu": kurumKodu,
            "kurumAdi": kurumAdi,
            "il": il,
            "ilce": ilce,
            "webSitesi": webSitesi,
            "eposta": eposta,
            "telefon": telefon,
            "okulTuru": okulTuru
        })
        
    return result

osb_data = process_file(r"c:\dev\mobility-nexus\apps\web\lib\pdfs\osb.xlsx", "osb")
ttso_data = process_file(r"c:\dev\mobility-nexus\apps\web\lib\pdfs\ttso.xlsx", "ttso")
esnaf_data = process_file(r"c:\dev\mobility-nexus\apps\web\lib\pdfs\esnaf.xlsx", "esnaf")

with open(r"c:\dev\mobility-nexus\apps\web\lib\data\osb.json", "w", encoding="utf-8") as f:
    json.dump(osb_data, f, ensure_ascii=False, indent=2)

with open(r"c:\dev\mobility-nexus\apps\web\lib\data\ttso.json", "w", encoding="utf-8") as f:
    json.dump(ttso_data, f, ensure_ascii=False, indent=2)

with open(r"c:\dev\mobility-nexus\apps\web\lib\data\esnaf.json", "w", encoding="utf-8") as f:
    json.dump(esnaf_data, f, ensure_ascii=False, indent=2)

print(f"Saved {len(osb_data)} OSB, {len(ttso_data)} TTSO, {len(esnaf_data)} ESNAF.")

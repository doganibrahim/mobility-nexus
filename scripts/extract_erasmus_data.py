import pdfplumber
import pandas as pd
import os
import json

def clean_currency(value_str):
    if not isinstance(value_str, str):
        return value_str
    # Remove dots used for thousands, replace comma with dot
    cleaned = value_str.replace('.', '').replace(',', '.')
    try:
        return float(cleaned)
    except ValueError:
        return value_str

def clean_text(text):
    if not isinstance(text, str):
        return text
    # Replace newlines with spaces and strip
    return " ".join(text.replace('\n', ' ').split())

def is_header(row):
    # Check if the row looks like a header or title
    if not row or not row[0]:
        return True
    first_cell = str(row[0]).strip().lower()
    if first_cell.startswith('t.c.') or first_cell.startswith('sra') or first_cell.startswith('sıra'):
        return True
    return False

def parse_pdf_table(pdf_path, is_ka121=False, list_type="Kabul Listesi"):
    data = []
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            table = page.extract_table()
            if not table:
                continue
                
            for row in table:
                if is_header(row):
                    continue
                    
                # Skip empty rows
                if not any(row):
                    continue
                    
                cleaned_row = [clean_text(cell) for cell in row]
                
                # KA121: Sira No, Proje No, Faaliyet Alani, Kurum Adi, Ili, Hibe
                if is_ka121:
                    if len(cleaned_row) >= 6:
                        data.append({
                            "row_no": int(cleaned_row[0]) if cleaned_row[0].isdigit() else cleaned_row[0],
                            "project_code": cleaned_row[1],
                            "activity_field": cleaned_row[2],
                            "organisation_name": cleaned_row[3],
                            "city": cleaned_row[4],
                            "grant_amount_eur": clean_currency(cleaned_row[5]),
                            "list_type": list_type
                        })
                # KA122: Sira No, Proje No, Kurum Adi, Proje Adi, Ili, Hibe
                else:
                    if len(cleaned_row) >= 6:
                        data.append({
                            "row_no": int(cleaned_row[0]) if cleaned_row[0].isdigit() else cleaned_row[0],
                            "project_code": cleaned_row[1],
                            "organisation_name": cleaned_row[2],
                            "project_title": cleaned_row[3],
                            "city": cleaned_row[4],
                            "grant_amount_eur": clean_currency(cleaned_row[5]),
                            "list_type": list_type
                        })
                        
    return pd.DataFrame(data)

def export_data(df, base_filename, output_dir="output"):
    os.makedirs(output_dir, exist_ok=True)
    
    csv_path = os.path.join(output_dir, f"{base_filename}.csv")
    json_path = os.path.join(output_dir, f"{base_filename}.json")
    
    df.to_csv(csv_path, index=False, encoding='utf-8')
    df.to_json(json_path, orient='records', force_ascii=False, indent=2)
    print(f"Exported {base_filename} to {csv_path} and {json_path}")

def main():
    base_dir = r"c:\dev\mobility-nexus\apps\web\lib\pdfs"
    
    ka121_path = os.path.join(base_dir, "cengizproje_2026_ka121-vet_webilan.pdf")
    ka122_kabul_path = os.path.join(base_dir, "cengizproje_vet_list_k122.pdf")
    ka122_yedek_path = os.path.join(base_dir, "cengizproje_vet_yedek_k122.pdf")
    
    print("Processing KA121 Web Ilan...")
    df_ka121 = parse_pdf_table(ka121_path, is_ka121=True, list_type="Kabul Listesi")
    export_data(df_ka121, "ka121_results")
    
    print("Processing KA122 Kabul Listesi...")
    df_ka122_kabul = parse_pdf_table(ka122_kabul_path, is_ka121=False, list_type="Kabul Listesi")
    
    print("Processing KA122 Yedek Listesi...")
    df_ka122_yedek = parse_pdf_table(ka122_yedek_path, is_ka121=False, list_type="Yedek Listesi")
    
    # Combine KA122 lists
    df_ka122_combined = pd.concat([df_ka122_kabul, df_ka122_yedek], ignore_index=True)
    export_data(df_ka122_combined, "ka122_results")

if __name__ == "__main__":
    main()

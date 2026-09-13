import pandas as pd
import json

def process_file(file_path):
    try:
        # Skip the first 5 rows (metadata)
        df = pd.read_excel(file_path, skiprows=5)
        # Drop rows where all columns are NaN
        df.dropna(how='all', inplace=True)
        return {
            "columns": list(df.columns),
            "rows": len(df),
            "head": df.head(3).to_dict(orient="records")
        }
    except Exception as e:
        return str(e)

data = {
    "osb": process_file(r"c:\dev\mobility-nexus\apps\web\lib\pdfs\osb.xlsx"),
    "ttso": process_file(r"c:\dev\mobility-nexus\apps\web\lib\pdfs\ttso.xlsx"),
    "esnaf": process_file(r"c:\dev\mobility-nexus\apps\web\lib\pdfs\esnaf.xlsx")
}

with open("excel_data_summary.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved to excel_data_summary.json")

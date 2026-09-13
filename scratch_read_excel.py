import pandas as pd
import json

def process_file(file_path):
    try:
        df = pd.read_excel(file_path)
        return {
            "columns": list(df.columns),
            "rows": len(df),
            "head": df.head(5).to_dict(orient="records")
        }
    except Exception as e:
        return str(e)

data = {
    "osb": process_file(r"c:\dev\mobility-nexus\apps\web\lib\pdfs\osb.xlsx"),
    "ttso": process_file(r"c:\dev\mobility-nexus\apps\web\lib\pdfs\ttso.xlsx"),
    "esnaf": process_file(r"c:\dev\mobility-nexus\apps\web\lib\pdfs\esnaf.xlsx")
}

with open("excel_summary.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved to excel_summary.json")

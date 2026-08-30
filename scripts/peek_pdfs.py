import pdfplumber
import pprint
import os

pdf_paths = [
    r"c:\dev\mobility-nexus\apps\web\lib\pdfs\cengizproje_2026_ka121-vet_webilan.pdf",
    r"c:\dev\mobility-nexus\apps\web\lib\pdfs\cengizproje_vet_list_k122.pdf",
    r"c:\dev\mobility-nexus\apps\web\lib\pdfs\cengizproje_vet_yedek_k122.pdf"
]

for path in pdf_paths:
    print(f"--- {os.path.basename(path)} ---")
    try:
        with pdfplumber.open(path) as pdf:
            page = pdf.pages[0]
            table = page.extract_table()
            if table:
                for row in table[:5]:  # Print first 5 rows
                    print(row)
            else:
                print("No table found with default settings.")
    except Exception as e:
        print(f"Error: {e}")
    print("\n")

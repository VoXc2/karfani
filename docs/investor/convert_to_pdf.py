#!/usr/bin/env python3
"""Convert all investor Markdown files to styled PDF with Arabic RTL support."""

import os
import markdown
from weasyprint import HTML

CSS = """
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');

@page {
  size: A4;
  margin: 18mm 15mm;
  @bottom-center {
    content: "كرفاني | Karfani - Confidential";
    font-size: 8pt;
    color: #999;
    font-family: 'IBM Plex Sans Arabic', Arial, sans-serif;
  }
  @bottom-left {
    content: counter(page);
    font-size: 8pt;
    color: #4A5D3A;
    font-family: 'IBM Plex Sans Arabic', Arial, sans-serif;
  }
}

body {
  font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif;
  direction: rtl;
  text-align: right;
  color: #2D2D2D;
  line-height: 1.9;
  font-size: 10.5pt;
  margin: 0;
  padding: 0;
}

h1 {
  color: #4A5D3A;
  font-size: 22pt;
  font-weight: 700;
  border-bottom: 3px solid #4A5D3A;
  padding-bottom: 8px;
  margin-top: 28px;
  margin-bottom: 12px;
}

h2 {
  color: #4A5D3A;
  font-size: 15pt;
  font-weight: 600;
  margin-top: 22px;
  margin-bottom: 8px;
  border-bottom: 1.5px solid #D4A574;
  padding-bottom: 4px;
}

h3 {
  color: #C67B3C;
  font-size: 12pt;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 6px;
}

h4 {
  color: #2D2D2D;
  font-size: 10.5pt;
  font-weight: 600;
  margin-top: 12px;
}

p {
  margin: 6px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 9.5pt;
}

thead th {
  background-color: #4A5D3A;
  color: white;
  padding: 7px 10px;
  text-align: right;
  font-weight: 600;
  font-size: 9pt;
}

tbody td {
  padding: 5px 10px;
  border-bottom: 1px solid #e0ddd8;
  font-size: 9pt;
}

tbody tr:nth-child(even) {
  background-color: #FAF6F0;
}

code {
  background-color: #FAF6F0;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 8.5pt;
  direction: ltr;
  font-family: 'Courier New', monospace;
}

pre {
  background-color: #2D2D2D;
  color: #FAF6F0;
  padding: 14px;
  border-radius: 6px;
  direction: ltr;
  text-align: left;
  font-size: 8.5pt;
  line-height: 1.5;
  overflow-x: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
}

pre code {
  background: none;
  padding: 0;
  color: #FAF6F0;
}

blockquote {
  border-right: 3px solid #C67B3C;
  border-left: none;
  padding: 8px 14px;
  margin: 8px 0;
  color: #555;
  background-color: #FAF6F0;
  border-radius: 0 6px 6px 0;
}

strong {
  color: #4A5D3A;
  font-weight: 600;
}

hr {
  border: none;
  border-top: 1.5px solid #D4A574;
  margin: 20px 0;
}

a {
  color: #C67B3C;
  text-decoration: none;
}

ul, ol {
  padding-right: 18px;
  padding-left: 0;
  margin: 6px 0;
}

li {
  margin-bottom: 3px;
}

/* Special styling for checkmarks */
li:has(> input[type="checkbox"]) {
  list-style: none;
}
"""

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<style>{css}</style>
</head>
<body>
{content}
</body>
</html>"""

FILES = [
    ("PITCH_DECK.md", "01_العرض_التقديمي_Pitch_Deck.pdf"),
    ("EXECUTIVE_SUMMARY.md", "02_الملخص_التنفيذي_Executive_Summary.pdf"),
    ("FINANCIAL_MODEL.md", "03_النموذج_المالي_Financial_Model.pdf"),
    ("MARKET_ANALYSIS.md", "04_تحليل_السوق_Market_Analysis.pdf"),
    ("TECHNICAL_ARCHITECTURE.md", "05_البنية_التقنية_Technical_Architecture.pdf"),
    ("ONE_PAGER.md", "06_صفحة_واحدة_One_Pager.pdf"),
    ("TERM_SHEET_TEMPLATE.md", "07_ورقة_الشروط_Term_Sheet.pdf"),
    ("DUE_DILIGENCE_CHECKLIST.md", "08_قائمة_الفحص_Due_Diligence.pdf"),
]

def convert(md_file, pdf_file):
    """Convert a single markdown file to PDF."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    md_path = os.path.join(base_dir, md_file)
    pdf_path = os.path.join(base_dir, "pdf", pdf_file)

    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Convert markdown to HTML
    html_content = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "nl2br"],
    )

    # Wrap in full HTML
    full_html = HTML_TEMPLATE.format(css=CSS, content=html_content)

    # Generate PDF
    HTML(string=full_html).write_pdf(pdf_path)
    size_kb = os.path.getsize(pdf_path) / 1024
    print(f"  ✓ {pdf_file} ({size_kb:.0f} KB)")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(os.path.join(base_dir, "pdf"), exist_ok=True)

    print("Converting investor documents to PDF...")
    print("=" * 60)

    for md_file, pdf_file in FILES:
        try:
            convert(md_file, pdf_file)
        except Exception as e:
            print(f"  ✗ {md_file}: {e}")

    print("=" * 60)
    print(f"Done! PDFs saved to: {os.path.join(base_dir, 'pdf')}/")

if __name__ == "__main__":
    main()

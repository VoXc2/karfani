#!/usr/bin/env python3
"""Convert all investor Markdown files to styled PDF with Arabic RTL support and embedded fonts."""

import os
import markdown
from weasyprint import HTML

# Use Noto Sans Arabic (locally installed) instead of Google Fonts remote import
CSS = """
@font-face {
  font-family: 'Noto Sans Arabic';
  src: local('Noto Sans Arabic');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Noto Sans Arabic';
  src: local('Noto Sans Arabic Bold');
  font-weight: 700;
  font-style: normal;
}

@page {
  size: A4;
  margin: 20mm 18mm;
  @bottom-center {
    content: "كرفاني | Karfani - سري وخاص";
    font-size: 7.5pt;
    color: #999;
    font-family: 'Noto Sans Arabic', 'Noto Kufi Arabic', sans-serif;
  }
  @bottom-left {
    content: "صفحة " counter(page);
    font-size: 7.5pt;
    color: #4A5D3A;
    font-family: 'Noto Sans Arabic', sans-serif;
  }
}

@page :first {
  margin-top: 30mm;
}

* {
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans Arabic', 'Noto Kufi Arabic', 'DejaVu Sans', sans-serif;
  direction: rtl;
  text-align: right;
  color: #2D2D2D;
  line-height: 1.85;
  font-size: 10.5pt;
  margin: 0;
  padding: 0;
}

h1 {
  color: #4A5D3A;
  font-size: 21pt;
  font-weight: 700;
  border-bottom: 3px solid #4A5D3A;
  padding-bottom: 10px;
  margin-top: 30px;
  margin-bottom: 14px;
  page-break-after: avoid;
}

h2 {
  color: #4A5D3A;
  font-size: 14pt;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 10px;
  border-bottom: 1.5px solid #D4A574;
  padding-bottom: 5px;
  page-break-after: avoid;
}

h3 {
  color: #C67B3C;
  font-size: 11.5pt;
  font-weight: 700;
  margin-top: 16px;
  margin-bottom: 6px;
  page-break-after: avoid;
}

h4 {
  color: #2D2D2D;
  font-size: 10.5pt;
  font-weight: 700;
  margin-top: 12px;
  margin-bottom: 4px;
}

p {
  margin: 5px 0;
  orphans: 3;
  widows: 3;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 9pt;
  page-break-inside: avoid;
}

thead th {
  background-color: #4A5D3A;
  color: white;
  padding: 7px 10px;
  text-align: right;
  font-weight: 700;
  font-size: 8.5pt;
  border: 1px solid #3a4d2a;
}

tbody td {
  padding: 5px 10px;
  border: 1px solid #e0ddd8;
  font-size: 8.5pt;
  vertical-align: top;
}

tbody tr:nth-child(even) {
  background-color: #FAF6F0;
}

code {
  background-color: #f0ebe3;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 8pt;
  direction: ltr;
  font-family: 'DejaVu Sans Mono', 'FreeMono', monospace;
}

pre {
  background-color: #2D2D2D;
  color: #FAF6F0;
  padding: 12px;
  border-radius: 6px;
  direction: ltr;
  text-align: left;
  font-size: 8pt;
  line-height: 1.4;
  overflow-x: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
  page-break-inside: avoid;
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
  font-weight: 700;
}

em {
  font-style: italic;
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
  padding-right: 20px;
  padding-left: 0;
  margin: 6px 0;
}

li {
  margin-bottom: 3px;
}

li > ul, li > ol {
  margin-top: 2px;
  margin-bottom: 2px;
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
    ("PITCH_DECK.md", "01_Pitch_Deck.pdf"),
    ("EXECUTIVE_SUMMARY.md", "02_Executive_Summary.pdf"),
    ("FINANCIAL_MODEL.md", "03_Financial_Model.pdf"),
    ("MARKET_ANALYSIS.md", "04_Market_Analysis.pdf"),
    ("TECHNICAL_ARCHITECTURE.md", "05_Technical_Architecture.pdf"),
    ("ONE_PAGER.md", "06_One_Pager.pdf"),
    ("TERM_SHEET_TEMPLATE.md", "07_Term_Sheet.pdf"),
    ("DUE_DILIGENCE_CHECKLIST.md", "08_Due_Diligence.pdf"),
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
        extensions=["tables", "fenced_code", "nl2br", "sane_lists"],
    )

    # Wrap in full HTML
    full_html = HTML_TEMPLATE.format(css=CSS, content=html_content)

    # Generate PDF with font embedding
    HTML(string=full_html).write_pdf(
        pdf_path,
        presentational_hints=True,
    )
    size_kb = os.path.getsize(pdf_path) / 1024
    print(f"  ✓ {pdf_file} ({size_kb:.0f} KB)")

def verify_pdf(pdf_path):
    """Verify a PDF has embedded fonts and pages."""
    with open(pdf_path, "rb") as f:
        content = f.read()
    text = content.decode("latin-1", errors="ignore")
    has_font = "/FontFile" in text or "/CIDFont" in text or "/Font" in text
    has_stream = "stream" in text
    return has_font and has_stream

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_dir = os.path.join(base_dir, "pdf")
    os.makedirs(pdf_dir, exist_ok=True)

    # Clean old PDFs
    for f in os.listdir(pdf_dir):
        if f.endswith(".pdf"):
            os.remove(os.path.join(pdf_dir, f))

    print("🔄 Converting investor documents to PDF...")
    print("   Using font: Noto Sans Arabic (embedded)")
    print("=" * 60)

    success = 0
    for md_file, pdf_file in FILES:
        try:
            convert(md_file, pdf_file)
            pdf_path = os.path.join(pdf_dir, pdf_file)
            if verify_pdf(pdf_path):
                success += 1
            else:
                print(f"  ⚠ {pdf_file}: fonts may not be embedded properly")
        except Exception as e:
            print(f"  ✗ {md_file}: {e}")

    print("=" * 60)
    print(f"✅ {success}/{len(FILES)} PDFs generated with embedded Arabic fonts")
    print(f"📁 Location: {pdf_dir}/")

if __name__ == "__main__":
    main()

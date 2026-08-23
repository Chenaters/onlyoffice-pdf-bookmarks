from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT = PROJECT_ROOT / "output" / "pdf" / "pdf-bookmarks-demo.pdf"


def footer(canvas, document):
    canvas.saveState()
    canvas.setStrokeColor(HexColor("#D8E2F0"))
    canvas.line(0.75 * inch, 0.58 * inch, 7.75 * inch, 0.58 * inch)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(HexColor("#58708F"))
    canvas.drawString(0.75 * inch, 0.38 * inch, "PDF Bookmarks marketplace demo")
    canvas.drawRightString(7.75 * inch, 0.38 * inch, f"Page {document.page}")
    canvas.restoreState()


def build_demo_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "DemoTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=30,
        leading=35,
        alignment=TA_CENTER,
        textColor=HexColor("#16365F"),
        spaceAfter=20,
    )
    subtitle = ParagraphStyle(
        "DemoSubtitle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=13,
        leading=19,
        alignment=TA_CENTER,
        textColor=HexColor("#58708F"),
    )
    section = ParagraphStyle(
        "DemoSection",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=27,
        textColor=HexColor("#174F9E"),
        spaceAfter=14,
    )
    body = ParagraphStyle(
        "DemoBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=11,
        leading=17,
        textColor=HexColor("#26384F"),
        spaceAfter=12,
    )
    callout = ParagraphStyle(
        "DemoCallout",
        parent=body,
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=18,
        textColor=HexColor("#174F9E"),
        backColor=HexColor("#EDF4FF"),
        borderColor=HexColor("#AFC9EE"),
        borderWidth=1,
        borderPadding=12,
        spaceBefore=12,
        spaceAfter=16,
    )

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.8 * inch,
        bottomMargin=0.85 * inch,
        title="PDF Bookmarks Marketplace Demo",
        author="Chenaters",
    )

    story = [
        Spacer(1, 1.25 * inch),
        Paragraph("PDF Bookmarks", title),
        Paragraph("A clean demonstration document for ONLYOFFICE marketplace screenshots", subtitle),
        Spacer(1, 0.5 * inch),
        Paragraph("Use this document to show named page markers, one-click navigation, and persistence without exposing personal files.", callout),
        Spacer(1, 1.25 * inch),
        Paragraph("Offline - per PDF - original file unchanged", subtitle),
        PageBreak(),
    ]

    sections = [
        ("Quick start", "Open the PDF Bookmarks panel from the Plugins ribbon. Navigate to a page, enter a useful name, and save it. Your bookmark immediately appears in page order."),
        ("Project overview", "Long reports, research papers, textbooks, and manuals are easier to revisit when important pages have memorable names. This page is a good first screenshot bookmark."),
        ("Navigation workflow", "Select any saved bookmark to return to its page. The plugin uses the current ONLYOFFICE PDF navigation API and keeps the reading flow inside the editor."),
        ("Private local storage", "Bookmark data stays in the editor's local storage. No account, API key, analytics endpoint, or network service is required."),
        ("Separate PDF identities", "Each document receives its own bookmark list. A compact first-page fingerprint helps distinguish same-named local PDFs without storing the page image."),
        ("Implementation details", "The plugin is built with HTML, CSS, and JavaScript. It follows ONLYOFFICE light, dark, and contrast-dark themes and provides scale-aware icons."),
        ("Accessibility", "Text colors are contrast tested, controls have clear labels, and status changes use accessible live regions. Keyboard focus remains visible throughout the panel."),
        ("Offline reliability", "Bookmarks are written immediately and flushed again during editor lifecycle events. Reopening the same PDF restores the saved page markers."),
        ("Release quality", "Automated tests cover document identity, persistence, ordering, rename and delete operations, package metadata, icons, and theme contrast."),
        ("Next steps", "Potential future improvements include nested bookmarks, manual ordering, color labels, and portable import or export. User feedback should determine the order."),
        ("Marketplace summary", "PDF Bookmarks makes long PDFs easier to navigate in ONLYOFFICE while preserving privacy and leaving the original file untouched."),
    ]

    for index, (heading, text) in enumerate(sections, start=2):
        story.append(Paragraph(heading, section))
        story.append(Paragraph(text, body))
        story.append(Spacer(1, 0.2 * inch))
        data = [
            ["Suggested bookmark", heading],
            ["Demo page", str(index)],
            ["Storage", "Local to this editor environment"],
            ["PDF modified", "No"],
        ]
        table = Table(data, colWidths=[1.65 * inch, 4.85 * inch], hAlign="LEFT")
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), HexColor("#EDF4FF")),
            ("TEXTCOLOR", (0, 0), (0, -1), HexColor("#174F9E")),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("TEXTCOLOR", (1, 0), (1, -1), HexColor("#26384F")),
            ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#C7D6E8")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ]))
        story.append(table)
        story.append(Spacer(1, 0.25 * inch))
        story.append(Paragraph("Bookmark this page, navigate elsewhere, then return with one click.", callout))
        if index < len(sections) + 1:
            story.append(PageBreak())

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUTPUT)


if __name__ == "__main__":
    build_demo_pdf()

# fix_layout.py
from pathlib import Path
import re
import shutil

root = Path(__file__).resolve().parent
pages = root / "frontend" / "pages"
layout = root / "frontend" / "assets" / "js" / "layout.js"

if not layout.exists():
    raise SystemExit("ERROR: frontend/assets/js/layout.js belum dibuat.")

files = [
    pages / "projects.html",
    *sorted((pages / "student").glob("*.html")),
    *sorted((pages / "umkm").glob("*.html"))
]

backup = root / "layout-backup-v2"
changed = 0

for file in files:
    if not file.exists():
        continue

    old = file.read_text(encoding="utf-8")

    if "dashboard-sidebar" not in old or "dashboard-topbar" not in old:
        continue

    html = old

    # Sidebar lama diganti dengan satu container.
    html = re.sub(
        r'<aside\b[^>]*class="[^"]*dashboard-sidebar[^"]*"[^>]*>.*?</aside>',
        '<aside class="dashboard-sidebar" id="shared-sidebar"></aside>',
        html,
        count=1,
        flags=re.S
    )

    # Topbar lama diganti dengan satu container.
    html = re.sub(
        r'<header\b[^>]*class="[^"]*dashboard-topbar[^"]*"[^>]*>.*?</header>',
        '<header class="dashboard-topbar" id="shared-topbar"></header>',
        html,
        count=1,
        flags=re.S
    )

    # Hilangkan pemanggilan layout.js lama agar tidak dobel.
    html = re.sub(
        r'\s*<script\b[^>]*src=["\'][^"\']*/layout\.js["\'][^>]*>\s*</script>',
        '',
        html,
        flags=re.I
    )

    src = (
        "../assets/js/layout.js"
        if file.parent == pages
        else "../../assets/js/layout.js"
    )

    tag = f'  <script src="{src}"></script>\n'

    # Pasang sebelum script utama halaman.
    scripts = list(re.finditer(r"<script\b[^>]*>", html, flags=re.I))

    inline = next(
        (
            match for match in scripts
            if not re.search(r"\bsrc\s*=", match.group(), re.I)
        ),
        None
    )

    if inline:
        html = html[:inline.start()] + tag + html[inline.start():]
    elif "</body>" in html:
        html = html.replace("</body>", tag + "</body>", 1)
    else:
        print("SKIP:", file.name)
        continue

    if html == old:
        continue

    # Backup satu kali sebelum penggantian.
    destination = backup / file.relative_to(pages)
    destination.parent.mkdir(parents=True, exist_ok=True)

    if not destination.exists():
        shutil.copy2(file, destination)

    file.write_text(html, encoding="utf-8")

    print("OK:", file.relative_to(pages))
    changed += 1

print("Selesai:", changed, "halaman.")
print("Backup:", backup)
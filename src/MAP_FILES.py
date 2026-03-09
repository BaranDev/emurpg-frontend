#!/usr/bin/env python3
"""
MAP_FILES.py
------------
Maps every source file under src/ to all files that import or re-export it.

Accuracy-first design:
  - Resolves relative imports (./, ../) to real filesystem paths
  - Handles bare directory imports (resolves to index.jsx/js)
  - Handles extension-less imports (tries .jsx/.js/.ts/.tsx)
  - Captures static imports, dynamic imports, require(), and re-exports

Output:
  <project_root>/component_map.csv
  Columns: ComponentFile, ComponentPath, Folder, UsedIn, TotalUsageCount

Usage:
  python src/MAP_FILES.py
  (run from the project root, or from anywhere — path is auto-detected)
"""

import os
import re
import csv
import sys
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

SRC_DIR = Path(__file__).parent.resolve()  # .../emurpg-frontend/src
PROJECT_ROOT = SRC_DIR.parent  # .../emurpg-frontend
OUTPUT_FILE = PROJECT_ROOT / "component_map.csv"

SCAN_EXTENSIONS = {".jsx", ".js", ".ts", ".tsx"}

# Directories to ignore while walking
SKIP_DIRS = {
    "node_modules",
    "dist",
    "build",
    ".git",
    "__pycache__",
    ".venv",
    "coverage",
}

# ---------------------------------------------------------------------------
# Import extraction  (accuracy > speed — we try multiple patterns)
# ---------------------------------------------------------------------------

# Pattern 1: static  import … from '…'  or  import '…'  (side-effect import)
_RE_STATIC = re.compile(
    r"""import\s+(?:[\s\S]*?from\s+)?['"](\.{1,2}/[^'"]+)['"]""",
    re.MULTILINE,
)

# Pattern 2: dynamic  import('…')
_RE_DYNAMIC = re.compile(
    r"""import\s*\(\s*['"](\.{1,2}/[^'"]+)['"]\s*\)""",
    re.MULTILINE,
)

# Pattern 3: re-export  export { … } from '…'  /  export * from '…'
_RE_REEXPORT = re.compile(
    r"""export\s+(?:[\s\S]*?from\s+)?['"](\.{1,2}/[^'"]+)['"]""",
    re.MULTILINE,
)

# Pattern 4: CommonJS  require('…')
_RE_REQUIRE = re.compile(
    r"""require\s*\(\s*['"](\.{1,2}/[^'"]+)['"]\s*\)""",
    re.MULTILINE,
)

ALL_PATTERNS = [_RE_STATIC, _RE_DYNAMIC, _RE_REEXPORT, _RE_REQUIRE]


def extract_relative_imports(file_path: Path) -> list:
    """Return all relative import strings found inside file_path."""
    try:
        text = file_path.read_text(encoding="utf-8", errors="replace")
    except Exception as exc:
        print(f"  [WARN] Could not read {file_path}: {exc}", file=sys.stderr)
        return []

    seen = set()
    results = []
    for pat in ALL_PATTERNS:
        for m in pat.finditer(text):
            raw = m.group(1)
            if raw not in seen:
                seen.add(raw)
                results.append(raw)
    return results


# ---------------------------------------------------------------------------
# Path resolution
# ---------------------------------------------------------------------------


def resolve_import(raw: str, importer: Path, src_root: Path) -> Optional[str]:
    """
    Resolve a relative import string to a canonical path relative to src_root.

    Returns forward-slash canonical path (e.g. "components/Navbar.jsx")
    or None if the target cannot be found on disk.
    """
    base = importer.parent
    target_base = (base / raw).resolve()

    candidates = []

    # 1. Exact path as written (might already have extension)
    candidates.append(target_base)

    # 2. Try appending each known extension
    for ext in SCAN_EXTENSIONS:
        candidates.append(target_base.with_suffix(ext))

    # 3. Treat as directory — resolve to index.*
    for ext in SCAN_EXTENSIONS:
        candidates.append(target_base / f"index{ext}")

    for c in candidates:
        if c.is_file():
            try:
                rel = c.relative_to(src_root)
                return str(rel).replace("\\", "/")
            except ValueError:
                # target is outside src/ (e.g. public/ or root assets) — still record it
                try:
                    rel = c.relative_to(src_root.parent)
                    return f"(outside-src)/{str(rel).replace(chr(92), '/')}"
                except ValueError:
                    pass
    return None  # not found = external package or truly missing file


# ---------------------------------------------------------------------------
# File collection
# ---------------------------------------------------------------------------


def collect_source_files(root: Path) -> list:
    """Walk root and return all source files (excluding SKIP_DIRS)."""
    found = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Prune in-place so os.walk doesn't descend into skipped dirs
        dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS)
        for name in sorted(filenames):
            p = Path(dirpath) / name
            if p.suffix in SCAN_EXTENSIONS and p.name != "MAP_FILES.py":
                found.append(p)
    return found


# ---------------------------------------------------------------------------
# Core mapping
# ---------------------------------------------------------------------------


def build_usage_map(all_files: list, src_root: Path) -> dict:
    """
    Returns dict: canonical_path -> sorted list of canonical importers.
    Every source file gets an entry even if nobody imports it.
    """
    # Pre-build the registry so we know which paths are "ours"
    registry = {}  # canonical_path -> set of importers
    for f in all_files:
        key = str(f.relative_to(src_root)).replace("\\", "/")
        registry[key] = set()

    total = len(all_files)
    for idx, importer in enumerate(all_files, 1):
        importer_canon = str(importer.relative_to(src_root)).replace("\\", "/")

        if idx % 10 == 0 or idx == total:
            print(f"  [{idx:>3}/{total}] {importer_canon}")

        for raw in extract_relative_imports(importer):
            resolved = resolve_import(raw, importer, src_root)
            if resolved and resolved in registry:
                registry[resolved].add(importer_canon)

    return {k: sorted(v) for k, v in registry.items()}


# ---------------------------------------------------------------------------
# CSV output
# ---------------------------------------------------------------------------


def write_csv(usage_map: dict, output_path: Path) -> None:
    """Write the usage map to a CSV file."""
    fieldnames = [
        "ComponentFile",  # filename only (e.g. Navbar.jsx)
        "ComponentPath",  # relative to src/ (e.g. components/Navbar.jsx)
        "Folder",  # parent folder (e.g. components)
        "UsedIn",  # canonical path of importing file, or "(UNUSED)"
        "TotalUsageCount",  # how many distinct files import this component
    ]

    rows = []
    for canon, importers in sorted(usage_map.items()):
        file_name = Path(canon).name
        folder = str(Path(canon).parent).replace("\\", "/")
        if folder == ".":
            folder = "(src root)"
        count = len(importers)

        if importers:
            for imp in importers:
                rows.append(
                    {
                        "ComponentFile": file_name,
                        "ComponentPath": canon,
                        "Folder": folder,
                        "UsedIn": imp,
                        "TotalUsageCount": count,
                    }
                )
        else:
            rows.append(
                {
                    "ComponentFile": file_name,
                    "ComponentPath": canon,
                    "Folder": folder,
                    "UsedIn": "(UNUSED)",
                    "TotalUsageCount": 0,
                }
            )

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n  Wrote {len(rows)} rows to: {output_path}")


# ---------------------------------------------------------------------------
# Summary helpers
# ---------------------------------------------------------------------------


def print_summary(usage_map: dict) -> None:
    total = len(usage_map)
    unused = [p for p, imps in usage_map.items() if not imps]
    used_once = [p for p, imps in usage_map.items() if len(imps) == 1]
    multi = [p for p, imps in usage_map.items() if len(imps) > 1]

    print(f"\n{'=' * 60}")
    print(f"  SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Total source files scanned : {total}")
    print(f"  Used in multiple places     : {len(multi)}")
    print(f"  Used in exactly one place   : {len(used_once)}")
    print(f"  No imports found (UNUSED)   : {len(unused)}")
    print(f"{'=' * 60}")

    if unused:
        print(f"\n  Potentially unused files ({len(unused)}):")
        for p in sorted(unused):
            print(f"    - {p}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def main() -> None:
    print(f"MAP_FILES.py — Component usage mapper")
    print(f"  Source root : {SRC_DIR}")
    print(f"  Output      : {OUTPUT_FILE}")
    print()

    all_files = collect_source_files(SRC_DIR)
    print(f"Found {len(all_files)} source files to map.\n")
    print("Scanning imports (accuracy-first — resolves every relative path)...\n")

    usage_map = build_usage_map(all_files, SRC_DIR)

    write_csv(usage_map, OUTPUT_FILE)
    print_summary(usage_map)
    print("\nDone. Open component_map.csv in Excel or any spreadsheet viewer.")
    print("Sort by 'TotalUsageCount' or 'Folder' to plan your reorganisation.\n")


if __name__ == "__main__":
    main()

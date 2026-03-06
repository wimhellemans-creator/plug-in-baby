import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "lier_nieuws.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            url TEXT NOT NULL UNIQUE,
            active INTEGER DEFAULT 1,
            municipality TEXT NOT NULL DEFAULT 'lier',
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            summary TEXT NOT NULL,
            bullets TEXT NOT NULL,
            source_url TEXT NOT NULL,
            original_url TEXT NOT NULL,
            original_date TEXT,
            label TEXT DEFAULT '',
            municipality TEXT NOT NULL DEFAULT 'lier',
            created_at TEXT DEFAULT (datetime('now')),
            UNIQUE(original_url)
        );

        CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_articles_original_url ON articles(original_url);
    """)

    # Add label column to existing databases (migration)
    try:
        conn.execute("ALTER TABLE articles ADD COLUMN label TEXT DEFAULT ''")
        conn.commit()
    except Exception:
        pass  # column already exists

    # Add municipality column to existing databases (migration)
    try:
        conn.execute("ALTER TABLE sources ADD COLUMN municipality TEXT NOT NULL DEFAULT 'lier'")
        conn.commit()
    except Exception:
        pass  # column already exists

    try:
        conn.execute("ALTER TABLE articles ADD COLUMN municipality TEXT NOT NULL DEFAULT 'lier'")
        conn.commit()
    except Exception:
        pass  # column already exists

    conn.commit()
    conn.close()


def get_all_sources(active_only=False, municipality=None):
    conn = get_db()
    conditions = []
    params = []
    if active_only:
        conditions.append("active = 1")
    if municipality:
        conditions.append("municipality = ?")
        params.append(municipality)

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    rows = conn.execute(
        f"SELECT * FROM sources {where} ORDER BY category, description", params
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def add_source(category, description, url, municipality="lier"):
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO sources (category, description, url, municipality) VALUES (?, ?, ?, ?)",
            (category, description, url, municipality),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return False
    conn.close()
    return True


def update_source(source_id, category, description, url, active):
    conn = get_db()
    conn.execute(
        "UPDATE sources SET category=?, description=?, url=?, active=? WHERE id=?",
        (category, description, url, active, source_id),
    )
    conn.commit()
    conn.close()


def delete_source(source_id):
    conn = get_db()
    conn.execute("DELETE FROM sources WHERE id=?", (source_id,))
    conn.commit()
    conn.close()


def get_existing_urls(municipality=None):
    conn = get_db()
    if municipality:
        rows = conn.execute(
            "SELECT original_url FROM articles WHERE municipality = ?", (municipality,)
        ).fetchall()
    else:
        rows = conn.execute("SELECT original_url FROM articles").fetchall()
    conn.close()
    return {r["original_url"] for r in rows}


def add_article(title, summary, bullets, source_url, original_url, original_date, label="", municipality="lier"):
    conn = get_db()
    try:
        conn.execute(
            """INSERT INTO articles (title, summary, bullets, source_url, original_url, original_date, label, municipality)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (title, summary, bullets, source_url, original_url, original_date, label, municipality),
        )
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        conn.close()
        return False


def get_articles(page=1, per_page=20, municipality=None):
    conn = get_db()
    offset = (page - 1) * per_page
    if municipality:
        total = conn.execute(
            "SELECT COUNT(*) as c FROM articles WHERE municipality = ?", (municipality,)
        ).fetchone()["c"]
        rows = conn.execute(
            "SELECT * FROM articles WHERE municipality = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
            (municipality, per_page, offset),
        ).fetchall()
    else:
        total = conn.execute("SELECT COUNT(*) as c FROM articles").fetchone()["c"]
        rows = conn.execute(
            "SELECT * FROM articles ORDER BY created_at DESC LIMIT ? OFFSET ?",
            (per_page, offset),
        ).fetchall()
    conn.close()
    return [dict(r) for r in rows], total


def get_article(article_id):
    conn = get_db()
    row = conn.execute("SELECT * FROM articles WHERE id=?", (article_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def delete_article(article_id):
    conn = get_db()
    conn.execute("DELETE FROM articles WHERE id=?", (article_id,))
    conn.commit()
    conn.close()

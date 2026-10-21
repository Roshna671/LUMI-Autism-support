import sqlite3
import json

def inspect():
    conn = sqlite3.connect("lumi_development.db")
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [r[0] for r in cur.fetchall()]
    print(f"=== LUMI Database: lumi_development.db ===")
    print(f"Total tables: {len(tables)}\n")
    for t in tables:
        cur.execute(f"SELECT COUNT(*) FROM {t};")
        cnt = cur.fetchone()[0]
        print(f"  • {t:25} : {cnt} rows")

    print("\n--- Activity Definitions Sample ---")
    cur.execute("SELECT activity_key, title, developmental_skill FROM activity_definitions LIMIT 6;")
    for r in cur.fetchall():
        print(f"  [{r[0]}] {r[1]} -> {r[2]}")

    conn.close()

if __name__ == "__main__":
    inspect()

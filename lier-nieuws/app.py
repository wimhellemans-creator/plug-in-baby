import os
import json
import csv
import io
import logging
from flask import Flask, render_template, request, jsonify, Response, stream_with_context
from dotenv import load_dotenv

from database import init_db, get_all_sources, add_source, update_source, delete_source as db_delete_source
from database import get_articles, add_article, delete_article as db_delete_article, get_existing_urls
from scraper import scrape_all_sources
from ai_filter import filter_and_summarize

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Initialize database on import
init_db()


def _seed_sources():
    """Import the default Lier sources if the database is empty."""
    sources = get_all_sources()
    if sources:
        return

    logger.info("Seeding default sources...")
    default_sources = [
        ("Stad & Bestuur", "Stad Lier Algemeen Nieuws", "https://www.lier.be/"),
        ("Stad & Bestuur", "Agenda Gemeente- en OCMW-raad", "https://lier.be/agenda-gemeente-en-ocmw-raad"),
        ("Stad & Bestuur", "Zittingen & Verslagen", "https://www.lier.be/zittingen"),
        ("Stad & Bestuur", "Register van Bekendmakingen", "https://www.lier.be/stadsbestuur/beleid-en-wetgeving/register-van-bekendmakingen"),
        ("Stad & Bestuur", "Reglementen Stad Lier", "https://www.lier.be/stadsbestuur/beleid-en-wetgeving/reglementen-stad-lier"),
        ("Stad & Bestuur", "Perscontacten Stad Lier", "https://lier.be/perscontacten"),
        ("Veiligheid", "Lokale Politie Lier Nieuws", "https://www.politie.be/5360/nieuws"),
        ("Veiligheid", "Brandweerzone Rivierenland", "https://rivierenland.hulpverleningszone.be/"),
        ("Veiligheid", "Brandweerpost Lier", "https://rivierenland.brandweerzone.be/pagina/post-lier"),
        ("Veiligheid", "Vriendenkring Brandweer Lier", "https://brandweervrienden.com/"),
        ("Economie", "Made in Mechelen (regio Lier)", "https://www.made-in.be/mechelen/"),
        ("Economie", "Made in Falingen", "https://www.made-in.be/falingen/"),
        ("Economie", "Info voor Ondernemers (Stad)", "https://lier.be/ondernemen/info-voor-ondernemers"),
        ("Economie", "Lierse Verenigingen Ondernemers", "https://www.lier.be/ondernemen/lierse-verenigingen-voor-ondernemers"),
        ("Economie", "Lierse Club van Bedrijven", "https://lierseclubvanbedrijven.nl/"),
        ("Economie", "Lier Shopping", "https://www.lier.be/ondernemen/hoe-start-ik-als-zelfstandige/lierse-verenigingen-voor-ondernemers/lier-shopping"),
        ("Zorg & Welzijn", "Heilig Hartziekenhuis Nieuws", "https://www.heilighartlier.be/nieuws/"),
        ("Zorg & Welzijn", "Inmemoriam Lier", "https://www.inmemoriam.be/nl/"),
        ("Zorg & Welzijn", "Uitvaartzorg Van den Bogaert", "https://www.begrafenissenvandenbogaert.be/overlijdens.html"),
        ("Zorg & Welzijn", "Funerarium Bosmans", "https://www.funerarium-bosmans.be/online-condoleren/"),
        ("Zorg & Welzijn", "Van der Heyden & Hellemans", "https://www.inmemoriam.be/nl/begrafenisondernemer/van-der-heyden-hellemans-lier-6473"),
        ("Senioren & Zorg", "OKRA Lier Lisp", "https://okra.be/antwerpen/lier-lisp/"),
        ("Senioren & Zorg", "Neos Lier", "https://neosvzw.be/lier/agenda-activiteiten/"),
        ("Sociale Zorg", "Sociale Kruidenier 't Hofke", "https://thofke.mivas.be/sociale-kruidenier"),
        ("Sport", "Lierse SK (Kempenzonen)", "https://www.lierse.com/"),
        ("Sport", "Lierse Academy", "https://lierseacademy.be/"),
        ("Sport", "K. Lyra-Lierse", "https://lyralierse.be/"),
        ("Sport", "AV Lyra-Lierse (AVLL)", "https://avll.be/"),
        ("Sport", "BC Guco Lier", "https://guco.sportadministratie.be/"),
        ("Sport", "SV Zevenbergen (Tennis & Padel)", "https://www.zevenbergensport.be/"),
        ("Sport", "Royal Herakles HC (Hockey)", "https://herakles.be/"),
        ("Sport", "BC Mister 100 (Biljart)", "https://mister100-salledeau.be/biljartzaal-mister-100-lier/"),
        ("Sport", "ChessLooks Lier (Schaken)", "https://www.chesslooks-lier.be/"),
        ("Sport", "Pallieterjogging", "https://www.pallieterjogging.be/"),
        ("Jeugdverenigingen", "Chiro Lips", "https://www.chirolips.be/"),
        ("Jeugdverenigingen", "Chiro Lier (HH & Sint-Gummarus)", "https://www.chirolier.be/"),
        ("Jeugdverenigingen", "Chiro Jut (Koningshooikt)", "https://www.chirojut.be/"),
        ("Jeugdverenigingen", "Scouts Sint-Gummarus Lier", "https://scoutinglier.be/"),
        ("Jeugdverenigingen", "Scouts Durendael", "https://scoutslier.be/"),
        ("Jeugdverenigingen", "KSA Sint-Gummarus Lier", "https://ksalier.weebly.com/"),
        ("Jeugdverenigingen", "KLJ Lier Noord", "https://www.kljliernoord.be/"),
        ("Jeugdverenigingen", "KLJ Lier Zuid", "https://www.kljlierzuid.be/"),
        ("Cultuur & Vrije Tijd", "CC De Mol Programmatie", "https://www.lierscultuurcentrum.be/nl/programma"),
        ("Cultuur & Vrije Tijd", "UiT in Lier (Kalender)", "https://ikorganiseerinlier.uitinlier.be/kalender"),
        ("Cultuur & Vrije Tijd", "Verenigingen in Lier (Stad)", "https://www.lier.be/vrije-tijd/verenigingen-in-lier"),
        ("Cultuur & Vrije Tijd", "UiT in Lier Sportdatabank", "https://sporten.uitinlier.be/"),
        ("Cultuur & Theater", "Teater Lier (Den Bril)", "https://denbril.be/"),
        ("Cultuur & Theater", "Toneellabo Arlecchino", "https://www.arlecchinolier.be/"),
        ("Cultuur & Theater", "Theatergezelschap De Seine", "http://www.deseine.be"),
        ("Cultuur & Muziek", "Koninklijke Stadsharmonie Leo XIII", "https://www.leoxiii-lier.be/"),
        ("Sociaal Weefsel", "Hoplr Lier", "https://www.hoplr.com/stad/lier"),
        ("Sociaal Weefsel", "Kerknet Parochies Lier", "https://www.kerknet.be/pastorale-eenheid-h-gummarus-z-beatrijs-lier/artikel/parochieblad"),
        ("Sociaal Weefsel", "Vrijwilligers Stad Lier", "https://www.lier.be/stadsbestuur/vacatures/word-vrijwilliger"),
        ("Erfgoed & Traditie", "Orde van het Liers Vlaaike", "https://www.visitlier.be/nl/eten-en-drinken/streekproducten/liers-vlaaike"),
        ("Erfgoed & Traditie", "Liers Genootschap voor Geschiedenis", "https://www.liersgenootschap.be/"),
        ("Erfgoed & Traditie", "Gilde der Heren van Lier", "https://www.herenvanlier.be/"),
        ("Erfgoed & Traditie", "Zimmertoren & Zimmermuseum", "https://zimmertoren.be/"),
        ("Natuur & Milieu", "Natuurpunt De Wielewaal", "https://www.natuurpunt.be/afdelingen/natuurpunt-de-wielewaal"),
        ("Lokale Politiek", "N-VA Lier (Nieuws)", "https://lier.n-va.be/nieuws"),
        ("Lokale Politiek", "Missie2500 (CD&V Lier)", "https://afdeling.cdenv.be/lier"),
        ("Lokale Politiek", "Vooruit Lier", "https://nieuws.vooruit.org/lier"),
        ("Lokale Politiek", "Groen Lier&Ko", "https://www.kiesjetoekomst.be/"),
        ("Lokale Politiek", "Vlaams Belang Lier (Activiteiten)", "https://www.vlaamsbelang.org/activiteiten/vlaams-belang-lier-koningshooikt"),
        ("Serviceclubs", "Lions Club Lier Twee Neten", "https://lionslier.be/onze-evenementen/"),
        ("Serviceclubs", "Kiwanis Lier Twee Neten", "https://kiwanisliertweeneten.be/acties-en-nieuws/"),
        ("Serviceclubs", "Rotary Lier", "https://www.rotarylier.be/"),
        ("Media & Concurrentie", "RTV Lier", "https://www.rtv.be/regio/lier"),
        ("Media & Concurrentie", "Lier Belicht", "https://www.lierbelicht.be/"),
        ("Media & Concurrentie", "Nnieuws Brandweer Rivierenland", "https://nnieuws.be/tags/brandweer-rivierenland"),
        ("Media & Concurrentie", "Radio Pallieter", "https://radiopallieter.be/"),
        ("Media & Concurrentie", "Het Nieuwsblad Lier", "https://www.nieuwsblad.be/regio/lier"),
        ("Media & Concurrentie", "Gazet van Antwerpen Lier", "https://www.gva.be/regio/lier"),
        ("Studenten & Jobs", "Student.be Jobs Lier", "https://www.student.be/en/lier/student-jobs/"),
        ("Studenten & Jobs", "Jobat Regio Lier", "https://www.jobat.be/nl/jobs/lier"),
    ]

    for cat, desc, url in default_sources:
        add_source(cat, desc, url)

    logger.info(f"Seeded {len(default_sources)} default sources.")


# Seed default sources if empty
_seed_sources()


# ---- Routes ----

@app.route("/")
def index():
    return render_template("index.html")


# ---- API: Articles ----

@app.route("/api/articles")
def api_get_articles():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    articles, total = get_articles(page, per_page)
    total_pages = max(1, (total + per_page - 1) // per_page)
    return jsonify({
        "articles": articles,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
    })


@app.route("/api/articles/<int:article_id>", methods=["DELETE"])
def api_delete_article(article_id):
    db_delete_article(article_id)
    return jsonify({"ok": True})


# ---- API: Sources ----

@app.route("/api/sources")
def api_get_sources():
    sources = get_all_sources()
    return jsonify(sources)


@app.route("/api/sources", methods=["POST"])
def api_add_source():
    data = request.get_json()
    if not data or not all(k in data for k in ("category", "description", "url")):
        return jsonify({"error": "Vul categorie, beschrijving en URL in"}), 400

    ok = add_source(data["category"], data["description"], data["url"])
    if not ok:
        return jsonify({"error": "Deze URL bestaat al in de bronnen"}), 409
    return jsonify({"ok": True}), 201


@app.route("/api/sources/<int:source_id>/toggle", methods=["PUT"])
def api_toggle_source(source_id):
    data = request.get_json()
    active = 1 if data.get("active") else 0
    # We need to get the source first to preserve other fields
    sources = get_all_sources()
    source = next((s for s in sources if s["id"] == source_id), None)
    if not source:
        return jsonify({"error": "Bron niet gevonden"}), 404
    update_source(source_id, source["category"], source["description"], source["url"], active)
    return jsonify({"ok": True})


@app.route("/api/sources/<int:source_id>", methods=["DELETE"])
def api_delete_source(source_id):
    db_delete_source(source_id)
    return jsonify({"ok": True})


# ---- API: Search ----

@app.route("/api/search", methods=["POST"])
def api_search():
    """Start a news search. Uses Server-Sent Events to stream progress."""
    def generate():
        try:
            # 1. Get active sources
            sources = get_all_sources(active_only=True)
            if not sources:
                yield _sse({"type": "error", "message": "Geen actieve bronnen gevonden. Voeg bronnen toe via 'Bronnen beheren'."})
                return

            # 2. Scrape all sources
            def progress_cb(current, total, source_name):
                # We can't yield from inside a callback, so we store progress
                pass

            scraped_content = []
            total = len(sources)
            scrape_ok = 0
            scrape_fail = 0

            for i, source in enumerate(sources):
                yield _sse({"type": "progress", "current": i + 1, "total": total, "source": source["description"]})
                from scraper import scrape_source, extract_page_content
                import time

                result = scrape_source(source)
                content = extract_page_content(result)
                if content and content["articles"]:
                    scraped_content.append(content)
                    scrape_ok += 1
                    logger.info(f"  OK: {source['description']} -> {len(content['articles'])} items")
                else:
                    scrape_fail += 1
                    logger.warning(f"  LEEG: {source['description']} (status: {result['status']})")
                time.sleep(0.3)

            logger.info(f"Scraping klaar: {scrape_ok} bronnen met content, {scrape_fail} lege bronnen")

            if not scraped_content:
                logger.warning("Geen enkele bron leverde content op. Controleer je internetverbinding.")
                yield _sse({"type": "done", "new_articles": 0})
                return

            # 3. Get existing URLs for deduplication
            existing_urls = get_existing_urls()

            # 4. AI analysis
            yield _sse({"type": "analyzing"})
            logger.info(f"AI-analyse gestart met {len(scraped_content)} bronnen en {len(existing_urls)} bestaande URLs...")
            articles = filter_and_summarize(scraped_content, existing_urls)
            logger.info(f"AI-analyse klaar: {len(articles)} leads gevonden")

            if not articles:
                yield _sse({"type": "done", "new_articles": 0})
                return

            # 5. Save to database
            yield _sse({"type": "saving", "count": len(articles)})
            new_count = 0
            for art in articles:
                bullets = json.dumps(art.get("bullets", []), ensure_ascii=False)
                ok = add_article(
                    title=art.get("title", "Geen titel"),
                    summary=art.get("summary", ""),
                    bullets=bullets,
                    source_url=art.get("source_url", ""),
                    original_url=art.get("original_url", ""),
                    original_date=art.get("original_date", "onbekend"),
                )
                if ok:
                    new_count += 1

            yield _sse({"type": "done", "new_articles": new_count})

        except Exception as e:
            logger.error(f"Search error: {e}", exc_info=True)
            yield _sse({"type": "error", "message": f"Er ging iets mis: {str(e)}"})

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


def _sse(data):
    """Format data as a Server-Sent Event."""
    return f"data: {json.dumps(data, ensure_ascii=False)}\n\n"


# ---- Main ----

if __name__ == "__main__":
    app.run(debug=True, port=5000)

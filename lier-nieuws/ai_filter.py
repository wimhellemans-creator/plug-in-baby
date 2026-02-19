import json
import os
import logging
from anthropic import Anthropic
from datetime import datetime

logger = logging.getLogger(__name__)

# Fix SSL certificate path for Windows Python installations
try:
    import certifi
    os.environ.setdefault("SSL_CERT_FILE", certifi.where())
    os.environ.setdefault("REQUESTS_CA_BUNDLE", certifi.where())
except ImportError:
    pass


def get_client():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY is niet ingesteld in .env")
    return Anthropic(api_key=api_key)


FILTER_PROMPT = """Je bent een ervaren regiojournalist die werkt voor HLN, de populairste nieuwssite van Vlaanderen.
Je focust op de gemeente LIER en omgeving (inclusief Koningshooikt en Lisp).

Je krijgt een verzameling gescrapete webpagina's van lokale bronnen. Jouw taak:

1. SELECTEER alleen de items die nieuwswaardig zijn voor een regionaal publiek in Lier.
   Nieuwswaardig betekent:
   - Hard nieuws (ongelukken, criminaliteit, politieke beslissingen, ...)
   - Aankondigingen van evenementen, braderijen, festivals
   - Werken in de straat, mobiliteit, verkeer
   - Bijzondere verhalen van mensen uit Lier
   - Sport: wedstrijdresultaten, transfers, bijzondere prestaties
   - Openingen/sluitingen van winkels, horeca, bedrijven
   - Culturele evenementen, tentoonstellingen, voorstellingen
   - Sociale verhalen, vrijwilligerswerk, bijzondere initiatieven
   - Alles wat een regiojournalist zou opmerken

2. FILTER WEG:
   - Artikelen ouder dan 7 dagen (vandaag is {today})
   - Artikelen zonder duidelijke nieuwswaarde
   - Zuivere reclameboodschappen
   - Generieke info die niet verandert (openingsuren, vaste pagina's, ...)
   - Artikelen die al in onze database staan (zie lijst hieronder)

3. Voor elk geselecteerd artikel, geef:
   - title: een pakkende titel (in het Nederlands)
   - summary: een samenvatting in 1 zin
   - bullets: exact 3 bullet points die het verhaal duiden of pitchen voor de journalist
   - original_url: de exacte URL van het bronartikel (NIET de homepage van de bron)
   - source_url: de URL van de bron/website
   - original_date: de datum van publicatie (formaat: YYYY-MM-DD HH:MM of YYYY-MM-DD als uur onbekend)

BELANGRIJK:
- Gebruik ENKEL informatie die je vindt in de gescrapete data. Verzin NIETS.
- De original_url moet een echte, specifieke link zijn naar het artikel, niet de homepage.
- Als je geen datum kan vinden, gebruik dan de tekst "onbekend".
- Wees selectief: liever 3 goede leads dan 10 matige.

Reeds bestaande artikelen in onze database (deze NIET opnieuw opnemen):
{existing_urls}

Antwoord ENKEL in geldig JSON-formaat:
{{
  "articles": [
    {{
      "title": "...",
      "summary": "...",
      "bullets": ["...", "...", "..."],
      "original_url": "...",
      "source_url": "...",
      "original_date": "..."
    }}
  ]
}}

Als er geen nieuwswaardige artikelen zijn, antwoord dan:
{{"articles": []}}
"""


def filter_and_summarize(scraped_content, existing_urls):
    """Use Claude to filter and summarize scraped content into news leads."""
    client = get_client()
    today = datetime.now().strftime("%Y-%m-%d")

    # Build the content to send to Claude
    content_parts = []
    for source_data in scraped_content:
        source = source_data["source"]
        articles = source_data["articles"]

        source_text = f"\n--- BRON: {source['description']} ({source['category']}) ---\nURL: {source['url']}\n"
        for art in articles:
            source_text += f"\nTitel: {art.get('title', '(geen titel)')}\n"
            source_text += f"URL: {art.get('url', '')}\n"
            source_text += f"Datum: {art.get('date', 'onbekend')}\n"
            source_text += f"Tekst: {art.get('text', '')[:1500]}\n"
            if art.get("links"):
                source_text += "Links:\n"
                for link in art["links"][:10]:
                    source_text += f"  - {link['text']}: {link['url']}\n"

        content_parts.append(source_text)

    full_content = "\n".join(content_parts)

    # Truncate if too long (Claude has token limits)
    if len(full_content) > 150000:
        full_content = full_content[:150000] + "\n\n[AFGEKAPT - te veel content]"

    existing_urls_text = "\n".join(f"- {url}" for url in existing_urls) if existing_urls else "(geen bestaande artikelen)"

    prompt = FILTER_PROMPT.format(today=today, existing_urls=existing_urls_text)

    try:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=4096,
            messages=[
                {
                    "role": "user",
                    "content": f"{prompt}\n\nHier zijn de gescrapete bronnen:\n\n{full_content}",
                }
            ],
        )

        response_text = response.content[0].text

        # Extract JSON from response
        # Sometimes the model wraps it in ```json ... ```
        json_match = response_text
        if "```json" in response_text:
            json_match = response_text.split("```json")[1].split("```")[0]
        elif "```" in response_text:
            json_match = response_text.split("```")[1].split("```")[0]

        result = json.loads(json_match.strip())
        return result.get("articles", [])

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Claude response as JSON: {e}")
        logger.error(f"Response was: {response_text[:500]}")
        return []
    except Exception as e:
        logger.error(f"Claude API error: {e}")
        raise

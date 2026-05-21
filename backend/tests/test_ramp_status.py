import os
import sys

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.ramp_status import (
    RampStatusResponse,
    RampStatusValue,
    clear_ramp_status_cache,
    enrich_river_flow_from_loisirs,
    parse_ramp_status_from_html,
)

CLOSED_HTML = """
<html><body>
  <div class="alert">
    <h2>Rampe de mise à l'eau</h2>
    <p>La rampe de mise à l'eau du parc de la Pointe-Merry est actuellement
    fermée. Réouverture prévue le 24 mai 2026.</p>
  </div>
</body></html>
"""

OPEN_HTML = """
<html><body>
  <div class="content">
    <p>La rampe de mise à l'eau est ouverte pour la saison.</p>
  </div>
</body></html>
"""

NO_RAMPE_HTML = """
<html><body>
  <p>Aucun avis en cours pour les installations aquatiques.</p>
</body></html>
"""


@pytest.fixture(autouse=True)
def reset_cache() -> None:
    clear_ramp_status_cache()


def test_parse_closed_with_reopening_date() -> None:
    result = parse_ramp_status_from_html(CLOSED_HTML)

    assert result.status == RampStatusValue.CLOSED
    assert result.label == "Fermée"
    assert result.reopening_date == "2026-05-24"
    assert result.reopening_date_display == "24 mai 2026"
    assert result.excerpt is not None
    assert "fermée" in result.excerpt.lower()


def test_parse_open() -> None:
    result = parse_ramp_status_from_html(OPEN_HTML)

    assert result.status == RampStatusValue.OPEN
    assert result.label == "Ouverte"
    assert result.reopening_date is None


def test_parse_no_ramp_mention_defaults_open() -> None:
    result = parse_ramp_status_from_html(NO_RAMPE_HTML)

    assert result.status == RampStatusValue.OPEN
    assert result.label == "Ouverte"
    assert result.excerpt is None


LOISIRS_TABLE_HTML = """
<html><body>
  <table>
    <tr>
      <th>Débit d'évacuation</th>
      <th>Débit de la rivière (&le; 70 m 3 /s)</th>
      <th>Débit de la rivière (&gt; 70 m 3 /s)</th>
    </tr>
    <tr>
      <td>70 m 3 /s</td>
      <td>Navigation autorisée</td>
      <td>Navigation interdite</td>
    </tr>
  </table>
  <h2 id="ouverture-fermeture-rampe">Ouverture et fermeture de la rampe</h2>
</body></html>
"""


def test_enrich_river_flow_from_loisirs_table_when_missing() -> None:
    payload = RampStatusResponse(
        status=RampStatusValue.OPEN,
        label="Ouverte",
        source_url="https://example.test/avis",
        fetched_at=parse_ramp_status_from_html(OPEN_HTML).fetched_at,
    )

    enriched = enrich_river_flow_from_loisirs(payload, LOISIRS_TABLE_HTML)

    assert enriched.river_flow == "70 m3/s"


def test_enrich_keeps_existing_river_flow() -> None:
    payload = RampStatusResponse(
        status=RampStatusValue.OPEN,
        label="Ouverte",
        river_flow="42 m3/s",
        source_url="https://example.test/avis",
        fetched_at=parse_ramp_status_from_html(OPEN_HTML).fetched_at,
    )

    enriched = enrich_river_flow_from_loisirs(payload, LOISIRS_TABLE_HTML)

    assert enriched.river_flow == "42 m3/s"

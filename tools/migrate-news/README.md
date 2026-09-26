# Newsroom migration scripts (anandgroupindia.com → data/newsroom.json)

Run in this order from a working folder. Downloaded files (`lists.json`, `details/`, `news.json`) are **not** kept in the repo.

1. Save the live listing page as `newsroom-media_latest-at-anand.html` (it holds the Ajax Load More nonce).
2. `python3 fetch_lists.py`: pulls every *Latest at ANAND*, *Media Coverage* and *Newsletter* item through `admin-ajax.php?action=alm_query_posts` (the site's REST API returns a server error). Writes `lists.json`.
3. `fill_companies.py` (optional): one query per company on `company_belongs_to`, for real company tags. It failed on 26 Sep because the server started timing out.
4. Download each full article into `details/<arid>.html` from `/newsroom-media/latest-at-anand/news-detalis/?arid=<arid>` (ids from `lists.json`), a few at a time.
5. `python3 build_data.py`: parses and cleans everything into `news.json` (all 661 items).
6. `python3 select.py`: picks the sample (article ids listed in the file, newest coverage and newsletters), tags companies from the text and writes `data/newsroom.json`.

Be gentle with the old server: it stopped responding after ~300 requests on 26 Sep 2026. Ask before re-running.

import json, re, subprocess, urllib.parse, sys
BASE="https://www.anandgroupindia.com"
html=open('newsroom-media_latest-at-anand.html').read()
NONCE=re.search(r'"alm_nonce":"([^"]+)"',html).group(1)
def alm(slug, category, orderby, meta_key='', meta_value='', meta_compare=''):
    q={'action':'alm_query_posts','query_type':'standard','nonce':NONCE,'cache_logged_in':'false','repeater':'default','theme_repeater':'null','post_type[]':'post','category':category,'meta_key':meta_key,'meta_value':meta_value,'meta_compare':meta_compare,'order':'DESC','orderby':orderby,'posts_per_page':'2000','page':'0','offset':'0','preloaded':'false','seo_start_page':'1','paging':'false','slug':slug,'canonical_url':f'{BASE}/newsroom-media/{slug}/'}
    url=f"{BASE}/wp-admin/admin-ajax.php?"+urllib.parse.urlencode(q)
    out=subprocess.run(['curl','-sL','-A','Mozilla/5.0','-e',q['canonical_url'],url],capture_output=True,text=True).stdout
    return json.loads(out)
res={}
res['latest']=alm('latest-at-anand','corporate-announcements,events,news,press-release','meta_value','year_of_adding_article')
res['media']=alm('media-coverage','anand-in-media','meta_value_num','year_of_adding_article')
res['newsletter']=alm('media-newsletter','media-newsletter','date')
companies=dict(re.findall(r'<option\s+value=(\d+) >([^<]+)</option>', html[html.find('selectcompany'):html.find('selectyear')]))
res['companies']=companies
res['by_company']={}
for cid,name in companies.items():
    for key,slug,cat,ob in [('latest','latest-at-anand','corporate-announcements,events,news,press-release','meta_value'),('media','media-coverage','anand-in-media','meta_value_num')]:
        r=alm(slug,cat,ob,'company_belongs_to',cid,'LIKE')
        res['by_company'][f'{key}:{cid}']=r['html']
    print(cid,name,file=sys.stderr)
json.dump(res,open('lists.json','w'))
for k in ['latest','media','newsletter']: print(k, res[k]['meta'])

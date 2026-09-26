import json,re,sys
exec(open('fetch_lists.py').read().split("res={}")[0])
res=json.load(open('lists.json'))
companies=dict(re.findall(r'<option\s+value=(\d+) >([^<]+)</option>', html[html.find('selectcompany'):html.find('selectyear')]))
res['companies']=companies; res['by_company']={}
for cid,name in companies.items():
    for key,slug,cat,ob in [('latest','latest-at-anand','corporate-announcements,events,news,press-release','meta_value'),('media','media-coverage','anand-in-media','meta_value_num')]:
        r=alm(slug,cat,ob,'company_belongs_to',cid,'LIKE')
        res['by_company'][f'{key}:{cid}']=r['html']
    print(cid,name,res['by_company'][f'latest:{cid}'].count('spotContent'),res['by_company'][f'media:{cid}'].count('spotContent'))
json.dump(res,open('lists.json','w'))

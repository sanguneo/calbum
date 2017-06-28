select
	p.idx, p.unique_key, p.reg_date, p.title, p.recipe, p.albumname, p.comment, p.user_key
from ca_photo as p
	left join ca_tag as t
		on p.unique_key = t.photo_key
	where t.name = 'ghjk' and t.user_key='';


SELECT * FROM ca_photo as s WHERE (SELECT COUNT(*) FROM ca_photo AS f WHERE f.albumname = s.albumname AND f.idx <= s.idx) <= 2;


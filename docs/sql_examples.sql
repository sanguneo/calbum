select
	c.idx, c.photo_key,
	c.tag_key, p.title, p.recipe, p.comment, t.name as tag_name
from ca_photo as p
	left join ca_tag_conn as c
		on p.unique_key = c.photo_key
	left join ca_tags as t
		on t.unique_key = c.tag_key
	where photo_key = 'ghjk';

select
	c.idx, c.photo_key,
	c.tag_key, p.title, p.recipe, p.comment, t.name as tag_name
from ca_photo as p
	left join ca_tag_conn as c
		on p.unique_key = c.photo_key
	left join ca_tags as t
		on t.unique_key = c.tag_key
	where photo_key = 'ghjk';
select rid, name, distance
from (
	select rid, name, ( 3959 * acos( cos( 40.440625 ) * cos( R.lat ) 
						* cos( R.lon + 79.995886 ) + sin( 40.440625 ) 
						* sin(R.lat) ) ) AS distance
	from (
		select * 
		from restaurant 
		where POWER(lat - 40.440625, 2) + POWER(lon + 79.995886, 2) < 20
	) R
)
where distance < 50
order by distance





select rid, name, distance
from (
	select rid, name, ( 3959 * acos( cos( 40.440625 ) * cos( R.lat ) 
						* cos( R.lon + 79.995886 ) + sin( 40.440625 ) 
						* sin(R.lat) ) ) AS distance
	from restaurant R
)
where distance < 50
order by distance
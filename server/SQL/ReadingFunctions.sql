CREATE OR REPLACE FUNCTION get_reading_paginated(_sensors int[], _page bigint, _limit int)
RETURNS TABLE(taken_on timestamp, sensor int, value text) AS 
$$
BEGIN
	IF (_page=0) THEN
		RETURN QUERY
		SELECT r.taken_on,r.sensor,r.value
		FROM reading r
		WHERE r.SENSOR = ANY(_sensors)
		ORDER BY r.id DESC
		LIMIT _limit;
	ELSE
		RETURN QUERY
		SELECT r.taken_on,r.sensor,r.value
		FROM reading r
		WHERE r.SENSOR = ANY(_sensors)
			AND id<_page
		ORDER BY r.id DESC
		LIMIT _limit;
	END IF;
END;
$$ LANGUAGE plpgsql;
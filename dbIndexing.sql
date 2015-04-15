# indexing for restaurant table
CREATE INDEX rest_rid_name_index
ON restaurant (rid, name);

CREATE INDEX rest_name_index
ON restaurant (name);

CREATE INDEX rest_lat_index
ON restaurant (lat);

CREATE INDEX rest_long_index
ON restaurant (lon);

CREATE INDEX rest_rid_lat_index
ON restaurant (rid, lat);

CREATE INDEX rest_rid_lon_index
ON restaurant (rid, lon);

# indexing for users table
CREATE UNIQUE INDEX users_username_index
ON users (username);

# password table
CREATE UNIQUE INDEX password_user_pass_index
ON password (username, pass);

CREATE INDEX address_latlon_index
ON address (lat, lon);

CREATE UNIQUE INDEX address_username_latlon_index
ON address (username, lat, lon);

CREATE UNIQUE INDEX groups_id_name_index
ON groups (group_id, group_name);

CREATE UNIQUE INDEX in_group_group_id
ON in_group (group_id);


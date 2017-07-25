USE gachi

CREATE TABLE auth (

) ENGINE = INNODB;

CREATE TABLE user (
  uid INT NOT NULL AUTO_INCREMENT,
  profile_image VARCHAR(256),
  nickname VARCHAR(32) NOT NULL,
  age VARCHAR(8),
  gender VARCHAR(8),
  reliability DECIMAL,
  region VARCHAR(32),
  PRIMARY KEY(uid)
) ENGINE = INNODB;

CREATE TABLE festival (
  fid INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT_NULL,
  location VARCHAR(32),
  festival_date DATETIME,

  INDEX name_ind (name);
  INDEX location_ind (location);
  INDEX date_ind (festival_date);

  PRIMARY KEY(fid)
) ENGINE = INNODB;

CREATE TABLE genre (
  gid INT NOT NULL,
  genre VARCHAR(20) NOT NULL,
  PRIMARY KEY(gid)
) ENGINE = INNODB;

CREATE TABLE fav_genre (
  uid INT NOT NULL,
  gid INT NOT NULL,
  INDEX uid_ind (uid),
  INDEX gid_ind (gid),

  FOREIGN KEY (uid)
    REFERENCES user(uid)
    ON DELETE CASCADE,
  FOREIGN KEY (gid)
    REFERENCES genre(gid)
    ON DELETE CASCADE

) ENGINE = INNODB;

CREATE TABLE festival_genre (
  fid INT NOT NULL,
  gid INT NOT NULL,
  INDEX fid_ind (fid),
  INDEX gid_ind (gid),

  FOREIGN KEY (fid)
    REFERENCES festival(fid)
    ON DELETE CASCADE,
  FOREIGN KEY (gid)
    REFERENCES genre(gid)
    ON DELETE CASCADE

) ENGINE = INNODB;

CREATE TABLE history (
  uid INT NOT NULL,
  fid INT NOT NULL,
  INDEX uid_ind (uid),
  INDEX fid_ind (fid),

  FOREIGN KEY (uid)
    REFERENCES user(uid)
    ON DELETE CASCADE,
  FOREIGN KEY (fid)
    REFERENCES festival(fid)
    ON DELETE CASCADE
) ENGINE = INNODB;

CREATE TABLE leader (
  lid INT NOT NULL,
  target_festival INT NOT NULL,
  title VARCHAR(64) NOT NULL,
  date_from DATETIME NOT NULL,
  date_until DATETIME NOT NULL,

  INDEX lid_ind (lid),
  INDEX target_ind (target_festival),
  INDEX title_ind (title),

  FOREIGN KEY (target_festival)
    REFERENCES festival(fid)
    ON DELETE CASCADE,
  FOREIGN KEY (lid)
    REFERENCES user(uid)
    ON DELETE CASCADE
) ENGINE = INNODB;

CREATE TABLE request (
  lid INT NOT NULL,
  follower INT NOT NULL,
  target_festival INT NOT NULL,

  INDEX lid_ind (lid),
  INDEX follower_ind (follower),
  INDEX target_ind (target_festival),

  FOREIGN KEY (target_festival)
    REFERENCES festival(fid)
    ON DELETE CASCADE,
  FOREIGN KEY (lid)
    REFERENCES user(uid)
    ON DELETE CASCADE,
  FOREIGN KEY (follower)
    REFERENCES user(uid)
    ON DELETE CASCADE

) ENGINE = INNODB;
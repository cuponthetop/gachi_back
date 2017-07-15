USE gachi

INSERT INTO user VALUES
(NULL, 'test1', NULL, NULL, NULL, NULL),
('http://www.iconarchive.com/show/small-n-flat-icons-by-paomedia/sign-check-icon.html', 'test2', NULL, NULL, NULL, NULL),
(NULL, 'test3', '20', NULL, NULL, NULL),
(NULL, 'test4', NULL, 'female', NULL, NULL),
(NULL, 'test5', NULL, NULL, 10.3, NULL),
(NULL, 'test6', NULL, NULL, NULL, 'SEOUL'),
(NULL, '한글', NULL, NULL, NULL, NULL);

INSERT INTO festival VALUES
('fest1', NULL, NULL),
('fest2', 'SEOUL', NULL),
('fest3', 'BUSAN', NULL),
('fest4', NULL,  '2017-07-15 04:00:00');

INSERT INTO genre VALUES
('CONCERT'),
('MUSIC'),
('FESTIVAL');

INSERT INTO fav_genre VALUES
();

INSERT INTO festival_genre VALUES
();

INSERT INTO historyleader VALUES
();

INSERT INTO request VALUES
();
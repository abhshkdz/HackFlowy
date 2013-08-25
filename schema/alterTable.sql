ALTER TABLE `tasks` 
ADD COLUMN `is_completed` CHAR(1) 
NOT NULL  AFTER `parent_id` ;

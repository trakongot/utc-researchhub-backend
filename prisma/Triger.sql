CREATE OR REPLACE FUNCTION check_file_limit() RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM project_result_file WHERE result_outline_id = NEW.result_outline_id) >= 10 THEN
    RAISE EXCEPTION 'Maximum file limit of 10 reached for this project result';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER limit_files_per_outline
BEFORE INSERT ON project_result_file
FOR EACH ROW EXECUTE FUNCTION check_file_limit();
import { executeQuery, fetchQuery } from './database.js';

// Salvar uma nova anotação
export const saveAnnotation = async (annotation) => {
  const { date, cause, stressLevel, startTime, endTime, description } = annotation;
  const query = `
    INSERT INTO annotations (date, cause, stressLevel, startTime, endTime, description)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  await executeQuery(query, [date, cause, stressLevel, startTime, endTime, description]);
};

export const getAllAnnotations = async () => {
  const query = `
    SELECT id, date, cause, stressLevel, startTime, endTime , description
    FROM annotations
    ORDER BY date DESC;
  `;
  const result = await fetchQuery(query);
  return result;
};

export const getAnnotationsByDate = async (date) => {
  const query = `
  SELECT id, date, cause, stressLevel, startTime, endTime, description
  FROM annotations
  WHERE date = ?
  ORDER BY startTime ASC;
`;
  const result = await fetchQuery(query, [date]);
  return result;
};

export const deleteAnnotation = async (id) => {
  const query = `DELETE FROM annotations WHERE id = ?;`;
  await executeQuery(query, [id]);
};

export const updateAnnotation = async (id, updatedAnnotation) => {
  const { date, cause, stressLevel, startTime, endTime, description } = updatedAnnotation;
  const query = `
    UPDATE annotations
    SET date = ?, cause = ?, stressLevel = ?, startTime = ?, endTime = ?, description = ?
    WHERE id = ?;
  `;
  await executeQuery(query, [date, cause, stressLevel, startTime, endTime, description, id]);
};


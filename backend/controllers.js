import { executeQuery, fetchQuery } from './database.js';

// Salvar uma nova anotação
export const saveAnnotation = async (annotation) => {
    const { date, cause, stressLevel, startTime, endTime } = annotation;
    const query = `
    INSERT INTO annotations (date, cause, stressLevel, startTime, endTime)
    VALUES (?, ?, ?, ?, ?);
  `;
    await executeQuery(query, [date, cause, stressLevel, startTime, endTime]);
};

// Buscar anotações agrupadas por data
export const getGroupedAnnotations = async () => {
    const query = `
    SELECT date, GROUP_CONCAT(cause || ' (Stress: ' || stressLevel || ')') as annotations
    FROM annotations
    GROUP BY date
    ORDER BY date DESC;
  `;
    const result = await fetchQuery(query);
    return result;
};

import { API_BASE_URL } from "@env";

/**
 * Busca anotações de uma data específica.
 * @param {string} date - Data no formato "YYYY-MM-DD".
 * @returns {Promise<Array>} Lista de anotações para a data.
 */
export const fetchAnnotationsByDate = async (date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/annotations/by-date?date=${date}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar anotações');
        }
        const data = await response.json();
        return data || []; // Retorna lista vazia se o banco não tiver registros
    } catch (error) {
        console.error(error);
        return []; // Retorna lista vazia em caso de erro
    }
};

/**
 * Salva uma nova anotação no servidor.
 * @param {Object} annotation - Dados da anotação.
 * @returns {Promise<Object>} Resposta do servidor.
 */
export const saveAnnotation = async (annotation) => {
    try {
        const response = await fetch(`${API_BASE_URL}/annotations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(annotation),
        });
        if (!response.ok) {
            throw new Error('Erro ao salvar anotação');
        }
        return response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao conectar com o servidor');
    }
};

/**
 * Busca todas as anotações do banco de dados.
 * @returns {Promise<Array>} Lista de anotações.
 */
export const fetchAllAnnotations = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/annotations`);
        if (!response.ok) {
            throw new Error('Erro ao buscar todas as anotações');
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const deleteAnnotation = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/annotations/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao deletar anotação');
        }
        return response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao conectar com o servidor');
    }
};

export const updateAnnotation = async (id, updatedAnnotation) => {
    try {
        const response = await fetch(`${API_BASE_URL}/annotations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAnnotation),
        });
        if (!response.ok) {
            console.log(updatedAnnotation)
            throw new Error('Erro ao atualizar anotação');
        }
        return response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao conectar com o servidor');
    }
};

export const fetchStressData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/stress-data`);
        if (!response.ok) throw new Error('Erro ao buscar dados de estresse');

        const data = await response.json();
        return data.map(entry => ({
            timestamp: new Date(entry.timestamp),
            stressLevel: parseInt(entry.stressLevel, 10),
        }));
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        return [];
    }
};

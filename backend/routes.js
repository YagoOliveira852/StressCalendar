import express from 'express';
import { saveAnnotation, getAllAnnotations, getAnnotationsByDate, deleteAnnotation, updateAnnotation } from './controllers.js';

const router = express.Router();

// Endpoint para salvar uma anotação
router.post('/annotations', async (req, res) => {
    const { date, cause, stressLevel, startTime, endTime, description } = req.body;

    if (!date || !cause || stressLevel === undefined || !startTime || !endTime || !description) {
        return res.status(400).send({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        await saveAnnotation(req.body);
        res.status(201).send({ message: 'Annotation saved successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error saving annotation' });
    }
});


// Endpoint para buscar anotações agrupadas
router.get('/annotations', async (req, res) => {
    try {
        const annotations = await getAllAnnotations();
        res.status(200).send(annotations);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching annotations' });
    }
});

// Endpoint para buscar anotações por data
router.get('/annotations/by-date', async (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).send({ error: 'Date parameter is required' });
    }

    try {
        const annotations = await getAnnotationsByDate(date);
        res.status(200).send(annotations || []); // Garante uma resposta consistente
    } catch (error) {
        res.status(500).send({ error: 'Error fetching annotations' });
    }
});

router.delete('/annotations/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ error: 'ID da anotação é obrigatório' });
    }

    try {
        await deleteAnnotation(id);
        res.status(200).send({ message: 'Anotação deletada com sucesso' });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao deletar a anotação' });
    }
});

router.put('/annotations/:id', async (req, res) => {
    const { id } = req.params;
    const { date, cause, stressLevel, startTime, endTime } = req.body;

    if (!date || !cause || stressLevel === undefined || !startTime || !endTime) {
        return res.status(400).send({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        await updateAnnotation(id, req.body);
        res.status(200).send({ message: 'Anotação atualizada com sucesso' });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao atualizar anotação' });
    }
});



export default router;

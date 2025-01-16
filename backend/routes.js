import express from 'express';
import { saveAnnotation, getGroupedAnnotations } from './controllers.js';

const router = express.Router();

// Endpoint para salvar uma anotação
router.post('/annotations', async (req, res) => {
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
        const annotations = await getGroupedAnnotations();
        res.status(200).send(annotations);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching annotations' });
    }
});

export default router;

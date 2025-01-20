import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verificar el método HTTP
    if (req.method !== 'GET') {
      return res
        .status(405)
        .json({ error: 'Method not allowed. Only GET requests are supported.' });
    }

    // Generar 1000 registros simulados
    const allData = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
    }));

    // Parámetros de consulta para paginación
    const { page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const start = (pageNumber - 1) * limitNumber;
    const paginatedData = allData.slice(start, start + limitNumber);

    // Responder con los datos paginados
    res.status(200).json({
      total: allData.length,
      page: pageNumber,
      limit: limitNumber,
      data: paginatedData,
    });
  } catch (error: any) {
    console.error('API error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

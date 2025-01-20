import { NextApiRequest, NextApiResponse } from 'next';

type Stat = {
  label: string;
  value: number;
};

type Data = {
  stats: Stat[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data | { error: string }>) {
  try {
    if (req.method !== 'GET') {
      // Si el método no es GET, retornamos un error
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Datos simulados
    const stats: Stat[] = [
      { label: 'Users', value: 1000 },
      { label: 'Posts', value: 250 },
      { label: 'Comments', value: 450 },
    ];

    // Retornamos la respuesta con un código 200
    res.status(200).json({ stats });
  } catch (error) {
    // Manejo de errores
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

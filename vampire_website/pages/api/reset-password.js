export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { token, newPassword } = req.body;

        try {
            const backendResponse = await fetch(`${process.env.backendURL}/auth/complete-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });
            const data = await backendResponse.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
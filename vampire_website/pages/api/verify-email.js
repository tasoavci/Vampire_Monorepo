export default async function handler(req, res) {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required' });
    }

    try {
        const backendResponse = await fetch(`${process.env.backendURL}/auth/verify-email?token=${token}`);
        const data = await backendResponse.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to connect to the backend service' });
    }
}
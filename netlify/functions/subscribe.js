exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);
    console.log('Subscribing email:', email);
    console.log('API key present:', !!process.env.BUTTONDOWN_API_KEY);

    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    console.log('Buttondown response status:', response.status);
    console.log('Buttondown response:', JSON.stringify(data));

    return {
      statusCode: response.ok ? 200 : 400,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log('Error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

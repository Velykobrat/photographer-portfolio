type ContactRequest = {
  name?: string;
  contact?: string;
  message?: string;
  website?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactRequest;

    const name = body.name?.trim();
    const contact = body.contact?.trim();
    const message = body.message?.trim() || '';

    // Honeypot для спам-ботів
    if (body.website) {
      return Response.json({ success: true });
    }

    if (!name || !contact) {
      return Response.json(
        { error: 'Name and contact are required' },
        { status: 400 }
      );
    }

    if (
      name.length > 100 ||
      contact.length > 200 ||
      message.length > 3000
    ) {
      return Response.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramToken || !telegramChatId) {
      console.error('Telegram environment variables are missing.');

      return Response.json(
        { error: 'Notification service is not configured' },
        { status: 500 }
      );
    }

    const text = [
      '📷 NEW PHOTOGRAPHY REQUEST',
      '',
      `Name: ${name}`,
      `Contact: ${contact}`,
      '',
      'Message:',
      message || '—',
    ].join('\n');

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text,
        }),
      }
    );

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text();

      console.error(
        'Telegram notification failed:',
        telegramError
      );

      return Response.json(
        { error: 'Failed to send notification' },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error('Contact API error:', error);

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
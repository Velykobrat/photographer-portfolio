type ContactRequest = {
  name?: string;
  contact?: string;
  message?: string;
  website?: string;
};

export async function POST(request: Request) {
    if (request.method !== 'POST') {
      return Response.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    try {
      const body = (await request.json()) as ContactRequest;

      const name = body.name?.trim();
      const contact = body.contact?.trim();
      const message = body.message?.trim() || '';

      // Honeypot — бот заповнив приховане поле.
      // Повертаємо success, але нічого не надсилаємо.
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

      const resendApiKey = process.env.RESEND_API_KEY;
      const emailTo = process.env.CONTACT_EMAIL_TO;
      const emailFrom = process.env.CONTACT_EMAIL_FROM;

      const text = [
        '📷 NEW PHOTOGRAPHY REQUEST',
        '',
        `Name: ${name}`,
        `Contact: ${contact}`,
        '',
        'Message:',
        message || '—',
      ].join('\n');

      const tasks: Promise<Response>[] = [];

      if (telegramToken && telegramChatId) {
        tasks.push(
          fetch(
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
          )
        );
      }

      if (
        resendApiKey &&
        emailTo &&
        emailFrom
      ) {
        tasks.push(
          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: emailFrom,
              to: [emailTo],
              subject: `New photography request — ${name}`,
              text,
            }),
          })
        );
      }

      if (tasks.length === 0) {
        console.error('No notification channels configured.');

        return Response.json(
          { error: 'Notification service is not configured' },
          { status: 500 }
        );
      }

      const results = await Promise.allSettled(tasks);

      const delivered = results.some(
        (result) =>
          result.status === 'fulfilled' &&
          result.value.ok
      );

      if (!delivered) {
        console.error('All notification channels failed.');

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
  },
};
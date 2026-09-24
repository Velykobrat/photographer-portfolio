/// <reference types="node" />

type ContactRequest = {
  name?: string;
  contact?: string;
  shootType?: string;
  preferredDate?: string;
  location?: string;
  message?: string;
  consent?: boolean;
  website?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactRequest;

    const name = body.name?.trim();
    const contact = body.contact?.trim();
    const shootType = body.shootType?.trim();

    const preferredDate =
      body.preferredDate?.trim() || '';

    const location =
      body.location?.trim() || '';

    const message =
      body.message?.trim() || '';

    // Honeypot
    if (body.website) {
      return Response.json({ success: true });
    }

    // Consent
    if (body.consent !== true) {
      return Response.json(
        { error: 'Consent is required' },
        { status: 400 }
      );
    }

    // Required fields
    if (!name || !contact || !shootType) {
      return Response.json(
        {
          error:
            'Name, contact and shoot type are required',
        },
        { status: 400 }
      );
    }

    // Basic length validation
    if (
      name.length > 100 ||
      contact.length > 200 ||
      shootType.length > 100 ||
      location.length > 200 ||
      message.length > 3000
    ) {
      return Response.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Prevent past dates
    if (preferredDate) {
      const selectedDate = new Date(
        `${preferredDate}T00:00:00`
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (
        Number.isNaN(selectedDate.getTime()) ||
        selectedDate < today
      ) {
        return Response.json(
          { error: 'Invalid preferred date' },
          { status: 400 }
        );
      }
    }

    const telegramToken =
      process.env.TELEGRAM_BOT_TOKEN;

    const telegramChatId =
      process.env.TELEGRAM_CHAT_ID;

    const brevoApiKey =
      process.env.BREVO_API_KEY;

    const emailTo =
      process.env.CONTACT_EMAIL_TO;

    const emailFrom =
      process.env.CONTACT_EMAIL_FROM;

    // Temporary diagnostic
    console.log('ENV CHECK:', {
      TELEGRAM_BOT_TOKEN: Boolean(telegramToken),
      TELEGRAM_CHAT_ID: Boolean(telegramChatId),
      BREVO_API_KEY: Boolean(brevoApiKey),
      CONTACT_EMAIL_TO: Boolean(emailTo),
      CONTACT_EMAIL_FROM: Boolean(emailFrom),
    });

    const text = [
      '📷 NEW PHOTOGRAPHY REQUEST',
      '',
      `Name: ${name}`,
      `Contact: ${contact}`,
      `Type: ${shootType}`,
      '',
      `Preferred date: ${preferredDate || '—'}`,
      `Location: ${location || '—'}`,
      '',
      'Message:',
      message || '—',
    ].join('\n');

    const tasks: Promise<Response>[] = [];

    // Telegram
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

    // Brevo
    if (brevoApiKey && emailTo && emailFrom) {
      tasks.push(
        fetch(
          'https://api.brevo.com/v3/smtp/email',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
              'api-key': brevoApiKey,
              accept: 'application/json',
            },

            body: JSON.stringify({
              sender: {
                name: 'MK Photography',
                email: emailFrom,
              },

              to: [
                {
                  email: emailTo,
                },
              ],

              subject:
                `New photography request — ${name}`,

              textContent: text,
            }),
          }
        )
      );
    }

    if (tasks.length === 0) {
      return Response.json(
        {
          error:
            'Notification service is not configured',
        },
        { status: 500 }
      );
    }

    const results =
      await Promise.allSettled(tasks);

    const delivered = results.some(
      (result) =>
        result.status === 'fulfilled' &&
        result.value.ok
    );

    if (!delivered) {
      console.error(
        'Notification delivery failed:',
        results
      );

      return Response.json(
        {
          error:
            'Failed to send notification',
        },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(
      'Contact API error:',
      error
    );

    return Response.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
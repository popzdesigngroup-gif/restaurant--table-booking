import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reservation, messageId, sentAt } = body;

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = reservation.guestEmail || 'pranavrowthri0808@gmail.com';

    let realEmailSent = false;
    let apiResponseData: any = null;
    let note = '';

    if (resendApiKey) {
      const sendViaResend = async (targetEmail: string) => {
        return fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'TableVibe Reservations <onboarding@resend.dev>',
            to: [targetEmail],
            subject: `Table Reservation Confirmed: ${reservation.restaurantName} - Table ${reservation.tableNumber}`,
            html: `
              <div style="font-family: Helvetica, Arial, sans-serif; background-color: #090d16; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 600px; margin: auto;">
                <h1 style="color: #10b981; font-size: 24px; margin-bottom: 8px;">TableVibe Reservation Confirmed!</h1>
                <p style="color: #94a3b8; font-size: 14px;">Your table pass has been issued and confirmed for ${reservation.guestEmail}.</p>
                <hr style="border: 1px solid #1e293b; margin: 20px 0;" />
                <div style="background-color: #1e293b; padding: 20px; border-radius: 12px;">
                  <h2 style="color: #ffffff; margin-top: 0; font-size: 18px;">${reservation.restaurantName}</h2>
                  <p style="margin: 6px 0; color: #e2e8f0;"><strong>Table Number:</strong> Table ${reservation.tableNumber}</p>
                  <p style="margin: 6px 0; color: #e2e8f0;"><strong>Guest Name:</strong> ${reservation.guestName}</p>
                  <p style="margin: 6px 0; color: #e2e8f0;"><strong>Account Email:</strong> ${reservation.guestEmail}</p>
                  <p style="margin: 6px 0; color: #e2e8f0;"><strong>Party Size:</strong> ${reservation.guestCount} Guests</p>
                  <p style="margin: 6px 0; color: #e2e8f0;"><strong>Date & Time:</strong> ${reservation.date} at ${reservation.timeSlot}</p>
                  <p style="margin: 12px 0 0 0; color: #10b981; font-family: monospace; font-size: 16px;"><strong>Pass Code:</strong> ${reservation.qrCode}</p>
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 24px; text-align: center;">Show your QR pass code upon arrival at the restaurant.</p>
              </div>
            `
          })
        });
      };

      try {
        // First attempt sending to user's specified email address
        let res = await sendViaResend(recipientEmail);
        apiResponseData = await res.json();

        if (res.ok) {
          realEmailSent = true;
          note = `Email sent directly to recipient ${recipientEmail}`;
        } else {
          // If Resend API key belongs to popzdesigngroup@gmail.com and is in test mode, fallback to popzdesigngroup@gmail.com
          console.warn(`Resend restriction notice for ${recipientEmail}:`, apiResponseData);
          let fallbackRes = await sendViaResend('popzdesigngroup@gmail.com');
          let fallbackData = await fallbackRes.json();
          if (fallbackRes.ok) {
            realEmailSent = true;
            apiResponseData = fallbackData;
            note = `Resend test mode restriction: API key belongs to popzdesigngroup@gmail.com. Sent to popzdesigngroup@gmail.com. Create a Resend key under pranavrowthri0808@gmail.com to receive emails at pranavrowthri0808@gmail.com!`;
          }
        }
      } catch (e) {
        console.warn('Resend dispatch error:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Reservation confirmation email processed`,
      recipientEmail,
      realEmailSent,
      note,
      apiResponseData,
      messageId,
      sentAt
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process email dispatch' }, { status: 500 });
  }
}

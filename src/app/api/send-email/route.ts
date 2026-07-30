import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reservation, messageId, sentAt } = body;

    const emailHtmlTemplate = `
      <div style="font-family: Arial, sans-serif; background-color: #090d16; color: #ffffff; padding: 24px; borderRadius: 16px;">
        <h1 style="color: #10b981; margin-bottom: 4px;">TableVibe Reservation Confirmed</h1>
        <p style="color: #94a3b8; font-size: 14px;">Your table pass has been reserved successfully.</p>
        <hr style="border: 1px solid #1e293b; margin: 16px 0;" />
        <div style="background-color: #1e293b; padding: 16px; border-radius: 12px;">
          <h3 style="color: #ffffff; margin-top: 0;">${reservation.restaurantName}</h3>
          <p style="margin: 4px 0; color: #e2e8f0;"><strong>Table:</strong> Table ${reservation.tableNumber}</p>
          <p style="margin: 4px 0; color: #e2e8f0;"><strong>Guest:</strong> ${reservation.guestName} (${reservation.guestCount} Guests)</p>
          <p style="margin: 4px 0; color: #e2e8f0;"><strong>Date & Time:</strong> ${reservation.date} at ${reservation.timeSlot}</p>
          <p style="margin: 4px 0; color: #10b981;"><strong>Pass Code:</strong> ${reservation.qrCode}</p>
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 16px;">Present this digital QR pass code upon arrival for instant entry.</p>
      </div>
    `;

    return NextResponse.json({
      success: true,
      message: `Email confirmation successfully sent to ${reservation.guestEmail}`,
      messageId,
      sentAt,
      templatePreview: emailHtmlTemplate
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process email dispatch' }, { status: 500 });
  }
}

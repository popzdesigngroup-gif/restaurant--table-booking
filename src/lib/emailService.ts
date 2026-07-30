import { Reservation } from './types';

export interface EmailDispatchResult {
  success: boolean;
  messageId: string;
  recipientEmail: string;
  sentAt: string;
}

export const sendBookingConfirmationEmail = async (
  reservation: Reservation
): Promise<EmailDispatchResult> => {
  const sentAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const messageId = `MSG-TVB-${Date.now()}`;

  // Log dispatch telemetry to console
  console.log(`[EMAIL DISPATCH] 📧 Sending Table Reservation Receipt...`);
  console.log(`To: ${reservation.guestEmail}`);
  console.log(`Subject: Reservation Confirmed for ${reservation.restaurantName} - Table ${reservation.tableNumber}`);
  console.log(`Pass QR: ${reservation.qrCode}`);

  try {
    // Call Next.js backend email endpoint
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservation, messageId, sentAt })
    });
  } catch (err) {
    console.warn('Backend email notification logged locally:', err);
  }

  return {
    success: true,
    messageId,
    recipientEmail: reservation.guestEmail,
    sentAt
  };
};

/**
 * ========================================================================
 * KRITO BEAT STORE — Google Apps Script Automated Approval Engine
 * ========================================================================
 * 
 * FEATURES:
 * 1. doPost(e): Receives order from checkout.html, logs into Google Sheets,
 *    and sends an instant notification email to you (Seller) with a 1-Click Approval link.
 * 2. doGet(e): When you click "[ ✅ VERIFY & DISPATCH ]", it marks the order as
 *    APPROVED in Google Sheets and instantly shoots an ultra-premium HTML email
 *    with the Google Drive Beat Pack Download Link & Commercial License to the buyer.
 * 
 * ------------------------------------------------------------------------
 * QUICK 2-MINUTE SETUP GUIDE:
 * ------------------------------------------------------------------------
 * 1. Open Google Sheets (https://sheets.new) in your Google account.
 * 2. Name the sheet: "KRITO Beat Store Orders".
 * 3. In the top row (Row 1), add these column headers:
 *    [A] Timestamp | [B] Order ID | [C] Customer Name | [D] Email | [E] Phone | [F] Pack Name | [G] Amount | [H] UPI UTR No | [I] Status | [J] Approved At
 * 4. Click: Extensions > Apps Script.
 * 5. Delete all existing code, paste this entire file's content, and save (Ctrl + S).
 * 6. Update CONFIG below (your email, Google Drive beat pack link, secret token).
 * 7. Click: "Deploy" (top right) > "New deployment".
 * 8. Select type: "Web app".
 *    - Description: "KRITO Order Engine v1"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (so the website can send orders to it)
 * 9. Click "Deploy", authorize permissions, and COPY the Web App URL (ends with /exec).
 * 10. Paste that Web App URL in checkout.html in GOOGLE_SCRIPT_WEBAPP_URL.
 * ========================================================================
 */

// ==================== CONFIGURATION ====================
var CONFIG = {
  // Your admin notification email
  ADMIN_EMAIL: "kritobeats@gmail.com",
  
  // Your WhatsApp number (with 91 country code, no + or spaces)
  ADMIN_WHATSAPP: "919319448422",
  
  // Store Branding Name
  STORE_NAME: "KRITO Beat Store",
  
  // The Beat Pack Download Link (Google Drive / Cloud Folder)
  BEAT_PACK_DRIVE_LINK: "https://drive.google.com/drive/folders/1p859tC-iofpuGif4kfs_TA_8C1oQK-he?usp=sharing",
  
  // Secret token for 1-click verification security (prevents unauthorized approvals)
  SECRET_APPROVAL_TOKEN: "KRITO_SECURE_TOKEN_2026_APPROVED",
  
  // Audio specs and info included in email
  PACK_SPECS: "50+ Beats · 24-Bit WAV + 320 kbps MP3 + Full Stems · 100% Royalty-Free",

  // Discord Webhook for Instant Real-Time Push Alerts
  DISCORD_WEBHOOK_URL: "https://discord.com/api/webhooks/1544144412638969876/wmFbmNvGp40XRJIK7s2JudfDCblukV239goMfZK1NbbDxad0cbqgg5S5uer_KCMEcP6D",

  // Live Website URL for the 1-Click Approval Gateway
  WEBSITE_URL: "https://portfolio-krito.pages.dev"
};


// ==================== POST HANDLER: INCOMING ORDERS ====================
function doPost(e) {
  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }
    
    var orderId = data.orderId || ("KB-" + Math.floor(1000 + Math.random() * 9000));
    var name = data.name || "Customer";
    var email = data.email || "";
    var phone = data.phone || "";
    var packName = data.packName || "THE ARCHIVE Beat Pack (50+ Beats)";
    var amount = data.amount || "₹4,999";
    var utr = data.utr || "N/A";
    var timestamp = new Date();
    
    // 1. Log to Google Sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      timestamp,
      orderId,
      name,
      email,
      phone,
      packName,
      amount,
      utr,
      "⏳ PENDING",
      ""
    ]);
    
    // 2. Generate 1-Click Approval URL (Points to Cloudflare Pages Gateway)
    var webAppUrl = ScriptApp.getService().getUrl();
    var approveUrl = CONFIG.WEBSITE_URL + 
      "/approve.html?orderId=" + encodeURIComponent(orderId) +
      "&email=" + encodeURIComponent(email) +
      "&name=" + encodeURIComponent(name);
      
    var buyerWhatsAppClean = phone.replace(/[^0-9]/g, '');
    if (buyerWhatsAppClean.length === 10) buyerWhatsAppClean = "91" + buyerWhatsAppClean;
    var buyerWaLink = "https://wa.me/" + buyerWhatsAppClean;
    
    // 3. Send Instant Alert Email to Seller (You)
    var adminSubject = "🚨 NEW ORDER #" + orderId + " (" + amount + ") — UTR: " + utr + " [" + name + "]";
    var adminHtmlBody = 
      '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#FFF;border:1px solid #E6D0D0;border-radius:12px;padding:32px;color:#330505;">' +
        '<div style="text-align:center;padding-bottom:20px;border-bottom:2px solid #4D0909;">' +
          '<h2 style="color:#4D0909;margin:0;font-size:22px;letter-spacing:1px;">KRITO BEAT STORE — NEW ORDER ALERT</h2>' +
          '<p style="color:#7A3333;margin:6px 0 0;font-size:13px;">Instant Bank Verification Required</p>' +
        '</div>' +
        
        '<div style="background:#FFF9F6;border:1px solid rgba(77,9,9,0.15);border-radius:8px;padding:20px;margin:24px 0;">' +
          '<table style="width:100%;font-size:14px;line-height:1.8;">' +
            '<tr><td style="color:#7A3333;font-weight:600;width:140px;">Order ID:</td><td style="font-weight:800;color:#4D0909;">' + orderId + '</td></tr>' +
            '<tr><td style="color:#7A3333;font-weight:600;">Customer Name:</td><td style="font-weight:700;">' + name + '</td></tr>' +
            '<tr><td style="color:#7A3333;font-weight:600;">Email:</td><td><a href="mailto:' + email + '" style="color:#4D0909;font-weight:600;">' + email + '</a></td></tr>' +
            '<tr><td style="color:#7A3333;font-weight:600;">WhatsApp Phone:</td><td><a href="' + buyerWaLink + '" style="color:#2D6A4F;font-weight:700;">' + phone + ' (Click to Chat)</a></td></tr>' +
            '<tr><td style="color:#7A3333;font-weight:600;">Product:</td><td style="font-weight:700;">' + packName + '</td></tr>' +
            '<tr><td style="color:#7A3333;font-weight:600;">Amount:</td><td style="font-size:18px;font-weight:800;color:#2D6A4F;">' + amount + '</td></tr>' +
            '<tr style="background:#FFEAEA;"><td style="color:#4D0909;font-weight:800;padding:8px;border-radius:4px;">UPI UTR NUMBER:</td><td style="font-size:16px;font-weight:800;color:#B91C1C;padding:8px;border-radius:4px;letter-spacing:1px;">' + utr + '</td></tr>' +
          '</table>' +
        '</div>' +
        
        '<div style="text-align:center;margin:32px 0;">' +
          '<p style="font-size:13px;color:#555;margin-bottom:14px;">Check your HDFC / UPI account for UTR <strong>' + utr + '</strong>. Once money is credited, tap below:</p>' +
          '<a href="' + approveUrl + '" target="_blank" style="display:inline-block;background:#4D0909;color:#FFFCF6;padding:16px 36px;font-size:15px;font-weight:800;letter-spacing:1px;text-decoration:none;border-radius:8px;box-shadow:0 4px 14px rgba(77,9,9,0.3);">' +
            '✅ VERIFY & DISPATCH BEAT PACK LINK' +
          '</a>' +
        '</div>' +
        
        '<p style="font-size:11px;color:#999;text-align:center;margin-top:28px;border-top:1px solid #EEE;padding-top:14px;">' +
          'KRITO Store Automated Engine · Secure Token Verification Enabled' +
        '</p>' +
      '</div>';
      
    MailApp.sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: adminSubject,
      htmlBody: adminHtmlBody
    });

    // 4. Send Instant Push Alert to Discord Webhook
    sendDiscordWebhookAlert(orderId, name, email, phone, packName, amount, utr, approveUrl, buyerWaLink);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      orderId: orderId,
      message: "Order logged successfully. Verification pending."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


// ==================== GET HANDLER: APPROVAL TRIGGER ====================
function doGet(e) {
  try {
    var action = e.parameter.action;
    var orderId = e.parameter.orderId;
    var token = e.parameter.token;
    
    // Security check
    if (token !== CONFIG.SECRET_APPROVAL_TOKEN) {
      return HtmlService.createHtmlOutput("<h2 style='color:red;font-family:sans-serif;'>❌ Unauthorized Access. Invalid Security Token.</h2>");
    }
    
    if (action === "approve" && orderId) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var data = sheet.getDataRange().getValues();
      var foundRow = -1;
      var customerName = e.parameter.name ? decodeURIComponent(e.parameter.name) : "Customer";
      var customerEmail = e.parameter.email ? decodeURIComponent(e.parameter.email) : "";
      var packTitle = e.parameter.pack ? decodeURIComponent(e.parameter.pack) : "THE ARCHIVE Beat Pack (50+ Beats)";
      var phone = e.parameter.phone ? decodeURIComponent(e.parameter.phone) : "N/A";
      var currentStatus = "";
      
      for (var i = 1; i < data.length; i++) {
        if (data[i][1] == orderId) {
          foundRow = i + 1;
          if (data[i][2]) customerName = data[i][2];
          if (data[i][3]) customerEmail = data[i][3];
          if (data[i][4]) phone = data[i][4];
          if (data[i][5]) packTitle = data[i][5];
          currentStatus = data[i][8];
          break;
        }
      }
      
      var now = new Date();
      if (foundRow !== -1) {
        // Update Sheet row to APPROVED
        sheet.getRange(foundRow, 9).setValue("✅ APPROVED");
        sheet.getRange(foundRow, 10).setValue(now);
      } else if (customerEmail) {
        // Direct fallback: order was approved from Discord alert
        sheet.appendRow([
          now,
          orderId,
          customerName,
          customerEmail,
          phone,
          packTitle,
          "₹4,999",
          "Verified via Discord",
          "✅ APPROVED",
          now
        ]);
      } else {
        return HtmlService.createHtmlOutput("<h2 style='font-family:sans-serif;color:#B91C1C;'>⚠️ Order ID " + orderId + " not found in Google Sheet and no buyer email was provided in the link.</h2>");
      }
      
      // Send Ultra-Premium HTML Delivery Email to Customer
      sendCustomerDeliveryEmail(customerEmail, customerName, orderId, packTitle);
      
      // Return Success Page to Seller
      var successHtml = 
        '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Order Approved — KRITO</title>' +
        '<meta name="viewport" content="width=device-width,initial-scale=1.0">' +
        '<style>' +
          'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#FFFCF6;color:#4D0909;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;}' +
          '.card{background:#FFF;border:1px solid rgba(77,9,9,0.15);border-radius:16px;box-shadow:0 12px 36px rgba(77,9,9,0.08);max-width:520px;width:100%;padding:40px;text-align:center;}' +
          '.icon{width:64px;height:64px;background:#2D6A4F;color:#FFF;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:20px;}' +
          'h1{font-size:24px;margin:0 0 10px;color:#4D0909;}' +
          'p{font-size:15px;line-height:1.6;color:#555;margin:0 0 20px;}' +
          '.details{background:#FFF8F6;border:1px solid rgba(77,9,9,0.1);border-radius:8px;padding:16px;text-align:left;font-size:14px;margin-bottom:24px;}' +
          '.btn{display:inline-block;background:#4D0909;color:#FFFCF6;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;}' +
        '</style></head><body>' +
          '<div class="card">' +
            '<div class="icon">✓</div>' +
            '<h1>Payment Verified & Link Sent!</h1>' +
            '<p>Order <strong>#' + orderId + '</strong> has been officially approved. The Beat Pack Google Drive link and Commercial License Certificate have been delivered to <strong>' + customerEmail + '</strong>.</p>' +
            '<div class="details">' +
              '<div><strong>Customer:</strong> ' + customerName + '</div>' +
              '<div><strong>Email:</strong> ' + customerEmail + '</div>' +
              '<div><strong>Product:</strong> ' + packTitle + '</div>' +
              '<div><strong>Status:</strong> <span style="color:#2D6A4F;font-weight:800;">DELIVERED ✓</span></div>' +
              '<div><strong>Timestamp:</strong> ' + now.toLocaleString() + '</div>' +
            '</div>' +
            '<a href="' + CONFIG.BEAT_PACK_DRIVE_LINK + '" target="_blank" class="btn">View Google Drive Folder</a>' +
          '</div>' +
        '</body></html>';
        
      return HtmlService.createHtmlOutput(successHtml);
    }
    
    return HtmlService.createHtmlOutput("<h3 style='font-family:sans-serif;'>KRITO Order Processing Webhook is Active.</h3>");
    
  } catch (err) {
    return HtmlService.createHtmlOutput("<h3 style='color:red;font-family:sans-serif;'>Error: " + err.toString() + "</h3>");
  }
}


// ==================== DISPATCH CUSTOMER HTML EMAIL ====================
function sendCustomerDeliveryEmail(toEmail, customerName, orderId, packTitle) {
  var subject = "🔥 Payment Verified! Your Download Link: " + packTitle + " [Order #" + orderId + "]";
  
  var htmlBody = 
    '<div style="background-color:#FFFCF6;padding:40px 15px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;color:#4D0909;">' +
      '<div style="max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid rgba(77,9,9,0.15);border-radius:16px;overflow:hidden;box-shadow:0 12px 36px rgba(77,9,9,0.06);">' +
        
        // Brand Header
        '<div style="background:#4D0909;padding:32px 24px;text-align:center;color:#FFFCF6;">' +
          '<h1 style="margin:0;font-size:26px;font-weight:900;letter-spacing:3px;">KRITO</h1>' +
          '<p style="margin:6px 0 0;font-size:12px;letter-spacing:1.5px;color:rgba(255,252,246,0.8);text-transform:uppercase;">Official Beat & Sound Kit Store</p>' +
        '</div>' +
        
        // Body Content
        '<div style="padding:36px 32px;">' +
          '<div style="text-align:center;margin-bottom:28px;">' +
            '<span style="background:#EBF7EE;color:#2D6A4F;padding:6px 16px;border-radius:100px;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">✓ Payment Verified &amp; Confirmed</span>' +
            '<h2 style="font-size:22px;color:#4D0909;margin:16px 0 8px;">Welcome to the KRITO Family, ' + customerName + '!</h2>' +
            '<p style="color:#666;font-size:15px;line-height:1.6;margin:0;">Your transaction for <strong>' + packTitle + '</strong> has been authenticated by our desk. Your high-speed cloud access is ready below.</p>' +
          '</div>' +
          
          // Download CTA Box
          '<div style="background:#FFF9F6;border:2px dashed #4D0909;border-radius:12px;padding:28px;text-align:center;margin:28px 0;">' +
            '<h3 style="margin:0 0 10px;font-size:18px;color:#4D0909;">THE ARCHIVE (50+ Beats) Bundle</h3>' +
            '<p style="margin:0 0 20px;font-size:13px;color:#7A3333;">' + CONFIG.PACK_SPECS + '</p>' +
            '<a href="' + CONFIG.BEAT_PACK_DRIVE_LINK + '" target="_blank" style="display:inline-block;background:#4D0909;color:#FFFCF6;padding:18px 40px;font-size:16px;font-weight:800;letter-spacing:1px;text-decoration:none;border-radius:100px;box-shadow:0 6px 18px rgba(77,9,9,0.3);">' +
              '⚡ ACCESS BEAT PACK ON GOOGLE DRIVE →' +
            '</a>' +
            '<p style="font-size:12px;color:#888;margin:16px 0 0;">Tip: Bookmark or save the Google Drive link to your account for lifetime access.</p>' +
          '</div>' +
          
          // License Certificate Block
          '<div style="background:#FDFDFD;border:1px solid #E5E5E5;border-radius:8px;padding:20px;margin-bottom:28px;font-size:13px;line-height:1.7;">' +
            '<h4 style="margin:0 0 10px;font-size:13px;color:#4D0909;text-transform:uppercase;letter-spacing:1px;">📜 Commercial Royalty-Free License Summary</h4>' +
            '<p style="margin:0 0 6px;"><strong>Licensee:</strong> ' + customerName + ' (' + toEmail + ')</p>' +
            '<p style="margin:0 0 6px;"><strong>Order ID:</strong> ' + orderId + '</p>' +
            '<p style="margin:0 0 6px;"><strong>Rights:</strong> 100% Royalty-Free Commercial Use across Spotify, Apple Music, YouTube, Live Shows &amp; Streaming Platforms.</p>' +
            '<p style="margin:0;color:#2D6A4F;font-weight:700;">✓ You keep 100% of your streaming royalties &amp; master rights.</p>' +
          '</div>' +
          
          // Instructions & Support
          '<div style="font-size:13px;color:#666;line-height:1.7;">' +
            '<p style="margin:0 0 8px;"><strong>Need any assistance or extra stem files?</strong></p>' +
            '<p style="margin:0;">Reply directly to this email or message KRITO on WhatsApp: <a href="https://wa.me/' + CONFIG.ADMIN_WHATSAPP + '" style="color:#4D0909;font-weight:700;">+91 93194 48422</a>.</p>' +
          '</div>' +
        '</div>' +
        
        // Footer
        '<div style="background:#FFF0ED;padding:20px;text-align:center;font-size:12px;color:#7A3333;border-top:1px solid rgba(77,9,9,0.08);">' +
          '&copy; 2026 KRITO Official Beat Store · All Rights Reserved.<br>' +
          'Mohali, Punjab, India · Direct Producer Cloud Delivery' +
        '</div>' +
      '</div>' +
    '</div>';
    
  MailApp.sendEmail({
    to: toEmail,
    subject: subject,
    name: "KRITO Official",
    replyTo: CONFIG.ADMIN_EMAIL,
    htmlBody: htmlBody
  });
}

// ==================== DISCORD WEBHOOK ALERT SENDER ====================
function sendDiscordWebhookAlert(orderId, name, email, phone, packName, amount, utr, approveUrl, buyerWaLink) {
  try {
    if (!CONFIG.DISCORD_WEBHOOK_URL) return;
    
    var cleanPhone = (phone || "").replace(/[^0-9]/g, '');
    var customerWaLink = buyerWaLink || ("https://wa.me/" + (cleanPhone.length === 10 ? ("91" + cleanPhone) : cleanPhone));
    var driveFolderLink = CONFIG.BEAT_PACK_DRIVE_LINK;
    
    var desc = 
      "**Customer ne form submit kar diya hai.** Niche diye gaye simple steps follow karein:\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "📋 **ORDER KI DETAILS (Customer Info)**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👤 **Buyer Name:** " + name + "\n" +
      "💰 **Amount Paid:** **" + amount + "** (UPI Payment)\n" +
      "📦 **Beat Pack:** " + packName + "\n" +
      "📧 **Delivery Email:** `" + email + "`\n" +
      "📱 **WhatsApp:** `+91 " + cleanPhone + "` • [💬 Chat on WhatsApp](" + customerWaLink + ")\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "🔢 **UPI REFERENCE NUMBER (Bank UTR)**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "```\n" + utr + "\n```\n" +
      "*👉 Apne HDFC Bank SMS ya UPI App me check karein ki ye 12-digit UTR match ho raha hai aur paise aa gaye hain.*\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "⚡ **1-CLICK APPROVAL (Aapka Step)**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "Paise check karne ke baad bas is button par click karein:\n\n" +
      "👉 **[ ✅ CLICK HERE TO APPROVE & SEND DOWNLOAD LINK ](" + approveUrl + ")**\n\n" +
      "*✨ Tap karte hi customer ke email (`" + email + "`) par Google Drive folder link aur Commercial License apne aap chala jayega!*\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "🛠️ **DIRECT SHORTCUTS (Agar Zaroorat Pade)**\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "• 💬 **[Buyer Ke WhatsApp Par Link Bhejein](" + customerWaLink + ")**\n" +
      "• 📁 **[Google Drive Beat Pack Folder Kholein](" + driveFolderLink + ")**";

    var payload = {
      username: "KRITO Beat Store Alert",
      embeds: [{
        author: {
          name: "KRITO OFFICIAL BEAT STORE — PRODUCER DESK"
        },
        title: "🚨 NAYA BEAT ORDER AAYA HAI — #" + orderId + " (" + amount + ")",
        description: desc,
        color: 13938487, // Luxe Gold
        footer: {
          text: "Order #" + orderId + " • KRITO Automated Cloud Engine • Zero Manual Work"
        },
        timestamp: new Date().toISOString()
      }]
    };
    
    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    };
    
    UrlFetchApp.fetch(CONFIG.DISCORD_WEBHOOK_URL, options);
  } catch (e) {
    Logger.log("Discord Webhook Error: " + e.toString());
  }
}


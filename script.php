<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get recipient email from the form
    $recipient_email = $_POST['emailInput']; // Assuming the input name is 'emailInput'

    // Other email parameters
    $subject = "Certificate Attachment";
    $message = "Please find the certificate attached.";

    // Create a boundary for the email
    $boundary = md5(time());

    // Headers
    $headers = "From: ines@zenkri.com\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    // Message body with attachment
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=ISO-8859-1\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= $message . "\r\n";

    // Path to the PDF file
    $file_path = __DIR__ . "/Certificate.pdf";

    // Read the PDF file content
    $file = file_get_contents($file_path);

    // Attach the PDF file
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: application/pdf; name=\"Certificate.pdf\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= "Content-Disposition: attachment; filename=\"Certificate.pdf\"\r\n\r\n";
    $body .= chunk_split(base64_encode($file)) . "\r\n";
    $body .= "--$boundary--";

    // Send the email
    if (mail($recipient_email, $subject, $body, $headers)) {
        echo "Email sent successfully!";
    } else {
        echo "Email sending failed.";
    }
}
?>
